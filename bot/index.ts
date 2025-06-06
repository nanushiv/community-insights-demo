/// bot/index.ts
import ngrok from 'ngrok';
import { BotFrameworkAdapter } from 'botbuilder';
import * as restify from 'restify';
import dotenv from 'dotenv';

dotenv.config(); // ✅ Load .env variables

// Start Bot Server
async function startBotServer() {
  const adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
  });

  const server = restify.createServer();
  server.listen(3978, async () => {
    console.log(`🤖 Bot server listening on http://localhost:3978`);

    try {
      const url = await ngrok.connect({ addr: 3978 });
      console.log(`🔗 Public URL (ngrok): ${url}`);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error("❌ ngrok failed to start:", errMsg);
      process.exit(1);
    }
  });

  // ✅ POST route to receive messages
  server.post('/api/messages', async (req, res) => {
    console.log("📩 Incoming activity received.");
    await adapter.processActivity(req, res, async (context) => {
      console.log("📢 Responding to user...");
      await context.sendActivity("👋 Hello! I'm the Community Insights Bot.");
    });
  });
}

startBotServer();


// // /bot/index.ts
// import ngrok from 'ngrok';
// import { BotFrameworkAdapter, CardFactory, TurnContext } from 'botbuilder';
// import * as restify from 'restify';

// async function startBotServer() {
//   const adapter = new BotFrameworkAdapter({
    
//     appId: process.env.MICROSOFT_APP_ID,
//     appPassword: process.env.MICROSOFT_APP_PASSWORD
//   });

//   const server = restify.createServer();
//   server.listen(3978, async () => {
//     console.log(`🤖 Bot server listening on http://localhost:3978`);

//     try {
//       const url = await ngrok.connect({ addr: 3978 });
//       console.log(`🔗 Public URL (ngrok): ${url}`);
//     } catch (error: unknown) {
//       const errMsg = error instanceof Error ? error.message : String(error);
//       console.error("❌ ngrok failed to start:", errMsg);
//       process.exit(1);
//     }
//   });

//   // 📨 Handle incoming messages
//   server.post('/api/messages', async (req, res) => {
//     console.log("📩 Incoming activity received.");

//     try {
//       await adapter.processActivity(req, res, async (context: TurnContext) => {
//         const { type, text, name, value } = context.activity;

//         console.log("📌 TYPE:", type);
//         console.log("🧠 NAME:", name);
//         console.log("✉️ TEXT:", text);
//         console.log("📦 VALUE:", JSON.stringify(value, null, 2));

//         if (type === 'message' && text && !value) {
//           console.log("📤 Sending Adaptive Card...");

//           const card = CardFactory.adaptiveCard({
//             type: 'AdaptiveCard',
//             $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
//             version: "1.4",
//             body: [
//               {
//                 type: "TextBlock",
//                 text: "📝 We'd love your feedback!",
//                 weight: "Bolder",
//                 size: "Medium"
//               },
//               {
//                 type: "Input.ChoiceSet",
//                 id: "feedback",
//                 style: "expanded",
//                 choices: [
//                   { title: "Great", value: "great" },
//                   { title: "Good", value: "good" },
//                   { title: "Okay", value: "okay" },
//                   { title: "Bad", value: "bad" }
//                 ]
//               }
//             ],
//             actions: [
//               {
//                 type: "Action.Submit",
//                 title: "Submit"
//               }
//             ]
//           });

//           await context.sendActivity({ attachments: [card] });
//         }

//         else if (type === 'message' && value?.feedback) {
//           console.log("✅ Feedback received:", value.feedback);
//           await context.sendActivity(`✅ Thanks for your feedback: ${value.feedback}`);
//         }

//         else {
//           console.log("🤷‍♂️ Unrecognized message structure.");
//           await context.sendActivity("🤷‍♂️ I didn't understand that.");
//         }
//       });
//     } catch (err) {
//       console.error("❌ Error in bot logic:", err);
//       res.send(500, "Internal Bot Error"); // ✅ Restify version
//     }
//   });
// }

// startBotServer();
