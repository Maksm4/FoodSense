#!/bin/bash
SERVICE=$1
IMAGE=$2
TAG=$3

if [ -z "$SERVICE" ] || [ -z "$IMAGE" ] || [ -z "$TAG" ]; then
  echo "Usage: update-image-tag.sh <service> <image> <tag>"
  exit 1
fi

# determine overlay from current branch
BRANCH="${GITHUB_REF}"
if [ "$BRANCH" == "refs/heads/dev" ]; then
  OVERLAY="Dev"
elif [ "$BRANCH" == "refs/heads/prod" ]; then
  OVERLAY="Prod"
else
  echo "Branch $BRANCH is not a deployment branch, skipping."
  exit 0
fi

echo "Updating $SERVICE image tag to $TAG in K8S/Overlays/$OVERLAY"

# install kustomize
curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh" | bash
sudo mv kustomize /usr/local/bin/

# update the tag
cd K8S/Overlays/${OVERLAY}
kustomize edit set image "${IMAGE}=${IMAGE}:${TAG}"

# commit and push if anything changed
git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git add kustomization.yaml

git diff --staged --quiet && echo "No changes to commit" || \
  git commit -m "ci: update ${SERVICE} image to ${TAG}" && git push