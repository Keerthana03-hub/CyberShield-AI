const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/health";

export async function analyzeFraud(content) {
  const response = await fetch(`${API_BASE_URL}/fraud/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Analysis failed");
  }

  return data.data;
}

export async function sendChat(message) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Chat failed");
  }

  return data.data;
}