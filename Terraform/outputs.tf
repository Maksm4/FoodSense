output "cluster_name" {
  description = "Name of the AKS cluster"
  value       = module.aks.cluster_name
}

output "resource_group_name" {
  description = "Name of the Azure resource group"
  value       = module.aks.resource_group_name
}

output "connect_command" {
  description = "Command to locally connect to the cluster"
  value       = "az aks get-credentials --resource-group ${module.aks.resource_group_name} --name ${module.aks.cluster_name}"
}