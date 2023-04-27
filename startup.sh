#!/bin/bash
cd easychef
npm i package.json

cd ../back_end

VENV='group_432'
DBN=$(cat ./easychef/settings.py | grep NAME | head -1 | awk -F\' '{print $4}')
python3 -m virtualenv -p $(which python3) $VENV
. $VENV/bin/activate
sh startup.sh

# Wait for both servers to finish
wait
