const axios = require("axios");

let cachedToken = null;
let expiryTime = 0;

async function getAccessToken() {
  const now = Date.now();

  if (cachedToken && now < expiryTime) {
    return cachedToken;
  }

  const response = await axios.post(
    "https://iam.cloud.ibm.com/identity/token",
    new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: process.env.IBM_API_KEY,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  cachedToken = response.data.access_token;

  // Refresh one minute before expiry
  expiryTime = now + (response.data.expires_in - 60) * 1000;

  return cachedToken;
}

module.exports = {
  getAccessToken,
};