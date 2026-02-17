import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import dotenv from "dotenv";

dotenv.config({
  path: "../../.env",
});

const vectorStore = new MemoryVectorStore(
  new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API,
    model: "gemini-embedding-001",
  }),
);

const dummyData = [
  "My name is shivam",
  "I am 20 years old",
  "I am pursing BCA from lyallpur khalsa college technical campus, jalandhar",
];

const documents = dummyData.map(
  (item, index) => new Document({ pageContent: item, id: `id-${index}` }),
);

await vectorStore.addDocuments(documents);

// ======================================================================
// --------------------- DELETING DOCUMENT ------------------------------
// ======================================================================
vectorStore.memoryVectors = vectorStore.memoryVectors.filter(
  (item) => item.id !== "id-0",
);

// ======================================================================
// ------------------- UPDATING DOCUMENT --------------------------------
// ======================================================================

// step 1:- remove document you want to update
vectorStore.memoryVectors = vectorStore.memoryVectors.filter(
  (item) => item.content !== "I am 20 years old",
);

// step 2:- Add document
const newDoc = new Document({
  pageContent: "I am 45 years old",
  id: "id-1",
});

await vectorStore.addDocuments([newDoc]);

console.log(vectorStore.memoryVectors); // to check all existing data in vector store
