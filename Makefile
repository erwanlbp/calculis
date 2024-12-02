help:
	@echo 'helm to be automatically created ...'

decrypt: # Decrypt config files
	sops -d src/environments/firebase.config.ts.encrypted > src/environments/firebase.config.ts

start: decrypt # Local start the app
	npm run start

build-web: decrypt # Build web app in prod mode
	npm run build

deploy-web-prod: build-web # Build and deploy prod
ifndef ${message}
	$(error --message <version> is required)
endif
	firebase deploy --message ${message}

deploy-web-preprod: build-web # Build and deploy preprod
	firebase hosting:channel:deploy preprod

test-functions: # Run Go tests
	go -C ./functions test ./...

build-functions: # Build the local cmd to test everything compile
	go -C ./functions build -o /dev/null cmd/main.go

deploy-all-functions: # Deploy Go backend functions
	make deploy-function-OnUserDelete 
	make deploy-function-WaitForOpponent
	make deploy-function-UserLevelAnswer
	make deploy-function-GetLevelContent

deploy-function-OnUserDelete: build-functions test-functions # Deploy Go backend function
	gcloud functions deploy OnUserDelete --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-event-filters=type=google.cloud.firestore.document.v1.deleted \
--trigger-event-filters=database='(default)' \
--trigger-location=eur3 \
--trigger-event-filters-path-pattern=document='users/{userID}'

deploy-function-WaitForOpponent: build-functions test-functions # Deploy Go backend function
	gcloud functions deploy WaitForOpponent --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-http \
--allow-unauthenticated

deploy-function-UserLevelAnswer: build-functions test-functions # Deploy Go backend function
	gcloud functions deploy UserLevelAnswer --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-http \
--allow-unauthenticated

deploy-function-GetLevelContent: build-functions test-functions # Deploy Go backend function
	gcloud functions deploy GetLevelContent --region europe-west1 --runtime go123 --gen2 --project calculis \
--source=functions \
--trigger-http \
--allow-unauthenticated
