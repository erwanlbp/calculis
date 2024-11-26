help:
	@echo 'helm to be automatically created ...'

decrypt: # Decrypt config files
	sops -d src/environments/firebase.config.ts.encrypted > src/environments/firebase.config.ts

start: # Local start the app
	npm run start

build-web: # Build web app in prod mode
	npm run build

deploy-web-preprod: build-web # Build and deploy preprod
	firebase hosting:channel:deploy preprod

deploy-all-functions: # Deploy Go backend functions
	make deploy-function-OnUserDelete 
	make deploy-function-WaitForOpponent

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
