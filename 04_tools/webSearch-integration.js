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
      description: "search web for information",
      parameters: {
        // JSON Schema object
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "user question",
          },
        },
        required: ["message"],
      },
    },
  },
];

async function main() {
  let messages = [
    {
      role: "system",
      content:
        "You are a helpful AI assistant ",
    },
    {
      role: "user",
      content: "when was i phone 17 was launched",
    },
  ];
  while (true) {
    const completion1 = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      tools: tools,
      messages: messages,
      tool_choice: "auto",
    });

    const toolsToCall = completion1.choices[0].message.tool_calls;
    const message = completion1.choices[0].message;
    messages.push(message);

    if (toolsToCall && toolsToCall?.length) {
      for (const tool of toolsToCall) {
        const args = JSON.parse(tool.function.arguments);

        let toolResult;

        if (tool.function.name == "web_search") {
          toolResult = await web_search(args.message);
          messages.push({
            role: "tool",
            tool_call_id: tool.id,
            content: toolResult,
          });
        }
      }
    } else {
      console.log(" ANSWER:= ", message);
      break;
    }
  }
}

main();
