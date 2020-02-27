mkdir __update_docs_temp
cd ./__update_docs_temp
mkdir service
git config --global user.email "gologames@bk.ru"
git config --global user.name "gologames"
git clone https://x-access-token:$GTTOKEN@github.com/surveyjs/service
cp ../README.md ../docs/PdfExportOverview.md
cp -a ../docs/. ./service/surveyjs.io/App_Data/DocsPdf
cd ./service
git add ./surveyjs.io/App_Data/DocsPdf
git commit -m "Updated PDF documentation"
git push
cd ../..
rm -rf __update_docs_temp