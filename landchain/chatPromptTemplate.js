import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";

dotenv.config({
  path: "../.env",
});

const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama-3.3-70b-versatile",
});

const promt = ChatPromptTemplate.fromMessages([
  ["system", "explain topics in english within 20 words"],
  ["human", "tell me about {topic} with example"],
]);

const formatPromt = await promt.formatMessages({
  topic: "how to choose college",
});

const response = await model.invoke(formatPromt);

console.log(response.content);
