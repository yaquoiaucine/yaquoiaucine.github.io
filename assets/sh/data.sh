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
  rm -f log
}

# Abord script function
abord_script () {
  # Download previous JSON
  curl -s https://yaquoiaucine.fr/assets/js/data.json > ./assets/js/data.json

  remove_files

  echo "----------------------------------------------------------------------------------------------------"
  echo "abord script"

  # Exit script
  exit 1
}

remove_files

# Main variables
testing=$1
baseUrl=$2
if [[ -z $baseUrl ]]; then
  baseUrl=https://www.allocine.fr/film/aucinema/
else
  baseUrl=https://www.allocine.fr/films/
fi
filmsNumberIndexFirst=1
pagesNumberMin=1
pagesNumberMax=$3
if [[ -z $pagesNumberMax ]]; then
  pagesNumberMax=15
else
  pagesNumberMax=$3
fi
filmsNumberMax=15
checkMissingShows=$4
SECONDS=0

# Check before starting script
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

# Remove lines with no data
sed -i '' "/noImdbId,noBetaseriesId/d" ./assets/sh/filmsIds.txt

echo "----------------------------------------------------------------------------------------------------"
betaseriesIdNotFoundNumber=$(cat assets/sh/filmsIds.txt | grep "[0-9],noBetaseriesId" | wc -l | awk '{print $1}')
echo "betaseriesIdNotFoundNumber: $betaseriesIdNotFoundNumber"
for betaseriesIdNotFoundNumberIndex in $( eval echo {1..$betaseriesIdNotFoundNumber} )
do
  imdbIdFound=$(cat assets/sh/filmsIds.txt | grep "[0-9],noBetaseriesId" | head -$betaseriesIdNotFoundNumberIndex | tail -1 | cut -d',' -f2)
  echo "imdbIdFound: $imdbIdFound"
  betaseriesCode=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&imdb_id\=$imdbIdFound | jq '.errors[0].code')
  if [[ $betaseriesCode != "4001" ]]; then
    echo "----------------------------------------------------------------------------------------------------"
    echo "betaseriesCode: $betaseriesCode"
    echo "imdbIdFound: $imdbIdFound"
    exit 0
  fi
done

echo "----------------------------------------------------------------------------------------------------"
imdbIdNotFoundNumber=$(cat assets/sh/filmsIds.txt | grep "noImdbId,[[:alnum:]]" | wc -l | awk '{print $1}')
echo "imdbIdNotFoundNumber: $imdbIdNotFoundNumber"
for imdbIdNotFoundNumberIndex in $( eval echo {1..$imdbIdNotFoundNumber} )
do
  betaseriesIdFound=$(cat assets/sh/filmsIds.txt | grep "noImdbId,[[:alnum:]]" | head -$imdbIdNotFoundNumberIndex | tail -1 | cut -d',' -f3)
  echo "betaseriesIdFound: $betaseriesIdFound"
  if [[ $betaseriesIdFound == serie* ]]; then
    betaseriesIdFoundNew=$(echo $betaseriesIdFound | cut -d'/' -f2)
    imdbRes=$(curl -s https://api.betaseries.com/shows/display\?key\=7f7fef35706f\&url\=$betaseriesIdFoundNew | jq '.show.imdb_id')
  else
    betaseriesIdFoundNew=$(echo $betaseriesIdFound | grep -Eo "[0-9]+")
    imdbRes=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&id\=$betaseriesIdFoundNew | jq '.movie.imdb_id')
  fi
  if [[ $imdbRes != "\"\"" ]]; then
    echo "----------------------------------------------------------------------------------------------------"
    echo "imdbRes: $imdbRes"
    echo "betaseriesIdFound: $betaseriesIdFound"
    exit 0
  fi
done

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
  if [[ $pagesNumber -gt 15 ]]; then
    pagesNumber=$pagesNumberMax
  fi
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

    # Check if missing shows
    filmsIdsFile="./assets/sh/filmsIds.txt"
    while IFS= read -r filmsIdsLine <&3; do
      allocineLineUrl=$(echo $filmsIdsLine | cut -d',' -f1)

      if [[ $url == $allocineLineUrl ]]; then
        found=1
        break
      else
        found=0
      fi
    done 3<$filmsIdsFile

    if [[ $found -eq 0 ]]; then
      if [[ -z $testing ]]; then
        abord_script
      fi
    fi

    if [[ -z $checkMissingShows ]] || [[ $found -eq 0 ]]; then
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
        titleURLEncoded=$(echo $title | tr '[:upper:]' '[:lower:]' | sed -f ./assets/sed/url_escape.sed)
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
            if [[ $betaseriesTitle == serie* ]]; then
              echo "\"betaseriesId\": \"$betaseriesTitle\"," >> ./assets/js/data.json
              curl -s https://www.betaseries.com/$betaseriesTitle > temp9
            else
              echo "\"betaseriesId\": \"film/$betaseriesTitle\"," >> ./assets/js/data.json
              curl -s https://www.betaseries.com/film/$betaseriesTitle > temp9
            fi
            betaseriesFound=1
            break
          else
            betaseriesFound=0
          fi
        done 3<$filmsIdsFile

        if [[ $betaseriesFound -eq 0 ]]; then
          echo "----------------------------------------------------------------------------------------------------"
          echo "filmId: $filmId"
          wikiData=0
          wikiUrl=$(curl -s https://query.wikidata.org/sparql\?query\=SELECT%20%3Fitem%20%3FitemLabel%20WHERE%20%7B%0A%20%20%3Fitem%20wdt%3AP1265%20%22$filmId%22.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22en%22.%20%7D%0A%7D | grep "uri" | cut -d'>' -f2 | cut -d'<' -f1 | sed 's/http/https/' | sed 's/entity/wiki/')
          if [[ -z $wikiUrl ]]; then
            echo "wikiUrl: noWikiUrl"
            echo "titleURLEncoded: $titleURLEncoded"
            imdbId=$(curl -s https://www.imdb.com/find\?q\=$titleURLEncoded\&s\=tt\&ttype\=ft | grep -m1 "<td class=\"primary_photo\">" | grep -Eo "tt[0-9]+" | head -1)
            echo "imdbId: $imdbId"
          else
            echo "wikiUrl: $wikiUrl"
            imdbId=$(curl -s $wikiUrl | grep "https://wikidata-externalid-url.toolforge.org/?p=345" | grep -Eo "tt[0-9]+" | head -1)
            echo "imdbId: $imdbId"
            wikiData=1
          fi

          if [[ -z $imdbId ]]; then
            echo "imdbId: noImdbId"
            imdbId="noImdbId"
          fi

          echo "wikiData: $wikiData"
          if [[ $wikiData -eq 0 ]]; then
            BetaseriesOriginalTitle=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&imdb_id\=$imdbId | jq '.movie.original_title' | tr '[:upper:]' '[:lower:]' | sed 's/"//g')
            BetaseriesOriginalTitleYear=$(echo $BetaseriesOriginalTitle | grep " ([0-9][0-9][0-9][0-9])" | grep -Eo "[0-9]+")
            BetaseriesOriginalTitleLang=$(echo $BetaseriesOriginalTitle | grep " (fr)" | grep -Eo "fr")
            if [[ ! -z $BetaseriesOriginalTitleYear ]] || [[ ! -z $BetaseriesOriginalTitleLang ]]; then
              if [[ -z $BetaseriesOriginalTitleYear ]]; then
                BetaseriesOriginalTitleYear=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&imdb_id\=$imdbId | jq '.movie.release_date' | cut -d'-' -f1)
              fi
              echo "----------------------------------------------------------------------------------------------------"
              echo "BetaseriesOriginalTitleYear: $BetaseriesOriginalTitleYear"
              echo "BetaseriesOriginalTitleYear: $BetaseriesOriginalTitleYear" >> log
              if [[ ! -z $BetaseriesOriginalTitleLang ]]; then
                echo "BetaseriesOriginalTitleLang: $BetaseriesOriginalTitleLang"
                echo "BetaseriesOriginalTitleLang: $BetaseriesOriginalTitleLang" >> log
              fi
              if [[ $BetaseriesOriginalTitleYear != $creationDate ]]; then
                imdbId=$(curl -s https://www.imdb.com/find\?q\=$titleURLEncoded\&s\=tt\&ttype\=ft | grep -m1 "<td class=\"primary_photo\">" | grep -Eo "tt[0-9]+" | head -3 | tail -1)
                BetaseriesOriginalTitle=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&imdb_id\=$imdbId | jq '.movie.original_title' | tr '[:upper:]' '[:lower:]' | sed 's/"//g')
                BetaseriesOriginalTitleYear=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&imdb_id\=$imdbId | jq '.movie.release_date' | cut -d'-' -f1)
                echo "BetaseriesOriginalTitleYear: $BetaseriesOriginalTitleYear"
                echo "BetaseriesOriginalTitleYear: $BetaseriesOriginalTitleYear" >> log
                if [[ $BetaseriesOriginalTitleYear != $creationDate ]]; then
                  echo "creationDate: $creationDate"
                  echo "creationDate: $creationDate" >> log
                  imdbId="noImdbId"
                fi
              fi
              BetaseriesOriginalTitleNew=$(echo $BetaseriesOriginalTitle | sed 's/ ([0-9][0-9][0-9][0-9])//' | sed 's/ (fr)//')
              titleLower=$(echo $title | tr '[:upper:]' '[:lower:]' | sed 's/ ([0-9][0-9][0-9][0-9])//' | sed 's/ (fr)//')
              echo "BetaseriesOriginalTitleNew: $BetaseriesOriginalTitleNew"
              echo "titleLower: $titleLower"
              echo "BetaseriesOriginalTitleNew: $BetaseriesOriginalTitleNew" >> log
              echo "titleLower: $titleLower" >> log
            else
              BetaseriesOriginalTitleNew=$BetaseriesOriginalTitle
              titleLower=$(echo $title | tr '[:upper:]' '[:lower:]')
              echo "BetaseriesOriginalTitleNew: $BetaseriesOriginalTitleNew"
              echo "titleLower: $titleLower"
              echo "BetaseriesOriginalTitleNew: $BetaseriesOriginalTitleNew" >> log
              echo "titleLower: $titleLower" >> log
            fi

            if [[ $BetaseriesOriginalTitleNew != $titleLower ]]; then
              echo "BetaseriesOriginalTitleNew: $BetaseriesOriginalTitleNew"
              echo "titleLower: $titleLower"
              echo "BetaseriesOriginalTitleNew: $BetaseriesOriginalTitleNew" >> log
              echo "titleLower: $titleLower" >> log
              imdbId="noImdbId"
            fi
          fi

          betaseriesId="noBetaseriesId"
          betaseriesResourceUrl="noBetaseriesURL"
          if [[ $imdbId != "noImdbId" ]]; then
            betaseriesId=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&imdb_id\=$imdbId | jq '.movie.resource_url' | cut -d'/' -f5 | sed 's/"//g')
            betaseriesIdNumber=$(echo $betaseriesId | cut -d'-' -f1)
            betaseriesResourceUrl=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&imdb_id\=$imdbId | jq '.movie.resource_url' | sed 's/"//g')
            imdbIdCheck=$(curl -s https://api.betaseries.com/movies/movie\?key\=7f7fef35706f\&id\=$betaseriesIdNumber | jq '.movie.imdb_id' | sed 's/"//g')
            if [[ $imdbId != $imdbIdCheck ]]; then
              echo "----------------------------------------------------------------------------------------------------"
              echo "imdbId: $imdbId"
              echo "imdbIdCheck: $imdbIdCheck"
              imdbId="noImdbId"
              betaseriesId="noBetaseriesId"
              betaseriesResourceUrl="noBetaseriesURL"
            fi
          fi

          curl -s https://www.imdb.com/title/$imdbId/ > temp6
          curl -s $betaseriesResourceUrl > temp9

          echo "$url,$imdbId,$betaseriesId" >> assets/sh/filmsIds.txt
        fi

        echo "----------------------------------------------------------------------------------------------------"
        echo "page: $pagesNumberIndex/$pagesNumber - movie: $filmsNumberIndex/$filmsNumber - title: $title - filmId: $filmId ✅"

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
    fi

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