import Groq from "groq-sdk";
import dotenv from "dotenv";
import { tavily } from "@tavily/core";

dotenv.config({
  path: "../.env",
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 2,
});

// ==============================================================================
// --------------------------- WEB SEARCH TOOL ----------------------------------
// ==============================================================================
const client = tavily({
  apiKey: process.env.TAVILY_API_KEY,
});

// WEB SEARCH API FUNCTION
const web_search = async (message) => {
  try {
    const res = await client.search(message, {
      searchDepth: "advanced",
    });

    return res.results.map((result) => result.content).join(" ");
  } catch (error) {
    console.log(error.message);
  }
};

// ==============================================================================
// ------------------------------------------------------------------------------
// ==============================================================================

const tools = [
  {
    type: "function",
    function: {
      name: "web_search",
      description: "Search web",
      parameters: {
        // JSON Schema object
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message that user ask",
          },
        },
        required: ["message"],
      },
    },
  },
];

async function main() {
  const completion1 = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    tools: tools,
    messages: [
      {
        role: "system",
        content: "You are a helpful AI assistant.",
      },
      {
        role: "user",
        content: "when was i phone 17 was launched",
      },
    ],
    tool_choice: "auto",
  });

  const toolsToCall = completion1.choices[0].message.tool_calls;
  const message = completion1.choices[0].message;

  if (!toolsToCall || !toolsToCall?.length) {
    console.log("DIRECT ANSWER:= ", message);
    return;
  }

  for (const tool of toolsToCall) {
    const args = JSON.parse(tool.function.arguments);

    const toolResult = await web_search(args.message);

    const completion2 = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      messages: [
        //   {
        //     role: "system",
        //     content:"give consize results"
        //   },
        {
          role: "user",
          content: "when was i phone 17 was launched",
        },
        message,
        {
          role: "tool",
          tool_call_id: tool.id,
          content: toolResult,
        },
      ],
    });

    console.log("AFTER TOOL ANSWER:= ", completion2.choices[0].message);
  }
}

main();
