import { GoogleGenAI } from "@google/genai";
import env from "dotenv";
import { CloudClient } from "chromadb";
import { readFileSync, writeFileSync } from "fs";

env.config({
  path: "../.env",
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API,
});

const client = new CloudClient({
  apiKey: "ck-7b3nAiFuQA6wcNyTcxcx5JrsjNaFxbX9GjekEcaJJZ6Y",
  tenant: "eaa3776a-db41-4d0e-a6da-def192620f3d",
  database: "testing",
});

async function generateEmbeddings() {
  const data = JSON.parse(readFileSync("data.json", "utf-8"));

  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: data,
  });

  let ids = [];
  let documents = [];
  let embeddings = [];

  res.embeddings.forEach((item, index) => {
    ids.push(`id-${index}`);
    documents.push(data[index]);
    embeddings.push(item.values);
  });

  return {
    ids,
    documents,
    embeddings,
  };
}

async function main() {
  const collection = await client.getOrCreateCollection({ name: "userData" });

  const newCollectionData = await generateEmbeddings();

  await collection.add({
    ids: newCollectionData.ids,
    documents: newCollectionData.documents,
    embeddings: newCollectionData.embeddings,
  });
}

main();
