# Millicast React Native Demo

## Dev Setup

Make a copy of [config.example.js](src/config.example.js) and name it
[config.js](src/config.js). This contains the default stream ID and
token to use for the app demo, so that you do not need to enter
them using your touchpad.

Install npm dependencies:

```bash
yarn
```

Linking is now automatic, but you still have to install the pods required for ios.

```bash
cd ios && pod install && cd ..
```

In one terminal, run the Metro bundler:

```bash
yarn start
```

### Android

Install Android studio build tools: https://facebook.github.io/react-native/docs/getting-started#1-install-android-studio

You can run the app through Android Studio. Otherwise in a
separate terminal, run the app launcher:

```bash
yarn run react-native run-android
```

or

```bash
make run-android
```

### iOS

Before running on iOS devices, make sure to edit the correct
provisioning profile through Xcode.

You can run the app through Xcode. Otherwise in a separate
terminal, run the app launcher:

```bash
yarn run react-native run-ios
```

or

```bash
make run-ios
```

### Advanced commands

You may need to run more advanced commands to target specific devices etc... you can do this using the yarn commands.
Ask for help from the commands and you will receive it.

```bash
yarn run react-native run-android --help
```

```
yarn run react-native run-ios --help
```

## Production Setup

The dev setup above can only run with the host development machine running
at the same network.

Refer to https://facebook.github.io/react-native/docs/signed-apk-android
for deploying app that works without tethering to the development machine.
