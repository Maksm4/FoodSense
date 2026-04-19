variable "project_name" {
  description = "Project name. Used to name the ArgoCD application resource"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}

variable "repo_url" {
  description = "GitHub repo url ArgoCD watches"
  type        = string
}

variable "repo_branch" {
  description = "Branch ArgoCD watches"
  type        = string
}

variable "k8s_manifests_path" {
  description = "Folder path inside repo ArgoCD syncs"
  type        = string
}