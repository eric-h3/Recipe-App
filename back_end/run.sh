#!/bin/bash
VENV=$(cat startup.sh | head -2 | tail -1 | awk -F\' '{ print $2 }')
python3 manage.py runserver