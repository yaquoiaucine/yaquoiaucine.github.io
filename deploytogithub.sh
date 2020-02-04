commit=$1

rm -f ../yaquoiaucinegithub/
cp ./ ../yaquoiaucinegithub/
cd ../yaquoiaucinegithub

git add . && git commit -m "$commit" && git push github master
