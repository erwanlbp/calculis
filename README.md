# Fast counting with Calculis

## Setup

- Use `node@lts/iron`

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

# make sure you are building with npm lts/iron
nvm use lts/iron

# build
npm run build

# use npm lts/iron to deploy (firebase needs >=18)
nvm use lts/iron

# deploy in preprod
firebase hosting:channel:deploy preprod

# OR deploy in prod
firebase deploy --message <app_version_number>

# go back to npm lts/iron to develop more
nvm use lts/iron
```

----
----
----

# Base doc

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
