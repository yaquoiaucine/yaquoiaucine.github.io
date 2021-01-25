# Define commit name
commit=$1

# Move git repo to one level up
mv ../yaquoiaucinegithub/.git ../

# Remove yaquoiaucinegithub folder
rm -f -R ../yaquoiaucinegithub

# Create new yaquoiaucinegithub folder
mkdir ../yaquoiaucinegithub

# Move git repo to yaquoiaucinegithub folder
mv ../.git ../yaquoiaucinegithub

# Copy files from yaquoiaucine to yaquoiaucinegithub except git repo
rsync -av --progress . ../yaquoiaucinegithub --exclude .git/

# Remove extra files
rm -f -R ../yaquoiaucinegithub/node_modules
rm -f -R ../yaquoiaucinegithub/node_script.js
rm -f -R ../yaquoiaucinegithub/package*.json

# Change current path to yaquoiaucinegithub
cd ../yaquoiaucinegithub

# Deploy to GitHub
git add . && git commit -m "$commit" && git push github master
