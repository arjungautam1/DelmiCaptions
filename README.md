# Modern AI Chat App with Caption Generation

A beautiful, modern chat application powered by Groq API with specialized caption generation features for Delmi Training Institute.

## Features

### 🤖 AI Chat Interface
- Modern, responsive chat interface
- Real-time message streaming
- File upload support (images, PDFs, text files)
- Drag & drop functionality
- Message status indicators
- Conversation history

### ✨ Caption Generation
- AI-powered caption generation
- Multiple style options (Professional, Casual, Creative)
- Image context support
- Copy to clipboard functionality
- Favorite captions
- Delmi Training Institute branding

### 🎨 Modern UI/UX
- Glassmorphism design effects
- Smooth animations with Framer Motion
- Responsive design
- Dark theme with colorful accents
- Interactive hover effects
- Loading states and micro-interactions

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks + Zustand
- **API**: Groq API for AI responses
- **File Handling**: Native File API

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Groq API Key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd captions-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Groq API key:
```bash
echo "REACT_APP_GROQ_API_KEY=your_groq_api_key_here" > .env
```

4. Replace `your_groq_api_key_here` with your actual Groq API key from https://console.groq.com/keys

5. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:3000`.

## Configuration

### Groq API Setup

1. Visit [Groq Console](https://console.groq.com/keys)
2. Create an account or sign in
3. Generate a new API key
4. Add the key to your `.env` file

### Supported Models
- `deepseek-r1-distill-llama-70b` (default)
- `mixtral-8x7b-32768`
- `llama3-8b-8192`
- `gemma-7b-it`

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm test`
Launches the test runner in interactive watch mode

### `npm run build`
Builds the app for production to the `build` folder

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── ChatInterface.tsx
│   │   ├── MessageBubble.tsx
│   │   └── InputArea.tsx
│   ├── CaptionGenerator/
│   │   └── CaptionGenerator.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Modal.tsx
│       └── LoadingSpinner.tsx
├── services/
│   └── groqApi.ts
├── hooks/
│   └── useChat.ts
├── types/
│   └── chat.ts
└── App.tsx
```

## Usage

### Chat Interface
1. Type your message in the input area
2. Upload files by clicking the attachment button or drag & drop
3. Press Enter to send (Shift+Enter for new line)
4. View AI responses with typing indicators

### Caption Generation
1. Switch to the "Captions" tab
2. Upload an image for visual context (optional)
3. Describe your content in the text area
4. Select a style (Professional, Casual, or Creative)
5. Click "Generate Captions"
6. Copy your favorite captions to clipboard

## File Upload Support

### Images
- Formats: JPG, PNG, GIF, WebP
- Used for visual analysis and context
- Automatic preview generation

### PDFs
- Text extraction for content analysis
- Multi-page support
- Size limits apply

### Text Files
- Formats: .txt, .md, .csv
- Content is processed and analyzed
- Syntax highlighting for code files

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
# DelmiCaptions
