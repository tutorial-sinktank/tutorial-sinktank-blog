#!/bin/bash

if [[ -n $1 && $1 == "--help" ]]; then
    echo "./create-post.sh [post name] [category]"
    exit
fi

if [[ -z $1 || -z $2 ]]; then
    echo "please provide full arguments ./create-post.sh [post name] [category]"
    exit
fi

POST_NAME=$1
CATEGORY=$2
DATE=$(date +'%Y-%m-%d')

TEMPLATE_PATH="./src/templates/post-template.md"
NEW_FILE_PATH="./posts/$CATEGORY/$POST_NAME.md"

cp $TEMPLATE_PATH $NEW_FILE_PATH


if [[ $OSTYPE == 'darwin'* ]]; then
  # these are commands for macOS
  sed -i "" "s|/postsCATEGORY|/posts$([[ $CATEGORY == "/" ]] && echo "" || echo $CATEGORY)|g" $NEW_FILE_PATH
  sed -i "" "s|CATEGORY|$CATEGORY|g" $NEW_FILE_PATH
  sed -i "" "s/POST_NAME/$POST_NAME/g" $NEW_FILE_PATH
  sed -i "" "s/DATE/$DATE/g" $NEW_FILE_PATH
else
  # thesr ar commands for linux
  sed -i "s|/postsCATEGORY|/posts$([[ $CATEGORY == "/" ]] && echo "" || echo $CATEGORY)|g" $NEW_FILE_PATH
  sed -i "s|CATEGORY|$CATEGORY|g" $NEW_FILE_PATH
  sed -i "s/POST_NAME/$POST_NAME/g" $NEW_FILE_PATH
  sed -i "s/DATE/$DATE/g" $NEW_FILE_PATH
fi

echo "created : $NEW_FILE_PATH"
