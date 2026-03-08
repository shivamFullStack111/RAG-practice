import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API,
  model: "gemini-embedding-001",
});

const dummyData = [
  "My name is shivam",
  "I am 20 years old",
  "I am pursing BCA from lyallpur khalsa college technical campus, jalandhar",
];

const vectorStore = new MemoryVectorStore(embeddings);

const documents = dummyData.map((item) => new Document({ pageContent: item }));

await vectorStore.addDocuments(documents);

console.log(vectorStore.memoryVectors);
