
provider "azurerm" {
  features {}
}

provider "helm" {
  kubernetes {
    host                   = module.aks.host
    client_certificate     = base64decode(module.aks.client_certificate)
    client_key             = base64decode(module.aks.client_key)
    cluster_ca_certificate = base64decode(module.aks.cluster_ca_certificate)
  }
}

provider "kubernetes" {
  host                   = module.aks.host
  client_certificate     = base64decode(module.aks.client_certificate)
  client_key             = base64decode(module.aks.client_key)
  cluster_ca_certificate = base64decode(module.aks.cluster_ca_certificate)
}

module "aks" {
  source = "./modules/aks"

  environment   = var.environment
  location      = var.location
  node_count    = var.node_count
  vm_size       = var.vm_size
  ghcr_username = "Maksm4"
  ghcr_pat      = var.ghcr_pat
}

module "argocd" {
  source = "./modules/argocd"

  environment        = var.environment
  repo_url           = var.repo_url
  repo_branch        = var.repo_branch
  k8s_manifests_path = var.k8s_manifests_path
  depends_on         = [module.aks]
}