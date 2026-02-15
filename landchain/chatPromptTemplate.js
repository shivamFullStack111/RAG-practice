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
  [
    "system",
    "explain topics in english within {words} words give answer in braces",
  ],
  ["human", "tell me about {topic} with example"], // in braces {} topic is variable
]);

const formatPromt = await promt.format({
  topic: "how to choose college",
  words: 30,
});

console.log("FORMATMESSAE: ", formatPromt, "\n \n");

const response = await model.invoke(formatPromt);

console.log("RESPONSE", response.content, "\n \n");
