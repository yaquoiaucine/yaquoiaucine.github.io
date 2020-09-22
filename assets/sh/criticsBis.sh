rm -f ./assets/sh/critics1.txt

dataFile="./assets/sh/criticName.txt"
while IFS= read -r criticName <&3; do

  criticName=$(echo $criticName | cut -d',' -f2)
  echo '.replace(/'$criticName'/g, "'$criticName'")' >> ./assets/sh/critics1.txt

done 3<$dataFile

sed -i '' '/Contre/!d' ./assets/sh/critics1.txt
sed -i '' 's/\/du /\/Le /g' ./assets/sh/critics1.txt
sed -i '' 's/"du /"Le /g' ./assets/sh/critics1.txt
sed -i '' 's/\/des /\//g' ./assets/sh/critics1.txt
sed -i '' 's/"des /"/g' ./assets/sh/critics1.txt
sed -i '' 's/\/de /\//g' ./assets/sh/critics1.txt
sed -i '' 's/"de /"/g' ./assets/sh/critics1.txt
sed -i '' 's/ Contre\/g,/2\/g,/g' ./assets/sh/critics1.txt
sed -i '' 's/'"'"'/\&#039;/g' ./assets/sh/critics1.txt
sed -i '' 's/Fiches du Cinéma/Les Fiches du Cinéma/g' ./assets/sh/critics1.txt
sed -i '' 's/d\&#039;Elle2/Elle2/g' ./assets/sh/critics1.txt
sed -i '' 's/d\&#039;Elle Contre/Elle Contre/g' ./assets/sh/critics1.txt
sed -i '' 's/d\&#039;Ecran Large2/Ecran Large2/g' ./assets/sh/critics1.txt
sed -i '' 's/d\&#039;Ecran Large Contre/Ecran Large Contre/g' ./assets/sh/critics1.txt
sed -i '' 's/d\&#039;Obejctif-Cinema.com2/Obejctif-Cinema.com2/g' ./assets/sh/critics1.txt
sed -i '' 's/d\&#039;Obejctif-Cinema.com Contre/Objectif-Cinema.com Contre/g' ./assets/sh/critics1.txt

echo ".replace(/Obejctif-Cinema.com/g, \"Objectif-Cinema.com\")" >> ./assets/sh/critics1.txt
echo ".replace(/&#039;/g, \"'\");" >> ./assets/sh/critics1.txt

rm -f ./assets/sh/critics2.txt

dataFile="./assets/sh/criticName.txt"
while IFS= read -r criticName <&3; do

  criticName=$(echo $criticName | cut -d',' -f2)
  echo \"$criticName\", >> ./assets/sh/critics2.txt

done 3<$dataFile

sed -i '' '/Contre/!d' ./assets/sh/critics2.txt
sed -i '' 's/"du /"Le /g' ./assets/sh/critics2.txt
sed -i '' 's/"des /"/g' ./assets/sh/critics2.txt
sed -i '' 's/"de /"/g' ./assets/sh/critics2.txt
sed -i '' 's/ Contre/2/g' ./assets/sh/critics2.txt
sed -i '' 's/'"'"'/\&#039;/g' ./assets/sh/critics2.txt
sed -i '' 's/Fiches du Cinéma/Les Fiches du Cinéma/g' ./assets/sh/critics2.txt
sed -i '' 's/d\&#039;Elle2/Elle2/g' ./assets/sh/critics2.txt
sed -i '' 's/d\&#039;Ecran Large2/Ecran Large2/g' ./assets/sh/critics2.txt
sed -i '' 's/d\&#039;Obejctif-Cinema.com2/Obejctif-Cinema.com2/g' ./assets/sh/critics2.txt
