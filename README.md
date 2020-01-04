# Fast counting with Calculis

## Run on android device
```
ionic cordova prepare android
adb devices # To detect connected device
ionic cordova run android --livereload --debug --device --consolelogs
```

## Deploy web app
```
ionic build && firebase deploy
```
