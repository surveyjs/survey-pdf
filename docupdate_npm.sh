#!/bin/bash
mkdir __update_docs_temp
cd ./__update_docs_temp
mkdir service
REPO_URL="https://github.com/surveyjs/service"
git config --global http.$REPO_URL.extraHeader "AUTHORIZATION: Basic $GITAUTH"
git clone $REPO_URL
cp ../README.md ./Pdf-Export.md
mv ./Pdf-Export.md ./service/surveyjs.io/App_Data/Docs
cd ./service
git add ./surveyjs.io/App_Data/Docs
git commit -m "Updated PDF documentation"
git push
cd ../..
rm -rf __update_docs_temp