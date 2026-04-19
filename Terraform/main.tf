
module "aks" {
  source = "./modules/aks"

  project_name  = var.project_name
  environment   = var.environment
  location      = var.location
  node_count    = var.node_count
  vm_size       = var.vm_size
  ghcr_username = var.ghcr_username
  ghcr_pat      = var.ghcr_pat
  tags          = []
}

module "argocd" {
  source = "./modules/argocd"

  project_name       = var.project_name
  repo_url           = var.repo_url
  environment        = var.environment
  repo_branch        = var.repo_branch
  k8s_manifests_path = var.k8s_manifests_path
  depends_on         = [module.aks]
}