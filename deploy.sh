# Add table version
newTableVersion=1.1-$(date +%Y%m%d)
sed -i '' "2s/.*/var tableVersion=\"$newTableVersion\"/" assets/js/datatables.js

# Beautify files
js-beautify -r --type js assets/js/datatables.js
js-beautify -r --type html ./index.html
js-beautify -r --type js ./index.js

# Define commit name
commit=$1

# Update rights
chown -R pvano ./*

# Deploy to GitLab
rm -f ./temp*
rm -f ./log*
rm -f ./assets/sh/critics*.txt
git add . && git commit -m "$commit" && git push
