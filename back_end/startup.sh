#!/bin/bash
pip install -r requirements.txt
if test -f $DBN; then
  python3 manage.py migrate
else
  python3 manage.py makemigrations
fi
bash ./run.sh