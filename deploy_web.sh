#!/bin/bash

deploy_mesage=$1

firebase deploy --only hosting --message $deploy_mesage

exit 0
