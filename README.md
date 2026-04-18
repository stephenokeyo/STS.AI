# AI Assistant with Google Gemini API

This project creates a simple AI assistant using the Google Gemini API in Node.js.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set your Gemini API key using an environment variable:

```bash
setx GEMINI_API_KEY "YOUR_NEW_GEMINI_API_KEY"
```

3. (Optional) Set the default Gemini model. The script uses `gemini-2.5-flash` by default:

```bash
setx GEMINI_MODEL "gemini-2.5-flash"
```

4. Set the default temperature (`t`) if desired. The default is `1`:

```bash
setx GEMINI_TEMPERATURE "1"
```

5. Restart your terminal or VS Code after setting the variables.

## Usage

Start the browser chat interface locally:

```bash
npm start
```

Open your browser at:

```bash
http://localhost:3000
```

Then type prompts in the page and submit. Your responses appear in the browser.

## Vercel Deployment

This project can be deployed to Vercel using the `api/chat.js` serverless endpoint.

1. Push your repository to GitHub.
2. In Vercel, create a new project and link `STS.AI`.
3. Set the following environment variable in Vercel project settings:

   - `GEMINI_API_KEY` = your Gemini API key

4. Deploy the project.

The site will serve the static front-end from `public/` and the API from `/api/chat`.

## Notes

- The script uses `GEMINI_API_KEY` from the environment only.
- The assistant now supports multi-turn chat within a single session.
- Saved chats persist in browser localStorage.
- The browser interface now supports image uploads as prompts. Gemini supports additional multimodal features if you expand the script further.
