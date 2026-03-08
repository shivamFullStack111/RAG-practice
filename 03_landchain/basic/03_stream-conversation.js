import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
dotenv.config({
  path: "../.env",
});

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

// stream message 
const res = await model.stream("what is the color of sky");

for await (const chunk of res) {
  console.log(chunk.content);
}

console.log(res.content);
