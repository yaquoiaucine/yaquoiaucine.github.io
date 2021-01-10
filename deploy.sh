# Beautify files
js-beautify -r --type css assets/css/style.css
js-beautify -r --type js assets/js/script.js
js-beautify -r --type html ./index.html
js-beautify -r --type js ./index.js

# Compress files
uglifyjs assets/js/script.js -o assets/js/script.min.js -c
uglifycss assets/css/style.css > assets/css/style.min.css

# Update rights
chown -R pvano ./*

# Remove temp files
rm -f ./assets/pictures/new/*
rm -f ./temp*
rm -f ./log*
rm -f ./assets/sh/critics*.txt

# Trigger node script
node index.js

# Define commit name
commit=$1

# Deploy to GitLab
git add . && git commit -m "$commit" && git push
