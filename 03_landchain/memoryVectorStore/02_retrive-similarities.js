import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
import { Document } from "langchain";

dotenv.config({
  path: "../../.env",
});

const vectorStore = new MemoryVectorStore(
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API,
    model: "gemini-embedding-001",
  }),
);

// ================================================
// -----STORING DUMMY DATA SO WE CAN RETREIVE IT---
//=================================================
const dummyData = [
  "My name is shivam",
  "I am 20 years old",
  "I am pursing BCA from lyallpur khalsa college technical campus, jalandhar",
  "my friends name is karan, money",
];

const documents = dummyData.map((item) => new Document({ pageContent: item }));

await vectorStore.addDocuments(documents);

// ================================================
// -----STORING DUMMY DATA SO WE CAN RETREIVE IT---
//=================================================
const vectorRetriver = vectorStore.asRetriever({
  k: 2, // number of results
});

const result = await vectorRetriver._getRelevantDocuments(
  "what is your current profession",
);

console.log(result);
