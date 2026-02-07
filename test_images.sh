#!/bin/bash
urls=(
"https://commons.wikimedia.org/wiki/Special:FilePath/Stone_Chariot_Hampi.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Dashashwamedh_Ghat_Ganga_Aarti.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Jallianwala_Bagh_Memorial.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Kapila_Theertham.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Solang_Valley_Manali.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/The_Mall_Shimla.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Nubra_Valley_View.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Fort_Aguada_Lighthouse.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Cellular_Jail_Port_Blair.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Mahabaleshwar_Temple_Gokarna.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Munnar_Tea_Plantations.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Kosi_River_Ramnagar.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Orchid_Park_Kaziranga.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Louvre_Museum_Wikimedia_Commons.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Shibuya_Crossing_Tokyo.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Monkey_Forest_Ubud.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/The_Dubai_Mall.jpg"
"https://commons.wikimedia.org/wiki/Special:FilePath/Fira_Santorini.jpg"
)

for url in "${urls[@]}"; do
  code=$(curl -o /dev/null -s -w "%{http_code}" "$url")
  if [[ "$code" == "302" || "$code" == "200" ]]; then
     echo "OK ($code): $url"
  else
     echo "FAIL ($code): $url"
  fi
done
