# Delete data file
rm -f ./assets/js/data.json

# Add {"data":[{ at beginning of file
echo "{\"data\":[{" > ./assets/js/data.json

# Define Allociné Top baseUrl
baseUrl=http://www.allocine.fr/film/aucinema/top/

# Define Allociné first movies number
curl -s $baseUrl > temp
moviesNumber=$(cat temp | grep "label-text label-sm label-primary-full label-ranking" | tail -1 | cut -d'>' -f2 | cut -d'<' -f1)
if [ -z "$moviesNumber" ]; then
  # Define Allociné new baseUrl
  baseUrl=http://www.allocine.fr/film/aucinema/
  curl -s $baseUrl > temp

  # Get Allociné new baseUrl pages number
  pagesNumber=$(cat temp | grep -Eo "\">[0-9]+</a></div></nav>" | cut -d'>' -f2 | cut -d'<' -f1)

  # Define movies number to 15
  moviesNumber=15
elif [ $moviesNumber -gt 0 ] && [ $moviesNumber -lt 15 ]; then
  # Define Allociné Top baseUrl pages number to 1
  pagesNumber=1
else
  # Get Allociné baseUrl pages number if movies number is 15
  pagesNumber=$(cat temp | grep -Eo "\">[0-9]+</a></div></nav>" | cut -d'>' -f2 | cut -d'<' -f1)
fi

# Loop through all Allociné pages
for i in $( eval echo {1..$pagesNumber} )
do
  # Get Allociné first page
  if [ $i -eq 1 ]; then
    id=1
    curl -s $baseUrl > temp
  # Get Allociné second until second to last page
  elif [ $i -lt $pagesNumber ]; then
    curl -s $baseUrl\?page\=$i > temp
  # Get Allociné last page
  elif [ $i -eq $pagesNumber ]; then
    curl -s $baseUrl\?page\=$i > temp
    moviesNumber=$(cat temp | grep -A1 "<a class=\"meta-title-link\"" | cut -d'>' -f2 | cut -d'<' -f1 | awk 'NR == 1 || NR % 3 == 1' | wc -l | awk '{print $1}')
  fi

  j=1
  while [ $j -le $moviesNumber ]
  do
    # Add id
    echo "\"id\": \"$id\"," >> ./assets/js/data.json

    # Get Allociné movie url
    url=$(cat temp | grep -m$j "<a class=\"meta-title-link\"" | tail -1 | head -1 | cut -d'"' -f4)
    curl -s http://www.allocine.fr/$url > temp2
    echo "\"url\": \"$url\"," >> ./assets/js/data.json

    # Extract movie title
    title=$(cat temp2 | grep -m1 "<meta property=\"og:title\" content=\"" | cut -d'"' -f4 | sed 's/&#039;/'"'"'/')
    echo "\"title\": \"$title\"," >> ./assets/js/data.json

    # Extract critic rating number
    critic=$(cat temp2 | grep -m1 "<span class=\"stareval-note\">" | cut -d'<' -f15 | cut -d'>' -f2 | sed 's/,/./')
    echo "\"critic\": \"$critic\"," >> ./assets/js/data.json

    # Extract critic rating and convert it to number
    dataFile="./assets/sh/criticName.txt"
    while IFS= read -r criticName <&3; do

      criticRatingNumber=$(cat temp2 | grep "link\">$criticName" | cut -d'"' -f6 | wc -l | awk '{print $1}')

      if [ $criticRatingNumber -gt 0 ]; then
        for k in $( eval echo {1..$criticRatingNumber} )
        do
        criticRating=$(cat temp2 | grep -m$k "link\">$criticName" | tail -1 | head -1 | cut -d'"' -f6)
        if [ $k -gt 1 ]; then
          criticName="$criticName$k"
        fi

          case $criticRating in
            "Chef-d&#039;oeuvre")
              echo "\"$criticName\": \"5\"," >> ./assets/js/data.json
              ;;
            "Tr&egrave;s bien")
              echo "\"$criticName\": \"4\"," >> ./assets/js/data.json
              ;;
            "Pas mal")
              echo "\"$criticName\": \"3\"," >> ./assets/js/data.json
              ;;
            "Pas terrible")
              echo "\"$criticName\": \"2\"," >> ./assets/js/data.json
              ;;
            "Tr&egrave;s mauvais")
              echo "\"$criticName\": \"1\"," >> ./assets/js/data.json
              ;;
            *)
              echo "\"$criticName\": \"\"," >> ./assets/js/data.json
              ;;
          esac
        done
      fi
    done 3<$dataFile

    # Extract user rating number
    user=$(cat temp2 | grep -m2 "<span class=\"stareval-note\">" | tail -1 | cut -d'<' -f15 | cut -d'>' -f2 | sed 's/,/./')
    echo "\"user\": \"$user\"," >> ./assets/js/data.json

    # Extract movie picture
    picture=$(cat temp2 | grep -m1 "<meta property=\"og:image\" content=\"" | cut -d'"' -f4 | sed 's/http/https/')
    echo "\"picture\": \"$picture\"," >> ./assets/js/data.json

    # Extract movie date
    date=$(cat temp2 | grep -A1 "== date blue-link\">" | tail -1 | sed 's/^ *//')
    echo "\"date\": \"$date\"," >> ./assets/js/data.json

    # Extract movie duration
    duration=$(cat temp2 | grep -m1 "[0-9]h " | sed 's/^ *//')
    if [[ $duration != *"div"* ]]; then
      echo "\"duration\": \"$duration\"," >> ./assets/js/data.json
    else
      echo "\"duration\": \"N/A\"," >> ./assets/js/data.json
    fi

    # Extract movie genre
    genre=$(cat temp2 | grep -m3 "<span class=\"ACrL2ZACrpbG1zL2d" | sed -e 's/.\{45\}\==">\(.*\)<\/span>/\1/' | sed 's/^ *//' | tr '\n' ' ' | sed 's/.$//')
    echo "\"genre\": \"$genre\"," >> ./assets/js/data.json

    # Extract movie director
    director=$(cat temp2 | grep -m1 "<meta property=\"video:director\" content=\"" | cut -d'"' -f4)
    echo "\"director\": \"$director\"," >> ./assets/js/data.json

    # Extract main actors
    mainActors=$(cat temp2 | grep -A9 "<span class=\"ligth\">Avec</span>" | cut -d'>' -f2 | cut -d'<' -f1 | awk 'NR % 3 == 1' | sed '1d' | sed 's/$/,/' | tr '\n' ' ' | sed 's/..$//')
    echo "\"mainActors\": \"$mainActors\"" >> ./assets/js/data.json

    # Add },{ after every keys
    echo "},{" >> ./assets/js/data.json
    j=$[$j+1] id=$[$id+1]
  done
done

# Replace ,{ by ]} at the end of file
sed -i '$s/,{/]}/' ./assets/js/data.json

# Delete temp file
rm -f ./temp*
