require("dotenv").config();

import admin from "firebase-admin";
const serviceAccount: any = {
  type: process.env.FB_K_TYPE,
  project_id: process.env.FB_K_PROJECT_ID,
  private_key_id: process.env.FB_K_PRIVATE_KEY_ID,
  private_key: process.env.FB_K_PRIVATE_KEY,
  client_email: process.env.FB_K_CLIENT_EMAIL,
  client_id: process.env.FB_K_CLIENT_ID,
  auth_uri: process.env.FB_K_AUTH_URI,
  token_uri: process.env.FB_K_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FB_K_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FB_K_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FB_K_UNIVERSE_DOMAIN,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const firebaseApp = admin;
