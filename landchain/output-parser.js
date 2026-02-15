import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotend from "dotenv";
import { StringOutputParser } from "@langchain/core/output_parsers";
dotend.config({
  path: "../.env",
});

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: process.env.GROQ_API_KEY,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "you are teacher give answer in teacher tone"],
  ["human", "Tell about {topic} in {words} words"],
]);

// pipe chain and output parser
const chain = prompt.pipe(model).pipe(new StringOutputParser()); // StringOutputParser use when we need output in string format

const res = await chain.invoke({
  topic: "ai/ml revolution",
  words: 30,
});

console.log(res);
