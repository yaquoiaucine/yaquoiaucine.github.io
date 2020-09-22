# Create datatables js file
rm -f ./assets/js/tempFile2.js

id=0
dataFile="./assets/sh/criticName.txt"
while IFS= read -r criticName <&3; do

  criticName=$(echo $criticName | cut -d',' -f1)

  if [ "$criticName" == "$criticNameTemp" ]; then
    echo "{\"data\": null, \"className\": \"critic\", \"render\": function(data, type, row) {var rowcolumnsKeyName = row.criticNames[columnsKeyName[$id]];\n\nif (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== \"\") {var res = parseFloat(rowcolumnsKeyName).toFixed(1);} else {var res = \"&nbsp;&nbsp;-&nbsp;&nbsp;\";}\n\nreturn res;}}," >> ./assets/js/tempFile2.js
  else
    echo "{\"data\": null, \"className\": \"critic\", \"render\": function(data, type, row) {var rowcolumnsKeyName = row.criticNames[columnsKeyName[$id]];\n\nif (rowcolumnsKeyName !== undefined && rowcolumnsKeyName !== \"\") {var res = parseFloat(rowcolumnsKeyName).toFixed(1);} else {var res = \"&nbsp;&nbsp;-&nbsp;&nbsp;\";}\n\nreturn res;}}," >> ./assets/js/tempFile2.js
  fi

  id=$[$id+1]
  criticNameTemp=$criticName

done 3<$dataFile

cat ./assets/js/tempFile1.js > ./assets/js/datatables.js
cat ./assets/js/tempFile2.js >> ./assets/js/datatables.js
cat ./assets/js/tempFile3.js >> ./assets/js/datatables.js
js-beautify -r --type js assets/js/datatables.js

cat assets/js/datatables.js > ./assets/js/tempFile4.js

# Create index html file
rm -f ./assets/html/tempFile2.html

dataFile="./assets/sh/criticName.txt"
while IFS= read -r criticName <&3; do

  firstPart=$(echo $criticName | cut -d',' -f2)
  secondPart=$(echo $criticName | cut -d',' -f3)

  echo "<th title=\"Note $firstPart\">$secondPart.</th>" >> ./assets/html/tempFile2.html

done 3<$dataFile

cat ./assets/html/tempFile1.html > ./index.html
cat ./assets/html/tempFile2.html >> ./index.html
cat ./assets/html/tempFile3.html >> ./index.html
js-beautify -r --type html index.html

cat index.html > ./assets/html/tempFile4.html

sh assets/sh/criticsBis.sh
