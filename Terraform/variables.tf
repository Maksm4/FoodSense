
variable "environment" {
    description = "environment name. used as tag/suffix for resource names"
    type = string

    validation {
      condition = contains(["dev", "prod"], var.environment )
      error_message = "environment has to be either dev or prod"
    }

}

variable "location" {
  description = "Azure region where all resources will be created"
  type        = string
  default     = "westeurope"

    validation {
    condition     = contains(["westeurope", "polandcentral", "germanywestcentral"], var.location)
    error_message = "Location must be a supported Azure region"
  }
}

variable "node_count" {
  description = "Number of nodes in the AKS default node pool"
  type        = number
  default     = 2

  validation {
    condition     = var.node_count >= 1 && var.node_count <= 10
    error_message = "Node count must be between 1 and 10"
  }
}

variable "vm_size" {
  description = "VM size/type for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}

variable "ghcr_pat" {
  description = "GitHub PAT for pulling images from GHCR"
  type        = string
  sensitive   = true
}

variable "repo_branch" {
  description = "Git branch that ArgoCD will watch for changes"
  type        = string
}

variable "k8s_manifests_path" {
  description = "Path inside the repository that ArgoCD will sync to the cluster"
  type        = string
}