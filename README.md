# Millicast React Native Demo

## Dev Setup

Make a copy of [config.example.js](src/config.example.js) and name it
[config.js](src/config.js). This contains the default stream ID and
token to use for the app demo, so that you do not need to enter
them using your touchpad.

Install npm dependencies:

```bash
npm install
```

In one terminal, run the Metro bundler:

```bash
npm start
```

### Android

Install Android studio build tools: https://facebook.github.io/react-native/docs/getting-started#1-install-android-studio

You can run the app through Android Studio. Otherwise in a
separate terminal, run the app launcher:

```bash
make run-android
```

### iOS

Before running on iOS devices, make sure to edit the correct
provisioning profile through Xcode.

You can run the app through Xcode. Otherwise in a separate
terminal, run the app launcher:

```bash
make run-ios
```

## Production Setup

The dev setup above can only run with the host development machine running
at the same network.

Refer to https://facebook.github.io/react-native/docs/signed-apk-android
for deploying app that works without tethering to the development machine.
