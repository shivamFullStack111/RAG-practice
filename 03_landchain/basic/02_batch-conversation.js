import { ChatGroq } from "@langchain/groq";
import dotenv from 'dotenv'
dotenv.config({
  path:"../.env"
})


const model = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY, 
  model: "llama-3.3-70b-versatile",
});

// batch is used when we have to ask multiple questions 
const res = await model.batch(
    [
        "what is the color of sky",
        "why sun always in fire",
    ]
);

res.forEach(data=>{
    console.log(data.content)
})


console.log(res.content)