
terraform {
  required_version = "1.14.8"
  cloud {
    
    organization = "foodsense"

    workspaces {
      name = "foodsense-dev"
    }
  }

  required_providers {
    azurerm = {
        source = "hashicorp/azurerm"
        version = "~> 4.69.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "3.1.1"
    }

    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "3.1.0"
    }
  }
}