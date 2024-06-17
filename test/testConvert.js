const admin = require("firebase-admin");
const serviceAccount = require("../cloudresume-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "cloudresume-e9e4e.appspot.com",
});

const { fourConvertDocs } = require("../fourConvertDocs");

fourConvertDocs("output.docx");
