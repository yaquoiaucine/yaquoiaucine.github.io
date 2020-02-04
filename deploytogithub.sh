commit=$1

mv ../yaquoiaucinegithub/.git ../
rm -f -R ../yaquoiaucinegithub
mkdir ../yaquoiaucinegithub
mv ../.git ../yaquoiaucinegithub
rsync -av --progress . ../yaquoiaucinegithub --exclude .git/
cd ../yaquoiaucinegithub

git add . && git commit -m "$commit" && git push github master
