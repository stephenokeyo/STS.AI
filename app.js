const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const readline = require('readline');

const API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const DEFAULT_TEMPERATURE = parseFloat(process.env.GEMINI_TEMPERATURE) || 1;
const HISTORY_FILE = 'chat_history.txt';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
const chatSession = model.startChat({ generationConfig: { temperature: DEFAULT_TEMPERATURE } });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function appendHistory(entry) {
  fs.appendFileSync(HISTORY_FILE, `${entry}\n`, 'utf8');
}

async function sendMessage(prompt) {
  try {
    const result = await chatSession.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();
    appendHistory(`User: ${prompt}`);
    appendHistory(`Assistant: ${text}`);
    appendHistory('---');
    console.log('\n=== Gemini Response ===\n');
    console.log(text);
  } catch (error) {
    console.error('Error calling Gemini API:', error.message || error);
  }
}

function askPrompt() {
  rl.question('Enter your prompt for Gemini (type exit to quit): ', async (prompt) => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      console.log('Prompt cannot be empty.');
      askPrompt();
      return;
    }

    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
      console.log('Goodbye. Your chat history is saved in chat_history.txt.');
      rl.close();
      return;
    }

    await sendMessage(trimmed);
    askPrompt();
  });
}

console.log('Starting Gemini multi-turn chat. Your history will be saved to chat_history.txt.');
askPrompt();