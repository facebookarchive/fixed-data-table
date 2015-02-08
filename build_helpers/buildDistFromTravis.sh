#!/bin/bash
set -e

branch_name="$(git rev-parse --abbrev-ref HEAD)"

if [ "$branch_name" == "master" ]
then
  # build dist
  npm run build-dist

  # initialize and commit everything in pages
  cd dist
  git init
  git config user.name "Travis"
  git config user.email "Travis"
  git add .
  git commit -m "build dist assets and commit to dist"

  # hide my output for security reasons
  # force it because we want this to just actually work
  git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:dist > /dev/null 2>&1
else
  echo "Current branch is not master and dist will not be built or committed."
fi
