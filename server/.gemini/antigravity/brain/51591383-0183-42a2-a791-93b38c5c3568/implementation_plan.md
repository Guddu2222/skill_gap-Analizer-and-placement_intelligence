# Multi-turn Conversation Feature Plan

The current application only supports one-off questions; there is no context or history kept between messages. This plan outlines how to upgrade the application to support continuous, multi-turn conversations.

## Proposed Changes

### Backend Updates

#### [MODIFY] [server/index.js](file:///d:/project/AI-Powered%20Local%20Crop%20Advisory%20System/server/index.js)
- Update the `/api/advise` endpoint to accept an optional `history` array in the request body.
- Instead of using `model.generateContent()`, use `model.startChat({ history })` to initialize a chat session if history is provided.
- If there is an image, the Gemini API handles images differently in chat mode. We will need to send the message using `chat.sendMessage([systemInstruction, image])`.
- Ensure the API correctly formats and returns the generated response back to the client.

### Frontend Updates

#### [MODIFY] [client/src/App.jsx](file:///d:/project/AI-Powered%20Local%20Crop%20Advisory%20System/client/src/App.jsx)
- Introduce a new state variable: `messages` (Array) to store the history of the conversation. Each message should have `role` ("user" or "model"), `text` (the prompt/advice), and optionally `image` (the base64 URL for user messages).
- Remove the singular `query` and `advice` state variables, as they are now represented by the `messages` array.
- Update the UI to render a list of messages from the `messages` array instead of just rendering the latest query and advice.
- When `getAdvisory` is called, append the user's message to the `messages` state *before* making the API call.
- Modify the `getAdvisory` payload to include the current `messages` history (formatted for Gemini API: `{ role: "user"|"model", parts: [{ text: "..." }] }`) alongside the new prompt and image.
- Upon receiving a successful response from the backend, append the AI's advice to the `messages` state.
- Handle clearing the `selectedImage` and `imagePreview` state after a message is successfully sent.

## Verification Plan

### Manual Verification
1. Open the web app and ask an initial question (e.g., "I am growing tomatoes").
2. Wait for the response.
3. Ask a follow-up question referencing the first (e.g., "What are common diseases for them?").
4. Verify the AI recommends tomato diseases, proving it has context from the previous message.
5. Upload an image and verify the image is displayed in the chat history bubble and the AI responds correctly to the image.
