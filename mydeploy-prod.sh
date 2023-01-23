export FUNCTION_NAME=$1
MODULE_NAME=$2
# export AWS_PROFILE='integrations'
if [ -n "$2" ]; then
	scriptsPrefix="./"
	modulePrefix="./src/${MODULE_NAME}"
else
	scriptsPrefix="../"
	modulePrefix="."
fi

MODULE_ENV="prod"

echo 'Deploying...'
if [ -n "$FUNCTION_NAME" ]; then
	cd "$modulePrefix"
	NPM_TOKEN=${NPM_TOKEN} npx sls deploy --force function -f $FUNCTION_NAME --stage ${MODULE_ENV}
else
	echo '2'
	NPM_TOKEN=${NPM_TOKEN} npx sls deploy --force --stage ${MODULE_ENV}
fi
