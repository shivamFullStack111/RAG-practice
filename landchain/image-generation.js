import { DallEAPIWrapper } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config({
  path: "../.env",
});

const model = new DallEAPIWrapper({
  apiKey: process.env.OPENAI_API,
  model: "dall-e-3",
  n: 1,
});

const imageUrl = await model.invoke(
  "generate a image in which a dog riding an elephant and elephant flying in sky and mugal empire is visible from sky and dog also have a magical stick in his hand",
);
console.log(imageUrl);
