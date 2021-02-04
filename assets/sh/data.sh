# Add {"data":[{ at beginning of file
echo "{\"data\":[{" > ./assets/js/data.json

# Define Allociné baseUrl
baseUrl=https://www.allocine.fr/film/aucinema/
curl -s $baseUrl > temp

# Get Allociné baseUrl movies number
moviesNumber=$(cat temp | grep "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | wc -l | awk '{print $1}')

if [[ $moviesNumber -lt 15 ]]; then
  # Define Allociné baseUrl pages number to 1
  pagesNumber=1
else
  # Get Allociné baseUrl pages number
  pagesNumber=$(cat temp | grep -Eo "\">[0-9]+</a></div></nav>" | cut -d'>' -f2 | cut -d'<' -f1)
fi

# Loop through all Allociné pages
for i in $( eval echo {1..$pagesNumber} )
do
  # Get Allociné first page
  if [[ $i -eq 1 ]]; then
    echo page number $i / $pagesNumber

    id=1
  # Get Allociné second until second to last page
  elif [[ $i -lt $pagesNumber ]]; then
    echo page number $i / $pagesNumber

    curl -s $baseUrl\?page\=$i > temp

    checkMoviesNumber=$(cat temp | grep "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | wc -l | awk '{print $1}')
    if [[ $checkMoviesNumber -eq 0 ]]; then
      curl -s $baseUrl\?page\=$i > temp
    fi
  # Get Allociné last page
  elif [[ $i -eq $pagesNumber ]]; then
    echo page number $i / $pagesNumber

    curl -s $baseUrl\?page\=$i > temp
    moviesNumber=$(cat temp | grep "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | wc -l | awk '{print $1}')
  fi

  j=1
  while [[ $j -le $moviesNumber ]]
  do
    # Add id
    echo "\"id\": \"$id\"," >> ./assets/js/data.json
    echo $id

    # Add AlloCiné object
    echo "\"allocineData\":{" >> ./assets/js/data.json

    # Get Allociné movie url
    url=$(cat temp | grep -m$j "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | tail -1 | head -1 | cut -d'"' -f4)

    curl -s https://www.allocine.fr$url > temp2
    completeUrl=https://www.allocine.fr$url
    echo "\"url\": \"$completeUrl\"," >> ./assets/js/data.json

    # Extract movie title
    title=$(cat temp2 | grep -m1 "<meta property=\"og:title\" content=\"" | cut -d'"' -f4 | sed 's/&#039;/'"'"'/' | sed 's/[[:blank:]]*$//')
    echo "\"title\": \"$title\"," >> ./assets/js/data.json

    # Extract AlloCiné first director
    firstAllocineDirector=$(cat temp2 | grep "<meta property=\"video:director\" content=\"" | cut -d'"' -f4 | tr '[:upper:]' '[:lower:]')
    echo "\"allocineDirector\": \"$firstAllocineDirector\"," >> ./assets/js/data.json

    # Extract movie picture
    picture=$(cat temp2 | grep -m1 "<meta property=\"og:image\" content=\"" | cut -d'"' -f4)
    echo "\"picture\": \"$picture\"," >> ./assets/js/data.json

    # Extract movie date
    date=$(cat temp2 | grep -A1 "== date blue-link\">" | tail -1 | sed 's/^ *//' | cut -d'>' -f2 | cut -d'<' -f1)
    spaceNumber=$(cat temp2 | grep -A1 "== date blue-link\">" | tail -1 | sed 's/^ *//' | cut -d'>' -f2 | cut -d'<' -f1 | tr -cd ' \t' | wc -c | awk '{print $1}')
    dateNumber=$(cat temp2 | grep -A1 "== date blue-link\">" | tail -1 | sed 's/^ *//' | cut -d'>' -f2 | cut -d'<' -f1 | wc -l | awk '{print $1}')
    if [[ $dateNumber -eq 0 ]]; then
      date=$(cat temp2 | grep "<span class=\"date\"" | cut -d'>' -f2 | cut -d'<' -f1)
      spaceNumber=$(cat temp2 | grep "<span class=\"date\"" | cut -d'>' -f2 | cut -d'<' -f1 | tr -cd ' \t' | wc -c | awk '{print $1}')
    fi
    echo "\"date\": \"$date\"," >> ./assets/js/data.json

    # Extract movie genre
    genreNumber=$(cat temp2 | grep -m3 "<span class=\"ACrL2ZACrpbG1zL2d" | cut -d'>' -f2 | cut -d'<' -f1 | wc -l | awk '{print $1}')
    if [[ $genreNumber -gt 0 ]]; then

      echo "\"genre\":{" >> ./assets/js/data.json

      for l in $( eval echo {1..$genreNumber} )
      do
        genreName=$(cat temp2 | grep -m3 "<span class=\"ACrL2ZACrpbG1zL2d" | cut -d'>' -f2 | cut -d'<' -f1 | head -$l | tail -1)
        echo "\"id$l\": \"$genreName\"," >> ./assets/js/data.json
      done

      echo "}," >> ./assets/js/data.json
    fi

    # Extract movie id
    movieId=$(cat temp | grep -m$j "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | tail -1 | head -1 | cut -d'"' -f4 | cut -d'=' -f2 | cut -d'.' -f1)
    curl -s https://www.allocine.fr/film/fichefilm-$movieId/critiques/presse/ > temp3

    # Extract critic rating number
    critic=$(cat temp3 | grep -m1 -Eo "</div><span class=\"stareval-note\">[0-9],[0-9]</span></div>" | cut -d'>' -f3 | cut -d'<' -f1 | sed 's/,/./')
    echo "\"critic\": \"$critic\"," >> ./assets/js/data.json

    # Extract critic number
    criticNumber=$(cat temp3 | grep -Eo "<span class=\"light\">[0-9]+ titre*" | cut -d'>' -f2 | cut -d' ' -f1)
    echo "\"criticNumber\": \"$criticNumber\"," >> ./assets/js/data.json

    # Extract critic rating and convert it to number
    echo "\"criticNames\":{" >> ./assets/js/data.json

    dataFile="./assets/sh/criticName.txt"
    while IFS= read -r criticName <&3; do

      criticName=$(echo $criticName | cut -d',' -f1)
      criticNameFirst=$(echo $criticName | cut -d',' -f1)
      criticRatingNumber=$(cat temp3 | grep "js-anchor-link\">$criticName" | cut -d'"' -f6 | wc -l | awk '{print $1}')

      if [[ $criticNameFirst != $criticNameTemp ]]; then
        if [[ $criticRatingNumber -gt 0 ]]; then
          for k in $( eval echo {1..$criticRatingNumber} )
          do
          criticRating=$(cat temp3 | grep -m$k "js-anchor-link\">$criticName" | tail -1 | head -1 | cut -d'"' -f6)

            if [[ $k -gt 1 ]]; then
              criticNameTemp="$criticName"
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

            if [[ $k -gt 1 ]]; then
              criticName="$criticNameTemp"
            fi

          done
        fi
      fi

      criticNameTemp=$criticNameFirst

    done 3<$dataFile

    echo "}," >> ./assets/js/data.json

    # Extract user rating number
    user=$(cat temp2 | grep -Eo "<span class=\"stareval-note\">[0-9],[0-9]</span><span class=\"stareval-review light\"> [0-9]+ note*" | cut -d'>' -f2 | cut -d'<' -f1 | sed 's/,/./')
    echo "\"user\": \"$user\"," >> ./assets/js/data.json

    # Add ending bracket
    echo "}," >> ./assets/js/data.json

    # Add IMDb object
    echo "\"imdbData\":{" >> ./assets/js/data.json

    # Encode and lowercase IMDb title
    titleLower=$(echo $title | sed -f assets/sh/imdb_titles.sed | sed -f assets/sh/url_escape.sed | tr '[:upper:]' '[:lower:]')
    curl -s "https://www.imdb.com/find?q=$titleLower&s=tt" > temp5
    echo $titleLower

    # Extract IMDb id
    imdbId=$(cat temp5 | grep -Eo "<td class=\"primary_photo\"> <a href=\"/title/tt[0-9]+" | sed 's/\/\" ><img src=\"https:\/\/m.media.*$//g' | head -1 | tail -1 | sed "s/.*title\///g")
    curl -s https://www.imdb.com/title/$imdbId/ > temp6

    # Get number of IMDb directors
    imdbDirectorNumber=$(cat temp6 | grep -A6 "<h4 class=\"inline\">Director" | grep -Eo "/name/nm" | wc -l | awk '{print $1}')
    o=3
    for m in $( eval echo {1..$imdbDirectorNumber} )
    do
      # Extract IMDb first director
      firstImdbDirector=$(cat temp6 | grep -A6 "<h4 class=\"inline\">Director" | head -$o | tail -1 | cut -d'>' -f2 | cut -d'<' -f1 | tr '[:upper:]' '[:lower:]' | sed -f assets/sh/imdb_director.sed)
      if [[ -z $firstImdbDirector ]]; then
        firstImdbDirector="N/A"
      fi

      # Get second to five result if movie match is not right
      for n in {2..5}
      do
        if [[ $firstAllocineDirector != *$firstImdbDirector* ]]; then
            imdbId=$(cat temp5 | grep -Eo "<td class=\"primary_photo\"> <a href=\"/title/tt[0-9]+" | sed 's/\/\" ><img src=\"https:\/\/m.media.*$//g' | head -$n | tail -1 | sed "s/.*title\///g")
            curl -s https://www.imdb.com/title/$imdbId/ > temp6
            firstImdbDirector=$(cat temp6 | grep -A6 "<h4 class=\"inline\">Director" | head -$o | tail -1 | cut -d'>' -f2 | cut -d'<' -f1 | tr '[:upper:]' '[:lower:]' | sed -f assets/sh/imdb_director.sed)
            if [[ -z $firstImdbDirector ]]; then
              firstImdbDirector="N/A"
            fi
        fi
      done

      if [[ $firstAllocineDirector != *$firstImdbDirector* ]]; then
        # Extract IMDb id
        imdbId=$(cat temp5 | grep -Eo "<td class=\"primary_photo\"> <a href=\"/title/tt[0-9]+" | sed 's/\/\" ><img src=\"https:\/\/m.media.*$//g' | head -1 | tail -1 | sed "s/.*title\///g")
        curl -s https://www.imdb.com/title/$imdbId/ > temp6
        o=$[$o+1]
      fi
    done

    # Extract IMDb rating number
    imdbRating=$(cat temp6 | grep -m1 "ratingValue" | cut -d'"' -f4)

    # Null value if still different
    if [[ $firstAllocineDirector != *$firstImdbDirector* ]]; then
      echo ----------------------
      echo $firstAllocineDirector
      echo $firstImdbDirector
      echo ----------------------
      imdbRating=""
      imdbId=""
      firstImdbDirector=""
    fi

    # Add IMDb rating number, id and director after checking
    echo "\"imdbRating\": \"$imdbRating\"," >> ./assets/js/data.json
    echo "\"imdbId\": \"$imdbId\"," >> ./assets/js/data.json
    echo "\"imdbDirector\": \"$firstImdbDirector\"," >> ./assets/js/data.json

    # Add ending bracket
    echo "}," >> ./assets/js/data.json

    # Add },{ after every keys
    echo "},{" >> ./assets/js/data.json
    j=$[$j+1] id=$[$id+1]
  done
done

# Remove lines break and extra commas
cat ./assets/js/data.json | sed '$s/,{/]}/' | tr '\n' ' ' | sed 's/}, ]/}]/g' | sed 's/, },/},/g' | sed 's/......$/ }]}/' | sed 's/, },/},/g' > temp
cat temp > ./assets/js/data.json

# Add all critic names
echo "{\"critics\":[" > ./assets/js/critics.json

id=0
sec=2
dataFile="./assets/sh/criticName.txt"
while IFS= read -r criticName <&3; do

  # Extract criticName from datafile
  criticName=$(echo $criticName | cut -d',' -f1)

  # If same criticName add 2 to criticName else don't
  if [[ $criticName == $criticNameTemp ]]; then
    echo "{\"$id\": \"$criticName$sec\"}," >> ./assets/js/critics.json
  else
    echo "{\"$id\": \"$criticName\"}," >> ./assets/js/critics.json
  fi

  id=$[$id+1]
  criticNameTemp=$criticName

done 3<$dataFile

cat assets/js/critics.json | tr '\n' ' ' | sed 's/..$/ ]}/' > temp
cat temp > ./assets/js/critics.json

# Delete temp file
rm -f ./temp*
