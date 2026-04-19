resource "kubernetes_namespace" "argocd" {
  metadata {
    name = "argocd"
    labels = {
      environment = var.environment
      managed_by  = "terraform"
    }
  }
}

resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = kubernetes_namespace.argocd.metadata.0.name

  set = [{
    name  = "server.service.type"
    value = "ClusterIP"
  }]

  wait       = true
  timeout    = 200
  depends_on = [kubernetes_namespace.argocd]
}

resource "kubernetes_manifest" "argocd_application" {
  manifest = {
    apiVersion = "argoproj.io/v1alpha1"
    kind       = "Application"
    metadata = {
      name      = "${var.project_name}-${var.environment}"
      namespace = "argocd"
    }
    spec = {
      project = "default"
      source = {
        repoURL        = var.repo_url
        targetRevision = var.repo_branch
        path           = var.k8s_manifests_path
      }
      destination = {
        server    = "https://kubernetes.default.svc"
        namespace = var.project_name
      }
      syncPolicy = {
        automated = {
          prune    = true
          selfHeal = true
        }
        syncOptions = ["CreateNamespace=true"]
      }
    }
  }

  depends_on = [helm_release.argocd]
}