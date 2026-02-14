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

async function main(searchText) {
  const userData = await client.getOrCreateCollection({ name: "userData" });

  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: searchText,
  });

  console.log(res.embeddings[0].values);

  const result = await userData.query({
    queryEmbeddings: [res.embeddings[0].values],
    nResults: 4,
  });

  console.log(result);
}

main("what rahul current profession");
