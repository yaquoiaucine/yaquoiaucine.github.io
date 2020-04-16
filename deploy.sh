# Define commit name
commit=$1

# Beautify files
js-beautify -r --type css assets/css/styles.css
js-beautify -r --type js assets/js/datatables.js
js-beautify -r --type html ./index.html

# Deploy to GitLab
rm -f ./assets/js/data.json && rm -f ./temp* && git add . && git commit -m "$commit" && git push
