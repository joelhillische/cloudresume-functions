# README

Running a test is a command run from the root

## Export current Firestore database

```
node exportFirestoreData.js
```

## Start the emulator

```
firebase emulators:start --only firestore,storage
```

## Run the tests

```
npm test
```

## Production

In order to deploy to production you will need to run the following

```
firebase deploy --only  functions
```
