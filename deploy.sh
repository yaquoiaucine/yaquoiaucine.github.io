commit=$1

# Beautify files
js-beautify -r --type css assets/css/styles.css
js-beautify -r --type js assets/js/datatable.js
js-beautify -r --type html ./index.html

# Deploy
rm -f ./assets/js/data.js && rm -f ./temp* && git add . && git commit -m "$commit" && git push
