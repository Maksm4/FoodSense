resource "kubernetes_namespace_v1" "argocd" {
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
  namespace  = kubernetes_namespace_v1.argocd.metadata.0.name

  set = [{
    name  = "server.service.type"
    value = "ClusterIP"
  }]

  wait       = true
  timeout    = 200
  depends_on = [kubernetes_namespace_v1.argocd]
}