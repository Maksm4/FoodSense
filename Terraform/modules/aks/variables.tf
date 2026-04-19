variable "project_name" {
  description = "Project name used as prefix for all resource names"
  type        = string
}

variable "environment" {
  description = "Environment name used for resource naming"
  type        = string
}

variable "location" {
  description = "Azure region"
  type        = string
}

variable "node_count" {
  description = "Number of AKS nodes"
  type        = number
}

variable "vm_size" {
  description = "VM size for AKS nodes"
  type        = string
}

variable "ghcr_username" {
  description = "Github username for GHCR"
  type        = string
}

variable "ghcr_pat" {
  description = "Github PAT for pulling images from GHCR"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "tags to append to" 
  type = list(string)
}