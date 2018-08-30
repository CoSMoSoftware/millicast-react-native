# Millicast React Native Demo

## Dev Setup

Install Android studio build tools: https://facebook.github.io/react-native/docs/getting-started#1-install-android-studio

Install npm dependencies:

```bash
npm install
```

In one terminal, run the Metro bundler:

```bash
npm start
```

In another terminal, run the app launcher:

```bash
make run-android
```

## Production Setup

The dev setup above can only run with the host development machine running
at the same network.

Refer to https://facebook.github.io/react-native/docs/signed-apk-android
for deploying app that works without tethering to the development machine.
