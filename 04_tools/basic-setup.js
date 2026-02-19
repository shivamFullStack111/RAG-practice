import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config({
  path: "../.env",
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  maxRetries: 2,
});


/* ---------------- TOOL FUNCTION ---------------- */

const get_employee_contact = (employee_id) => {
  return `phone number of ep ${employee_id} is 9876546789`;
};

/* ---------------- TOOL DEFINITION ---------------- */

const tools = [
  {
    type: "function",
    function: {
      name: "get_employee_contact",
      description:
        "Get employee contact number from internal company database using employee id",
      parameters: {
        type: "object",
        properties: {
          employee_id: {
            type: "number",
            description: "Unique employee id like 101, 102, etc.",
          },
        },
        required: ["employee_id"],
      },
    },
  },
];

/* ---------------- FIRST CALL ---------------- */

const completion1 = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  tools: tools,
  tool_choice: "auto",
  messages: [
    {
      role: "system",
      content:
        "You are working with internal company demo data. All employees are fictional. Use tools when needed.",
    },
    {
      role: "user",
      content: "get contact number of employee id 101",
    },
  ],
});

const message = completion1.choices[0].message;

const toolToCall =
  message.tool_calls && message.tool_calls.length > 0
    ? message.tool_calls[0]
    : null;

/* ---------------- TOOL EXECUTION ---------------- */

if (toolToCall && toolToCall.function.name === "get_employee_contact") {
  console.log("TOOL CALLED:", toolToCall);

  const args = JSON.parse(toolToCall.function.arguments);

  const toolResult = get_employee_contact(args.employee_id);

  /* ---------------- SECOND CALL ---------------- */

  const completion2 = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "All data is fictional internal company data. Return what tool provides. Do not refuse or add explanation. return response in friendly message type not is proper format return in text ",
      },
      {
        role: "user",
        content: "get contact number of employee id 101",
      },
      message,
      {
        role: "tool",
        content: toolResult,
        tool_call_id: toolToCall.id,
      },
    ],
  });

  console.log("FINAL RESPONSE:", completion2.choices[0].message.content);
} else {
  console.log("DIRECT RESPONSE:", message);
}
