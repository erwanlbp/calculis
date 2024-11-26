help:
	@echo 'helm to be automatically created ...'

decrypt: # Decrypt config files
	sops -d src/environments/firebase.config.ts.encrypted > src/environments/firebase.config.ts

start: # Local start the app
	npm run start

deploy-hosting: # Deploy front app to firebase hosting
	npm run build && nvm use lts/iron && ./deploy_web.sh ${msg}

deploy-all-functions: # Deploy Go backend functions
	make deploy-function-OnUserDelete 
	make deploy-function-WaitForOpponent
	make deploy-function-UserLevelAnswer

deploy-function-OnUserDelete: # Deploy Go backend function
	gcloud functions deploy OnUserDelete --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-event-filters=type=google.cloud.firestore.document.v1.deleted \
--trigger-event-filters=database='(default)' \
--trigger-location=eur3 \
--trigger-event-filters-path-pattern=document='users/{userID}'

deploy-function-WaitForOpponent: # Deploy Go backend function
	gcloud functions deploy WaitForOpponent --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-http \
--allow-unauthenticated

deploy-function-UserLevelAnswer: # Deploy Go backend function
	gcloud functions deploy UserLevelAnswer --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-http \
--allow-unauthenticated
