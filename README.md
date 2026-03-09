# FoodSense
> Stop throwing away food. Start cooking smarter.


FoodSense is a household food management app that tracks what's in your kitchen and suggests recipes based on what you actually have. Built for people who are tired of forgetting what's in the fridge, letting groceries go to waste, or staring blankly at a full pantry wondering what to cook.

## Features

**Inventory tracking** — Add the food items in your household, track quantities, and see what's running low. Everything is tied to your household (called a Kitchen) so multiple people in the same house share the same view.

**Recipe suggestions** — FoodSense connects to the Edamam recipe API and suggests recipes based on currently selected products from your kitchen.<br>
You get filtered out recipes that are based on:
- the products you want to eat
- meal type
- cusine type

**Shared kitchens** — Invite other people in your household via a shareable invite link. Everyone sees the same products in the kitchen.

**Saved recipes** — Found a recipe you like? Save it to your profile so you can find it again without searching.

## Motivation

Most food apps are either grocery list managers or recipe finders. FoodSense connects the two: it knows what you have, so it can tell you what to make. The invite system means it actually works for a household rather than just one person. You don't have to wonder what's in your kitchen during grocery shopping - just open the app.
## Tech Stack

### Backend

Microservices all in .NET 9

| Service | Responsibility |
|---|---|
| **Auth.API** | JWT authentication, user registration and login |
| **Inventory.API** | Food items, kitchen management, invite system |
| **Recipe.API** | Recipe search via Edamam API, saved recipes |
| **ApiGateway** | YARP reverse proxy routing all traffic from the frontend |

### Frontend 

- **React with TypeScript** — built with Vite
- **Tailwind CSS** — styling
- **React Router** — client-side routing

### Infrastructure

- **Kubernetes with Kustomization** — deployment manifests for whole project
- **GHCR** — container image registry
- **GitHub Actions** — CI/CD pipeline with per service change detection
- **Nginx** — serves the frontend and proxies API calls
- **Prometheus with Grafana** — metrics and monitoring
- **Microsoft SQL Server** — database for all services

For now using http as it's hosted on the home server on LAN.

## CI/CD, automation and monitoring

Created docker-build-service.yml and dotnet-build-service.yml that are reusable workflows.

The GitHub Actions pipeline uses path-based change detection — only the services that actually changed get rebuilt and redeployed. Pushing to `main` runs .NET build checks. Opening a PR to `production` runs Docker build dry-runs. Merging to `production` builds, pushes to GHCR, and deploys to the home server via a self-hosted runner.

## External APIs used
- Edamam Recipe API - https://developer.edamam.com/edamam-recipe-api
- Open Food Facts base database for Polish products with barcodes - https://world.openfoodfacts.org/
- Azure translator API

## Future Improvements
- hosted in the cloud
- kcal counter
- meal planner
- adding products via barcode scanning
- adding products in bulk via lidl/biedronka and othe hypermarket digital receipts 
- rabbitMQ to share updated data among microservices