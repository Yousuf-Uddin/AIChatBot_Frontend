import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/AIChatBot/",
  build: {
    lib: {
      entry: "./src/ChatbotWidget.jsx",
      name: "ChatbotWidget",
      fileName: "chatbot-widget",
      formats: ["umd"], // makes it usable via <script>
    },

  },
});
