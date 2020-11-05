# Add table version
newTableVersion=1.01-$(date +%Y%m%d)
sed -i '' "2s/.*/var tableVersion=\"$newTableVersion\";/" assets/js/datatables.js
sed -i '' "2s/.*/var tableVersion=\"$newTableVersion\";/" assets/js/tempFile1.js

# Create temp files to check diff
cat ./assets/js/tempFile1.js > ./assets/js/tempFile4.js
cat ./assets/js/tempFile2.js >> ./assets/js/tempFile4.js
cat ./assets/js/tempFile3.js >> ./assets/js/tempFile4.js
js-beautify -r --type js assets/js/tempFile4.js

cat ./assets/html/tempFile1.html > ./assets/html/tempFile4.html
cat ./assets/html/tempFile2.html >> ./assets/html/tempFile4.html
cat ./assets/html/tempFile3.html >> ./assets/html/tempFile4.html
js-beautify -r --type html assets/html/tempFile4.html

# Beautify files
js-beautify -r --type css assets/css/style.css
js-beautify -r --type css assets/css/bootstrap.css
js-beautify -r --type js assets/js/datatables.js
js-beautify -r --type html ./index.html
js-beautify -r --type js ./index.js

diffjs=$(diff assets/js/datatables.js assets/js/tempFile4.js | wc -l | awk '{print $1}')
diffhtml=$(diff index.html assets/html/tempFile4.html | wc -l | awk '{print $1}')

if [ $diffjs -eq 0 ] && [ $diffhtml -eq 0 ]; then
  # Define commit name
  commit=$1

  # Update rights
  chown -R pvano ./*

  # Deploy to GitLab
  rm -f ./assets/js/data.json
  rm -f ./assets/js/critics.json
  rm -f ./temp*
  rm -f ./log*
  rm -f ./assets/sh/critics*.txt
  git add . && git commit -m "$commit" && git push
else
  echo "Fix the diff first"
fi
