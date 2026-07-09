require("dotenv").config();

console.log("IBM_API_KEY:", process.env.IBM_API_KEY ? "Loaded ✅" : "Missing ❌");
console.log("PROJECT_ID:", process.env.IBM_PROJECT_ID);
console.log("URL:", process.env.IBM_GRANITE_URL);

const { generateChatResponse } = require("./services/ibmClient");

async function test() {
  try {
    const response = await generateChatResponse([
      {
        role: "user",
        content: "Hello! Introduce yourself in one sentence."
      }
    ]);

    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err.message);
  }
}

test();