#!/bin/bash
curl -X POST 'https://id.twitch.tv/oauth2/token' \
-d 'client_id=uvq3fvqfdt14kvfxdohzy2jqxwmk6a' \
-d 'client_secret=flntxj030mts7riv305bsi8yoawdbq' \
-d 'grant_type=client_credentials'

#used bash getToken.sh to get the token