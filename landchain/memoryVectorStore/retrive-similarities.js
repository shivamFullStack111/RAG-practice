import { VectorStoreRetrieverMemory } from "@langchain/classic/memory";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import dotenv from "dotenv";
import { Document } from "langchain";

dotenv.config({
  path: "../../.env",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GEMINI_API,
  model: "gemini-embedding-001",
});

const vectorStore = new MemoryVectorStore(embeddings);

// ================================================
// -----STORING DUMMY DATA SO WE CAN RETREIVE------
//=================================================
const dummyData = [
  "My name is shivam",
  "I am 20 years old",
  "I am pursing BCA from lyallpur khalsa college technical campus, jalandhar",
];

const documents = dummyData.map((item) => new Document({ pageContent: item }));

await vectorStore.addDocuments(documents);

//=================================================
// ------------------------------------------------
//=================================================

const vectorRetriver = vectorStore.asRetriever({
  k: 1, // number of results
});

const result = await vectorRetriver._getRelevantDocuments("what is your name");

console.log(result);
