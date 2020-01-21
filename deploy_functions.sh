#!/bin/bash

deploy_mesage=$1

firebase deploy --only functions --message $deploy_mesage

exit 0
