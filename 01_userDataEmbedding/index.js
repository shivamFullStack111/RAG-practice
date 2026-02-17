import { GoogleGenAI } from "@google/genai";
import fs, { readFileSync, writeFileSync } from "fs";
import env from "dotenv";
import path from "path";

env.config({
  path: "../.env",
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API,
});

// use this function when need to convert data to embeddings and store in file after you can search similarity by asking question
async function generateEmbeddingsForData() {
  const data = JSON.parse(readFileSync("data.json", "utf-8"));
  console.log(data);

  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: data,
  });

  const keyData = response.embeddings.map((item, index) => ({
    input: data[index],
    values: item.values,
  }));

  writeFileSync("embeddings.json", JSON.stringify(keyData, null, 2));
}

// generate embedding of user input text that user asked
async function generateEmbeddings(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });
  return response.embeddings[0].values;
}

// find similarity from embedding data json file
function findSimilarity(textEmbedding) {
  let similarities = [];
  const data = JSON.parse(fs.readFileSync("embeddings.json"));

  data.forEach((item, index) => {
    let currentTotal = 0;
    item.values.forEach((item, i) => {
      currentTotal += item * textEmbedding[i];
    });
    similarities.push({
      input: data[index].input,
      similarity: currentTotal,
    });
  });

  return similarities.sort((a, b) => b.similarity - a.similarity);
}

// asking question
const textEmbedding = await generateEmbeddings("what is the age of rahul");

// finding similarities
const similarities = findSimilarity(textEmbedding);
console.log(similarities.slice(0, 3));
