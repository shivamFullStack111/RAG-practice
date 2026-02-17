import { ChatGroq } from "@langchain/groq";
import dotenv from 'dotenv'
dotenv.config({
  path:"../.env"
})


const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "llama-3.3-70b-versatile",
});

const res = await model.invoke("What color is the sky? one word answer ");


console.log(res.content)