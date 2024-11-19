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

- Start the project

```bash
make start
```

## Run on android device (Don't know what/why/when)

```bash
ionic cordova prepare android
adb devices # To detect connected device
ionic cordova run android --livereload --debug --device --consolelogs
```

## Deploy web app

```bash
ionic build && firebase deploy
```
