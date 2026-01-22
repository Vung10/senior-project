#!/bin/bash

# Access token from saved file or environment variable
ACCESS_TOKEN="f7ctt6utjtsw96ie6s1io3wrms8zrt"
CLIENT_ID="uvq3fvqfdt14kvfxdohzy2jqxwmk6a"

# Make the API request
curl -X POST 'https://api.igdb.com/v4/games' \
-H "Client-ID: $CLIENT_ID" \
-H "Authorization: Bearer $ACCESS_TOKEN" \
-H "Accept: application/json" \
-d 'fields name, genres.name, platforms.name; limit 10;'
