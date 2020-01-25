#!/bin/bash

set -e

mkdir ~/.aws
touch ~/.aws/credentials
touch ~/.aws/config

echo "[default]
aws_access_key_id = $AWS_ACCESS_KEY_ID
aws_secret_access_key = $AWS_SECRET_ACCESS_KEY
region = $AWS_REGION" > ~/.aws/credentials

echo "[default]
output = text
region = $AWS_REGION" > ~/.aws/config

aws cloudformation package \
  --template-file $TEMPLATE \
  --output-template-file output-template.yaml \
  --s3-bucket $AWS_DEPLOY_BUCKET
aws cloudformation deploy \
  --template-file output-template.yaml \
  --stack-name $AWS_STACK_NAME
