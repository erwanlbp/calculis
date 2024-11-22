help:
	@echo 'helm to be automatically created ...'

decrypt: # Decrypt config files
	sops -d src/environments/firebase.config.ts.encrypted > src/environments/firebase.config.ts

start: # Local start the app
	npm run start

deploy-all-functions: deploy-function-DeleteUserScoresOnUserDelete deploy-function-WaitForOpponent # Deploy Go backend functions

deploy-function-DeleteUserScoresOnUserDelete: # Deploy Go backend function
	gcloud functions deploy DeleteUserScoresOnUserDelete --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-event-filters=type=google.cloud.firestore.document.v1.deleted \
--trigger-event-filters=database='(default)' \
--trigger-location=eur3 \
--trigger-event-filters-path-pattern=document='users/{userID}'

deploy-function-WaitForOpponent: # Deploy Go backend function
	gcloud functions deploy WaitForOpponent --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-http \
--no-allow-unauthenticated
