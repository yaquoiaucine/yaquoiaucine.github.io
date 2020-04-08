# Delete data file
rm -f ./assets/js/data.js

# Add {"data":[{ at beginning of file
echo "{\"data\":[{" > ./assets/js/data.js

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
  pagesNumber=$(cat temp | grep "button button-md item" | cut -d'>' -f40 | cut -d'<' -f1)

  # Define movies number to 15
  moviesNumber=15
elif [ $moviesNumber -gt 0 ] && [ $moviesNumber -lt 15 ]; then
  # Define Allociné Top baseUrl pages number to 1
  pagesNumber=1
else
  # Get Allociné baseUrl pages number if movies number is 15
  pagesNumber=$(cat temp | grep "button button-md item" | cut -d'>' -f40 | cut -d'<' -f1)
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
    echo "\"id\": \"$id\"," >> ./assets/js/data.js

    # Get Allociné movie url
    url=$(cat temp | grep -m$j "<a class=\"meta-title-link\"" | tail -1 | head -1 | cut -d'"' -f4)
    curl -s http://www.allocine.fr/$url > temp2
    echo "\"url\": \"$url\"," >> ./assets/js/data.js

    # Extract movie title
    title=$(cat temp2 | grep -m1 "<meta property=\"og:title\" content=\"" | cut -d'"' -f4 | sed 's/&#039;/'"'"'/')
    echo "\"title\": \"$title\"," >> ./assets/js/data.js

    # Extract critic rating number
    critic=$(cat temp2 | grep -m1 "<span class=\"stareval-note\">" | cut -d'<' -f15 | cut -d'>' -f2 | sed 's/,/./')
    echo "\"critic\": \"$critic\"," >> ./assets/js/data.js

    # Extract critic rating and convert it to number
    for criticName in \
    "20 Minutes" \
    "BIBA" \
    "Bande à part" \
    "CNews" \
    "Cahiers du Cinéma" \
    "Charlie Hebdo" \
    "CinemaTeaser" \
    "Closer" \
    "Critikat.com" \
    "Culturebox - France Télévisions" \
    "Culturopoing.com" \
    "Dernières Nouvelles d&#039;Alsace" \
    "Ecran Large" \
    "Elle" \
    "Femme Actuelle" \
    "L&#039;Express" \
    "L&#039;Humanité" \
    "LCI" \
    "La Croix" \
    "La Septième Obsession" \
    "La Voix du Nord" \
    "Le Dauphiné Libéré" \
    "Le Figaro" \
    "Le Journal du Dimanche" \
    "Le Monde" \
    "Le Nouvel Observateur" \
    "Le Parisien" \
    "Le Point" \
    "Les Fiches du Cinéma" \
    "Les Inrockuptibles" \
    "Libération" \
    "Mad Movies" \
    "Marianne" \
    "Marie Claire" \
    "Ouest France" \
    "Paris Match" \
    "Positif" \
    "Première" \
    "Rolling Stone" \
    "Sud Ouest" \
    "Transfuge" \
    "Télé 7 Jours" \
    "Télé Loisirs" \
    "Télérama" \
    "Voici" \
    "aVoir-aLire.com"; do

      criticRatingNumber=$(cat temp2 | grep "link\">$criticName" | cut -d'"' -f6 | wc -l | awk '{print $1}')

      if [ $criticRatingNumber -gt 0 ]; then
        for k in $( eval echo {1..$criticRatingNumber} )
        do
        criticRating=$(cat temp2 | grep -m$k "link\">$criticName" | tail -1 | head -1 | cut -d'"' -f6)
        criticNameToLower=$(echo $criticName | sed 's/&#039;/'"'"'/')
        if [ $k -gt 1 ]; then
          criticNameToLower="$criticNameToLower$k"
        fi

          case $criticRating in
            "Chef-d&#039;oeuvre")
              echo "\"$criticNameToLower\": \"5\"," >> ./assets/js/data.js
              ;;
            "Tr&egrave;s bien")
              echo "\"$criticNameToLower\": \"4\"," >> ./assets/js/data.js
              ;;
            "Pas mal")
              echo "\"$criticNameToLower\": \"3\"," >> ./assets/js/data.js
              ;;
            "Pas terrible")
              echo "\"$criticNameToLower\": \"2\"," >> ./assets/js/data.js
              ;;
            "Tr&egrave;s mauvais")
              echo "\"$criticNameToLower\": \"1\"," >> ./assets/js/data.js
              ;;
            *)
              echo "\"$criticNameToLower\": \"\"," >> ./assets/js/data.js
              ;;
          esac
        done
      fi
    done

    # Extract user rating number
    user=$(cat temp2 | grep -m2 "<span class=\"stareval-note\">" | tail -1 | cut -d'<' -f15 | cut -d'>' -f2 | sed 's/,/./')
    echo "\"user\": \"$user\"," >> ./assets/js/data.js

    # Extract movie picture
    picture=$(cat temp2 | grep -m1 "<meta property=\"og:image\" content=\"" | cut -d'"' -f4 | sed 's/http/https/')
    echo "\"picture\": \"$picture\"," >> ./assets/js/data.js

    # Extract movie date
    date=$(cat temp2 | grep -A1 "== date blue-link\">" | tail -1 | sed 's/^ *//')
    echo "\"date\": \"$date\"," >> ./assets/js/data.js

    # Extract movie duration
    duration=$(cat temp2 | grep -m1 "[0-9]h " | sed 's/^ *//')
    if [[ $duration != *"div"* ]]; then
      echo "\"duration\": \"$duration\"," >> ./assets/js/data.js
    else
      echo "\"duration\": \"\"," >> ./assets/js/data.js
    fi

    # Extract movie genre
    genre=$(cat temp2 | grep -m3 "<span class=\"ACrL2ZACrpbG1zL2d" | sed -e 's/.\{45\}\==">\(.*\)<\/span>/\1/' | sed 's/^ *//' | tr '\n' ' ' | sed 's/.$//')
    echo "\"genre\": \"$genre\"," >> ./assets/js/data.js

    # Extract movie director
    director=$(cat temp2 | grep -m1 "<meta property=\"video:director\" content=\"" | cut -d'"' -f4)
    echo "\"director\": \"$director\"," >> ./assets/js/data.js

    # Extract main actors
    mainActors=$(cat temp2 | grep -A9 "<span class=\"ligth\">Avec</span>" | cut -d'>' -f2 | cut -d'<' -f1 | awk 'NR % 3 == 1' | sed '1d' | sed 's/$/,/' | tr '\n' ' ' | sed 's/..$//')
    echo "\"mainActors\": \"$mainActors\"" >> ./assets/js/data.js

    # Add },{ after every keys
    echo "},{" >> ./assets/js/data.js
    j=$[$j+1] id=$[$id+1]
  done
done

# Replace ,{ by ]} at the end of file
sed -i '$s/,{/]}/' ./assets/js/data.js

# Delete temp file
rm -f ./temp*
