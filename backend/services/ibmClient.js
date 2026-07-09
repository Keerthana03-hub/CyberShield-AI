const axios = require("axios");
const { getAccessToken } = require("./tokenManager");

const IBM_URL = process.env.IBM_GRANITE_URL;
const PROJECT_ID = process.env.IBM_PROJECT_ID;
const MODEL_ID = "ibm/granite-4-h-small";

async function generateChatResponse(messages) {
  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${IBM_URL}/ml/v1/text/chat?version=2023-05-29`,
      {
        model_id: MODEL_ID,
        project_id: PROJECT_ID,
        messages,
        max_tokens: 800,
        temperature: 0.3,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "IBM Granite Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to communicate with IBM Granite.");
  }
}

module.exports = {
  generateChatResponse,
};