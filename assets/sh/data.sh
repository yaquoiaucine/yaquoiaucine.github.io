# Remove temp files function
remove_files () {
  # Delete temp file
  rm -f ./temp*
  rm -f ./assets/sh/criticNameBis.txt
  rm -f ./assets/sh/criticNameBisSorted.txt
  rm -f ./assets/sh/criticNameGenreButtonsTemp.txt
  rm -f ./assets/sh/criticNameNetworkButtonsTemp.txt
  rm -f ./assets/sh/criticNameNetworkButtonsTemp2.txt
  rm -f ./assets/sh/criticNameNationalityButtonsTemp.txt
  rm -f ./assets/sh/criticNameTemp.txt
  rm -f ./assets/sh/urlTemp.txt
}

# Abord script function
abord_script () {
  # Download previous JSON
  curl -s https://yaquoiaucine.fr/assets/js/data.json > ./assets/js/data.json

  remove_files

  # Exit script
  exit 1
}

remove_files

# Main variables
baseUrl=https://www.allocine.fr/film/aucinema/
filmsNumberIndexFirst=1
pagesNumberMin=1
filmsNumberMax=15
imdbResultNumberMax=5
filmCreatorNumber=2
allocineStarNumber=9
SECONDS=0

# Check before starting script
testing=$1
curl -s $baseUrl > temp
curl -s https://yaquoiaucine.fr/assets/sh/checkingFile.txt > ./assets/sh/checkingFile.txt
firstfilm=$(cat temp | grep "/film/fichefilm_gen_cfilm" | head -1 | head -1 | cut -d'>' -f2 | cut -d'<' -f1)
secondfilm=$(cat temp | grep "/film/fichefilm_gen_cfilm" | head -2 | tail -1 | cut -d'>' -f2 | cut -d'<' -f1)
thirdfilm=$(cat temp | grep "/film/fichefilm_gen_cfilm" | head -3 | tail -1 | cut -d'>' -f2 | cut -d'<' -f1)
fourthfilm=$(cat temp | grep "/film/fichefilm_gen_cfilm" | head -4 | tail -1 | cut -d'>' -f2 | cut -d'<' -f1)
fifthfilm=$(cat temp | grep "/film/fichefilm_gen_cfilm" | head -5 | tail -1 | cut -d'>' -f2 | cut -d'<' -f1)
firstfilmFromFile=$(cat ./assets/sh/checkingFile.txt | cut -d',' -f1)
if [[ ! -z $testing ]]; then
  firstfilmFromFile="testing"
fi
secondfilmFromFile=$(cat ./assets/sh/checkingFile.txt | cut -d',' -f2)
thirdfilmFromFile=$(cat ./assets/sh/checkingFile.txt | cut -d',' -f3)
fourthfilmFromFile=$(cat ./assets/sh/checkingFile.txt | cut -d',' -f4)
fifthfilmFromFile=$(cat ./assets/sh/checkingFile.txt | cut -d',' -f5)
if [[ $firstfilm != $firstfilmFromFile ]] || [[ $secondfilm != $secondfilmFromFile ]] || [[ $thirdfilm != $thirdfilmFromFile ]] || [[ $fourthfilm != $fourthfilmFromFile ]] || [[ $fifthfilm != $fifthfilmFromFile ]]; then
  echo $firstfilm,$secondfilm,$thirdfilm,$fourthfilm,$fifthfilm > ./assets/sh/checkingFile.txt
  echo "Data will be updated"
else
  curl -s https://yaquoiaucine.fr/assets/js/data.json > ./assets/js/data.json
  rm -f ./temp*
  echo "Data is the same, script will exit now"
  exit 0
fi

# Add criticName first list
cat ./assets/sh/criticName.txt | cut -d',' -f1 | sort | uniq >> ./assets/sh/criticNameTemp.txt

# Add first line to URLs check file
echo "first line" >> ./assets/sh/urlTemp.txt

# Add {"data":[{ at JSON beginning
echo "{\"data\":[{" > ./assets/js/data.json

# Get top films page
curl -s $baseUrl > temp

# Get AlloCiné baseUrl films number
filmsNumber=$(cat temp | grep "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | wc -l | awk '{print $1}')
if [[ $filmsNumber -gt 15 ]]; then
  filmsNumber=$filmsNumberMax
fi

if [[ $filmsNumber -lt 15 ]]; then
  # Define AlloCiné baseUrl pages number to 1
  pagesNumber=1
else
  # Define AlloCiné baseUrl pages number
  pagesNumber=$(cat temp | grep -Eo "\">[0-9]+</a></div></nav>" | cut -d'>' -f2 | cut -d'<' -f1)
fi

# Loop through all AlloCiné pages
for pagesNumberIndex in $( eval echo {$pagesNumberMin..$pagesNumber} )
do
  # Get AlloCiné first page
  if [[ $pagesNumberIndex -eq 1 ]]; then
    id=1
  # Get AlloCiné second until second to last page
  elif [[ $pagesNumberIndex -lt $pagesNumber ]]; then
    curl -s $baseUrl\?page\=$pagesNumberIndex > temp

    checkfilmsNumber=$(cat temp | grep "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | wc -l | awk '{print $1}')
    if [[ $checkfilmsNumber -eq 0 ]]; then
      curl -s $baseUrl\?page\=$pagesNumberIndex > temp
    fi
  # Get AlloCiné last page
  elif [[ $pagesNumberIndex -eq $pagesNumber ]]; then
    curl -s $baseUrl\?page\=$pagesNumberIndex > temp

    filmsNumber=$(cat temp | grep "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | wc -l | awk '{print $1}')
    if [[ $filmsNumber -gt 15 ]]; then
      filmsNumber=$filmsNumberMax
    fi
  fi

  filmsNumberIndex=$filmsNumberIndexFirst
  while [[ $filmsNumberIndex -le $filmsNumber ]]
  do
    # Add id
    echo "\"id\": \"$id\"," >> ./assets/js/data.json

    # Add AlloCiné data object
    echo "\"allocineData\":{" >> ./assets/js/data.json

    # Get AlloCiné film url
    url=$(cat temp | grep -m$filmsNumberIndex "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | tail -1 | head -1 | cut -d'"' -f4)

    urlFile="./assets/sh/urlTemp.txt"
    while IFS= read -r urlTemp <&3; do
      if [[ $url == $urlTemp ]]; then
        duplicate=1
        break
      else
        duplicate=0
      fi
    done 3<$urlFile

    echo $url >> ./assets/sh/urlTemp.txt

    if [[ $duplicate -eq 0 ]]; then
      curl -s https://www.allocine.fr$url > temp2
      completeUrl=https://www.allocine.fr$url
      echo "\"url\": \"$completeUrl\"," >> ./assets/js/data.json

      # Get film title
      title=$(cat temp2 | grep -m1 "<meta property=\"og:title\" content=\"" | cut -d'"' -f4 | sed 's/&#039;/'"'"'/' | sed 's/^[[:blank:]]*//;s/[[:blank:]]*$//')
      betaseriesSecondTitle=$title
      echo "\"title\": \"$title\"," >> ./assets/js/data.json

      # Get original title for IMDb
      originalTitle=$(cat temp2 | grep -A1 "Titre original" | tail -1 | cut -d'>' -f2 | cut -d'<' -f1 | sed 's/&#039;/'"'"'/' | sed 's/\&amp;/\&/g' | sed 's/^[[:blank:]]*//;s/[[:blank:]]*$//')
      originalTitleNumber=$(cat temp2 | grep -A1 "Titre original" | tail -1 | cut -d'>' -f2 | cut -d'<' -f1 | wc -l | awk '{print $1}')
      if [[ $originalTitleNumber -gt 0 ]]; then
        title=$originalTitle
      fi

      # Get film creation date
      creationDate=$(cat temp2 | grep -A6 "date blue-link" | grep "[0-9][0-9][0-9][0-9]" | sed 's/^[[:blank:]]*//;s/[[:blank:]]*$//')
      echo "\"creationDate\": \"$creationDate\"," >> ./assets/js/data.json

      # Get film duration
      duration=$(cat temp2 | grep -Eo "[0-9]+h [0-9]+min")
      echo "\"duration\": \"$duration\"," >> ./assets/js/data.json

      # Get film picture
      picture=$(cat temp2 | grep -m1 "<meta property=\"og:image\" content=\"" | cut -d'"' -f4)
      echo "\"picture\": \"$picture\"," >> ./assets/js/data.json

      # Get film id
      filmId=$(cat temp | grep -m$filmsNumberIndex "<a class=\"meta-title-link\" href=\"/film/fichefilm_gen_cfilm=" | tail -1 | head -1 | cut -d'"' -f4 | cut -d'=' -f2 | cut -d'.' -f1)
      curl -s https://www.allocine.fr/film/fichefilm-$filmId/critiques/presse/ > temp3

      # Get film trailer id
      filmTrailerId=$(cat temp2 | grep "Bandes-annonces" | head -1 | cut -d'=' -f4 | cut -d'&' -f1)
      echo "\"filmTrailerId\": \"$filmTrailerId\"," >> ./assets/js/data.json

      # Get all film genres
      genreNumber=$(cat temp2 | grep -m3 "<span class=\"ACrL2ZACrpbG1zL2dlbnJlL" | cut -d'>' -f2 | cut -d'<' -f1 | wc -l | awk '{print $1}')
      if [[ $genreNumber -gt 0 ]]; then
        echo "\"genre\":{" >> ./assets/js/data.json

        for genreNumberIndex in $( eval echo {1..$genreNumber} )
        do
          genreName=$(cat temp2 | grep -m3 "<span class=\"ACrL2ZACrpbG1zL2dlbnJlL" | cut -d'>' -f2 | cut -d'<' -f1 | head -$genreNumberIndex | tail -1)
          echo "\"id$genreNumberIndex\": \"$genreName\"," >> ./assets/js/data.json
          echo $genreName >> ./assets/sh/criticNameGenreButtonsTemp.txt
        done

        echo "}," >> ./assets/js/data.json
      fi

      # Get all film nationalities
      nationalityNumber=$(cat temp2 | grep " nationality" | wc -l | awk '{print $1}')
      if [[ $nationalityNumber -gt 0 ]]; then
        echo "\"nationality\":{" >> ./assets/js/data.json

        for nationalityNumberIndex in $( eval echo {1..$nationalityNumber} )
        do
          nationalityNameTemp=$(cat temp2 | grep " nationality" | head -$nationalityNumberIndex | tail -1 | cut -d'>' -f2 | cut -d'<' -f1 | sed 's/^[[:blank:]]*//;s/[[:blank:]]*$//')
          nationalityName=$(echo $nationalityNameTemp | awk '{print toupper(substr($0,0,1))tolower(substr($0,2))}')
          echo "\"id$nationalityNumberIndex\": \"$nationalityName\"," >> ./assets/js/data.json
          echo $nationalityName >> ./assets/sh/criticNameNationalityButtonsTemp.txt
        done

        echo "}," >> ./assets/js/data.json
      fi

      # Get all critic ratings
      echo "\"criticNames\":{" >> ./assets/js/data.json

      criticNumber=0
      dataFile="./assets/sh/criticName.txt"
      while IFS= read -r criticName <&3; do
        criticName=$(echo $criticName | cut -d',' -f1)
        criticNameFirst=$(echo $criticName | cut -d',' -f1)
        criticRatingNumber=$(cat temp3 | grep "js-anchor-link\">$criticName<" | cut -d'"' -f6 | wc -l | awk '{print $1}')

        if [[ $criticNameFirst != $criticNameTemp ]]; then
          if [[ $criticRatingNumber -gt 0 ]]; then
            for criticRatingNumberIndex in $( eval echo {1..$criticRatingNumber} )
            do
              criticRating=$(cat temp3 | grep -m$criticRatingNumberIndex "js-anchor-link\">$criticName<" | tail -1 | head -1 | cut -d'"' -f6)

              if [[ $criticRatingNumberIndex -gt 1 ]]; then
                criticNameTemp="$criticName"
                criticName="$criticName$criticRatingNumberIndex"
              fi

              if [[ $criticName == "Pop Matters" ]]; then
                criticName="PopMatters"
              fi

              echo $criticName >> ./assets/sh/criticNameTemp.txt

              case $criticRating in
                "Chef-d&#039;oeuvre")
                  echo "\"$criticName\": \"5\"," >> ./assets/js/data.json
                  ;;
                "Excellent")
                  echo "\"$criticName\": \"4.5\"," >> ./assets/js/data.json
                  ;;
                "Tr&egrave;s bien")
                  echo "\"$criticName\": \"4\"," >> ./assets/js/data.json
                  ;;
                "Bien")
                  echo "\"$criticName\": \"3.5\"," >> ./assets/js/data.json
                  ;;
                "Pas mal")
                  echo "\"$criticName\": \"3\"," >> ./assets/js/data.json
                  ;;
                "Moyen")
                  echo "\"$criticName\": \"2.5\"," >> ./assets/js/data.json
                  ;;
                "Pas terrible")
                  echo "\"$criticName\": \"2\"," >> ./assets/js/data.json
                  ;;
                "Mauvais")
                  echo "\"$criticName\": \"1.5\"," >> ./assets/js/data.json
                  ;;
                "Tr&egrave;s mauvais")
                  echo "\"$criticName\": \"1\"," >> ./assets/js/data.json
                  ;;
                "Nul")
                  echo "\"$criticName\": \"0.5\"," >> ./assets/js/data.json
                  ;;
                *)
                  echo "\"$criticName\": \"\"," >> ./assets/js/data.json
                  ;;
              esac

              if [[ $criticRatingNumberIndex -gt 1 ]]; then
                criticName="$criticNameTemp"
              fi

              criticNumber=$[$criticNumber+1]
            done
          fi
        fi

        criticNameTemp=$criticNameFirst
      done 3<$dataFile

      echo "}," >> ./assets/js/data.json

      # Get critic number
      echo "\"criticNumber\": \"$criticNumber\"," >> ./assets/js/data.json

      # Get critic rating front page
      criticFrontPage=$(cat temp2 | grep -Eo "<span class=\"stareval-note\">[0-9],[0-9]</span><span class=\"stareval-review light\"> [0-9]+ critique*" | cut -d'>' -f2 | cut -d'<' -f1 | sed 's/,/./')
      echo "\"criticFrontPage\": \"$criticFrontPage\"," >> ./assets/js/data.json

      # Get critic rating back page
      critic=$(cat temp3 | grep -m1 -Eo "</div><span class=\"stareval-note\">[0-9],[0-9]</span></div>" | cut -d'>' -f3 | cut -d'<' -f1 | sed 's/,/./')
      criticZero=$(cat temp3 | grep -m1 -Eo "[0-9] titre de presse")
      if [[ $criticZero == "0 titre de presse" ]]; then
        critic=$criticFrontPage
      fi
      echo "\"critic\": \"$critic\"," >> ./assets/js/data.json

      # Get user rating number
      user=$(cat temp2 | grep -Eo "<span class=\"stareval-note\">[0-9],[0-9]</span><span class=\"stareval-review light\"> [0-9]+ note*" | cut -d'>' -f2 | cut -d'<' -f1 | sed 's/,/./')
      echo "\"user\": \"$user\"," >> ./assets/js/data.json

      # Add ending bracket
      echo "}," >> ./assets/js/data.json

      # Add Betaseries object
      echo "\"betaseriesData\":{" >> ./assets/js/data.json

      filmsIdsFile="./assets/sh/filmsIds.txt"
      while IFS= read -r filmsIdsLine <&3; do
        allocineLineUrl=$(echo $filmsIdsLine | cut -d',' -f1)

        if [[ $url == $allocineLineUrl ]]; then
          imdbId=$(echo $filmsIdsLine | cut -d',' -f2)
          curl -s https://www.imdb.com/title/$imdbId/ > temp6

          betaseriesTitle=$(echo $filmsIdsLine | cut -d',' -f3)
          echo "\"betaseriesId\": \"$betaseriesTitle\"," >> ./assets/js/data.json
          curl -s https://www.betaseries.com/film/$betaseriesTitle > temp9
          betaseriesFound=1
          break
        else
          betaseriesFound=0
        fi
      done 3<$filmsIdsFile

      if [[ $betaseriesFound -eq 0 ]]; then
        if [[ -z $testing ]]; then
          abord_script
        fi

        # Get betaseries film page
        creationYear=$(cat temp2 | grep -A6 "date blue-link" | grep -Eo "[0-9][0-9][0-9][0-9]" | sed 's/^[[:blank:]]*//;s/[[:blank:]]*$//')
        betaseriesTitle=$(echo $title | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/url_escape.sed)
        betaseriesShowrunner=$(curl -s https://api.betaseries.com/movies/search\?key\=7f7fef35706f\&title\=$betaseriesTitle | jq '.movies[0].director' | sed 's/"//g' | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/betaseries_escape.sed | sed -f ./assets/sed/betaseries_director.sed)
        betaseriesDate=$(curl -s https://api.betaseries.com/movies/search\?key\=7f7fef35706f\&title\=$betaseriesTitle | jq '.movies[0].release_date' | grep -Eo "[0-9][0-9][0-9][0-9]")

        echo "--------------------"
        echo "creationYear: $creationYear"
        echo "betaseriesTitle: $betaseriesTitle"
        echo "betaseriesShowrunner: $betaseriesShowrunner"
        echo "betaseriesDate: $betaseriesDate"

        allocineShowrunner1=$(cat temp2 | grep -A100 "\"director\": " | sed -n '/director/,/\]/p' | grep "name" | cut -d'"' -f4 | head -1 | tail -1 | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/betaseries_escape.sed)
        echo allocineShowrunner1: $allocineShowrunner1
        allocineShowrunner2=$(cat temp2 | grep -A100 "\"director\": " | sed -n '/director/,/\]/p' | grep "name" | cut -d'"' -f4 | head -2 | tail -1 | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/betaseries_escape.sed)
        echo allocineShowrunner2: $allocineShowrunner2
        allocineShowrunner3=$(cat temp2 | grep -A100 "\"director\": " | sed -n '/director/,/\]/p' | grep "name" | cut -d'"' -f4 | head -3 | tail -1 | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/betaseries_escape.sed)
        echo allocineShowrunner3: $allocineShowrunner3
        if [[ $creationYear != $betaseriesDate ]] || { [[ $allocineShowrunner1 != $betaseriesShowrunner ]] && [[ $allocineShowrunner2 != $betaseriesShowrunner ]] && [[ $allocineShowrunner3 != $betaseriesShowrunner ]]; }; then
          creationYearNew=$[$creationYear+1]
          betaseriesTitle=$(echo $betaseriesSecondTitle | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/url_escape.sed)
          betaseriesShowrunner=$(curl -s https://api.betaseries.com/movies/search\?key\=7f7fef35706f\&title\=$betaseriesTitle | jq '.movies[0].director' | sed 's/"//g' | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/betaseries_escape.sed | sed -f ./assets/sed/betaseries_director.sed)
          betaseriesDate=$(curl -s https://api.betaseries.com/movies/search\?key\=7f7fef35706f\&title\=$betaseriesTitle | jq '.movies[0].release_date' | grep -Eo "[0-9][0-9][0-9][0-9]")
          echo "--------------------"
          echo "creationYear: $creationYear"
          echo "betaseriesTitle: $betaseriesTitle"
          echo "betaseriesShowrunner: $betaseriesShowrunner"
          echo "betaseriesDate: $betaseriesDate"
          if [[ $creationYear != $betaseriesDate ]] || { [[ $allocineShowrunner1 != $betaseriesShowrunner ]] && [[ $allocineShowrunner2 != $betaseriesShowrunner ]] && [[ $allocineShowrunner3 != $betaseriesShowrunner ]]; }; then
            echo "--------------------"
            echo "creationYearNew: $creationYearNew"
            echo "betaseriesTitle: $betaseriesTitle"
            echo "betaseriesShowrunner: $betaseriesShowrunner"
            echo "betaseriesDate: $betaseriesDate"
            if [[ $creationYearNew != $betaseriesDate ]] || { [[ $allocineShowrunner1 != $betaseriesShowrunner ]] && [[ $allocineShowrunner2 != $betaseriesShowrunner ]] && [[ $allocineShowrunner3 != $betaseriesShowrunner ]]; }; then
              echo "--------------------"
              echo "page number $pagesNumberIndex / $pagesNumber"
              echo "Serie $seriesNumberIndex / $seriesNumber"
              echo "Betaseries id KO"
              echo $id / "https://www.allocine.fr$url" ❌

              betaseriesId="noBetaseriesId"
              exit 0
            fi
          fi
        fi

        # Get Betaseries url id
        if [[ $betaseriesId != "noBetaseriesId" ]]; then
          betaseriesId=$(curl -s https://api.betaseries.com/movies/search\?key\=7f7fef35706f\&title\=$betaseriesTitle | jq '.movies[0].resource_url' | cut -d'/' -f5 | sed 's/"//g')
          betaseriesResourceUrl=$(curl -s https://api.betaseries.com/movies/search\?key\=7f7fef35706f\&title\=$betaseriesTitle | jq '.movies[0].resource_url' | sed 's/"//g')
          curl -s $betaseriesResourceUrl > temp9

          imdbId=$(curl -s https://api.betaseries.com/movies/search\?key\=7f7fef35706f\&title\=$betaseriesTitle | jq '.movies[0].imdb_id' | sed 's/"//g')
          curl -s https://www.imdb.com/title/$imdbId/ > temp6
        fi

        echo "$url,$imdbId,$betaseriesId" >> assets/sh/filmsIds.txt
      fi

      echo "--------------------"
      echo "$id $title ✅"

      # Get Betaseries rating number
      betaseriesRating=$(cat temp9 | grep "stars js-render-stars" | cut -d'"' -f4 | cut -d' ' -f1 | sed 's/,/./g')
      echo "\"betaseriesRating\": \"$betaseriesRating\"," >> ./assets/js/data.json

      # Add ending bracket
      echo "}," >> ./assets/js/data.json

      # Add IMDb object
      echo "\"imdbData\":{" >> ./assets/js/data.json

      # Get IMDb rating number
      imdbRating=$(cat temp6 | grep -m1 "ratingValue" | cut -d'"' -f4)

      # Add IMDb last episode date, ID and rating number
      echo "\"imdbId\": \"$imdbId\"," >> ./assets/js/data.json
      echo "\"imdbRating\": \"$imdbRating\"," >> ./assets/js/data.json
    fi

    # Add ending bracket
    echo "}," >> ./assets/js/data.json

    # Add },{ after every keys
    echo "},{" >> ./assets/js/data.json
    filmsNumberIndex=$[$filmsNumberIndex+1] id=$[$id+1]
  done
done

# Get double critic to file
cat ./assets/sh/criticNameTemp.txt | sort | uniq -u | grep '2$' > ./assets/sh/criticNameBis.txt
criticNameDoubleNumber=$(cat ./assets/sh/criticNameBis.txt | wc -l | awk '{print $1}')
rm -f ./assets/sh/criticNameArray.txt
for criticNameDoubleNumberIndex in $( eval echo {1..$criticNameDoubleNumber} )
do
  criticNameNode=$(cat ./assets/sh/criticNameBis.txt | head -$criticNameDoubleNumberIndex | tail -1)
  echo "'$criticNameNode'," >> ./assets/sh/criticNameArray.txt
done

# Get duplicate critic to file
cat ./assets/sh/criticNameTemp.txt | sort | uniq -d >> ./assets/sh/criticNameBis.txt
cat ./assets/sh/criticNameBis.txt | sort > ./assets/sh/criticNameBisSorted.txt
criticNameActualNumber=$(cat ./assets/sh/criticNameBisSorted.txt | wc -l | awk '{print $1}')
rm -f ./assets/sh/criticNameCriticButtons.txt
for criticNameActualNumberIndex in $( eval echo {1..$criticNameActualNumber} )
do
  criticNameHTML=$(cat ./assets/sh/criticNameBisSorted.txt | sed 's/2$/ Contre/' | head -$criticNameActualNumberIndex | tail -1)
  echo "<li class=\"criticButton\"><a href=\"#\">$criticNameHTML<span><input id=\"criticToggle$criticNameActualNumberIndex\" type=\"checkbox\" checked=\"checked\"><label for=\"criticToggle$criticNameActualNumberIndex\"></label></span></a></li>" >> ./assets/sh/criticNameCriticButtons.txt
done

# Get used genre
criticNameGenreButtonsNumber=$(cat ./assets/sh/criticNameGenreButtonsTemp.txt | sort | uniq -c | wc -l | awk '{print $1}')
rm -f ./assets/sh/criticNameGenreButtons.txt
for criticNameGenreButtonsNumberIndex in $( eval echo {1..$criticNameGenreButtonsNumber} )
do
  criticNameGenreButtons=$(cat ./assets/sh/criticNameGenreButtonsTemp.txt | sort | uniq -c | cut -c 6- | head -$criticNameGenreButtonsNumberIndex | tail -1)
  echo "<button class=\"btn btn--primary genreButton\" data-group=\"$criticNameGenreButtons\">$criticNameGenreButtons</button>" | tr -d '\n' >> ./assets/sh/criticNameGenreButtons.txt
done
echo "<button class=\"btn btn--primary genreButton\" data-group=\"Non renseigné\">Non renseigné</button>" | tr -d '\n' >> ./assets/sh/criticNameGenreButtons.txt

# Get used nationalities
criticNameNationalityButtonsNumber=$(cat ./assets/sh/criticNameNationalityButtonsTemp.txt | sort | uniq -c | wc -l | awk '{print $1}')
rm -f ./assets/sh/criticNameNationalityButtons.txt
for criticNameNationalityButtonsNumberIndex in $( eval echo {1..$criticNameNationalityButtonsNumber} )
do
  criticNameNationalityButtons=$(cat ./assets/sh/criticNameNationalityButtonsTemp.txt | sort | uniq -c | cut -c 6- | head -$criticNameNationalityButtonsNumberIndex | tail -1)
  echo "<li class=\"nationalityButton\"><a href=\"#\">$criticNameNationalityButtons<span><input id=\"nationalityButton$criticNameNationalityButtonsNumberIndex\" type=\"checkbox\" checked=\"checked\"><label for=\"nationalityButton$criticNameNationalityButtonsNumberIndex\"></label></span></a></li>" >> ./assets/sh/criticNameNationalityButtons.txt
done
lastCriticNameNationalityButtonsNumber=$[$criticNameNationalityButtonsNumber+1]
echo "<li class=\"nationalityButton\"><a href=\"#\">Non renseignée<span><input id=\"nationalityButton$lastCriticNameNationalityButtonsNumber\" type=\"checkbox\" checked=\"checked\"><label for=\"nationalityButton$lastCriticNameNationalityButtonsNumber\"></label></span></a></li>" >> ./assets/sh/criticNameNationalityButtons.txt

# Remove lines break and extra commas
cat ./assets/js/data.json | sed '$s/,{/]}/' | tr '\n' ' ' | sed 's/}, ]/}]/g' | sed 's/, },/},/g' | sed 's/......$/ }]}/' | sed 's/, },/},/g' | sed 's/}, }}/}}}/g' | sed 's/,{ "id": "[0-9][0-9]", "allocineData":{ }}//g' | sed 's/,{ "id": "[0-9][0-9][0-9]", "allocineData":{ }}//g' | sed 's/,{ "id": "[0-9][0-9][0-9]", "allocineData":{ } }//g' > temp
cat temp > ./assets/js/data.json

remove_files

# Add ending message with duration
dataDuration=$SECONDS
echo "Complete in $(($dataDuration / 60)) minutes and $(($dataDuration % 60)) seconds ✅"