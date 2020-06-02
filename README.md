# Meal Planner: App Service

> Web interface via NextJS server

This TypeScript service is part of the [Meal Planner project](https://github.com/users/mauvm/projects/1).

## Local Development

```bash
yarn install
yarn dev
```

## Deploy to Production

```bash
# Configure Docker CLI
eval $(minikube docker-env) # Or "minikube docker-env | Invoke-Expression" on Windows

# Build Docker image
docker build -t app-service .

# Deploy via infrastructure repository
```
