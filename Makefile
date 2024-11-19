decrypt: # Decrypt config files
	sops -d src/environments/firebase.config.ts.encrypted > src/environments/firebase.config.ts

start:
	npm run start
