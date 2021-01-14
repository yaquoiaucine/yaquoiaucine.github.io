# Add table version
newFileVersion=$(date +%Y%m%d)

# Get Shuffle CSS
curl -s https://vestride.github.io/Shuffle/css/normalize.css > assets/css/shuffle-styleTemp.css
curl -s https://vestride.github.io/Shuffle/css/style.css >> assets/css/shuffle-styleTemp.css
curl -s https://vestride.github.io/Shuffle/css/shuffle-styles.css >> assets/css/shuffle-styleTemp.css
echo "CSS files downloaded with success"

# Remove CSS property
cat assets/css/shuffle-styleTemp.css | sed 's/\[type=search\]{-webkit-appearance:textfield;outline-offset:-2px}//' > assets/css/shuffle-style.css

# Beautify files
js-beautify -r --type css assets/css/style.css
js-beautify -r --type js assets/js/script.js
js-beautify -r --type html index.html
js-beautify -r --type js index.js

# Remove older files before compressing
rm -f assets/js/script.min*.js
rm -f assets/css/style.min*.css
rm -f assets/css/shuffle-style.min*.css

# Compress files
uglifyjs assets/js/script.js -o assets/js/script.min-$newFileVersion.js -c
uglifycss assets/css/style.css > assets/css/style.min-$newFileVersion.css
uglifycss assets/css/shuffle-style.css > assets/css/shuffle-style.min-$newFileVersion.css
echo "JS and CSS files minified with success"

# Replace index files
sed -i '' "s/script\.min\.js/script\.min-$newFileVersion\.js/" index.html
sed -i '' "s/style\.min\.css/style\.min-$newFileVersion\.css/" index.html
sed -i '' "s/shuffle-style\.min\.css/shuffle-style\.min-$newFileVersion\.css/" index.html

# Update rights
chown -R pvano ./*

# Remove temp files
rm -f assets/pictures/new/*
rm -f temp*
rm -f log*
rm -f assets/sh/critics*.txt
rm -f assets/css/shuffle-styleTemp.css
rm -f assets/css/shuffle-style.css

# Trigger node script
node index.js

# Define commit name
commit=$1

# Deploy to GitLab
git add . && git commit -m "$commit" && git push
