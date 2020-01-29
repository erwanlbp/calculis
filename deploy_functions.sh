#!/bin/bash

deploy_mesage=to_change

## Check that there is the correct number of args
case ${#} in
	1)
		deploy_mesage=--message $1
		;;
	*)
	  echo ""
		echo "one argument required : the deployment message"
		echo ""
		exit 3
		;;
esac

firebase deploy --only functions $deploy_mesage

exit 0
