#!/bin/sh

FILE_PATH=$1
OUTPUT_NAME=$2
ENCRYPTION_KEY=$3

gpg --quiet --batch --yes --decrypt --passphrase="$ENCRYPTION_KEY" \
--output $OUTPUT_NAME $FILE_PATH