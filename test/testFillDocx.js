const { threeFillInTemplate } = require("../threeFillInTemplate");

const admin = require("firebase-admin");
const serviceAccount = require("../cloudresume-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "cloudresume-e9e4e.appspot.com",
});

threeFillInTemplate({}, {});
