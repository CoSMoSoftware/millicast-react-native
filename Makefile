run-android:
	node_modules/.bin/react-native run-android

run-ios:
	node_modules/.bin/react-native run-ios

lint:
	node_modules/.bin/eslint src

.PHONY: lint run-android run-ios
