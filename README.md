# Fast counting with Calculis

## Setup

- Use `node@lts/gallium`

- Set calculis gcloud project

```bash
gcloud auth login
gcloud config set project calculis
```

- Install sops

```bash
brew install sops
```

- Decrypt config files

```bash
make decrypt
```

- Install firebase cli

> ℹ️ Use npm version >= 18
> (use nvm !)

```bash
npm install -g firebase-tools
```

- Start the project

```bash
make start
```

## Add a new Cloud function

Cloud Functions are first registered in [functions/init.go](./functions/init.go) then, depending on the trigger, the code is in [triggercloudevent](./functions/pkg/triggercloudevent/) or [triggerhttp](./functions/pkg/triggerhttp/) packages.

### Triggered by Firestore change

See function [DeleteUserScoresOnUserDelete](./functions/pkg/triggercloudevent/delete_score_events.go) for an example on functions triggered by a change Firestore.

### Triggered by HTTP call

See function [WaitForOpponent](./functions/pkg/triggerhttp/wait_for_opponent.go) for an example on functions triggered by an HTTP call.

## Run on android device (Don't know what/why/when)

```bash
ionic cordova prepare android
adb devices # To detect connected device
ionic cordova run android --livereload --debug --device --consolelogs
```

## Deploy web app

```bash
# ⚠️ Update the app version in package.json !

# make sure you are building with npm lts/gallium
nvm use lts/gallium

# build
npm run build

# use npm lts/iron to deploy (firebase needs >=18)
nvm use lts/iron

# deploy
firebase deploy --message <app_version_number>

# go back to npm lts/gallium to develop more
nvm use lts/gallium
```
