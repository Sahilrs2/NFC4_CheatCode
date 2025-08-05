import React, { useState } from "react";
import { aiMentorAPI } from "../services/api";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your AI Career Mentor. I'm here to help you with career guidance, skill development advice, and answer any questions you might have about your professional journey. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    
    setIsLoading(true);
    
    try {
      const response = await aiMentorAPI.getResponse(userMessage);
      const aiResponse = response.data.response;
      
      // Add AI response to chat
      setMessages(prev => [...prev, { sender: "bot", text: aiResponse }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Add error message to chat
      setMessages(prev => [...prev, { 
        sender: "bot", 
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 shadow-lg rounded-lg border border-gray-200 min-h-screen flex flex-col justify-center">
      <div className="bg-[#eaf5ff] p-6 rounded-t-lg flex items-center gap-3">
        <div className="bg-blue-600 p-3 rounded-full text-white font-bold text-lg">💬</div>
        <div>
          <div className="font-semibold text-blue-700 text-lg">Career Advisor AI</div>
          <div className="text-base text-gray-600">Your personal guidance assistant</div>
        </div>
      </div>

      <div className="p-6 h-96 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-sm px-5 py-3 rounded-lg text-base ${
              msg.sender === "bot"
                ? "bg-blue-100 text-blue-800 self-start"
                : "bg-gray-200 text-gray-800 self-end ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="max-w-sm px-5 py-3 rounded-lg text-base bg-blue-100 text-blue-800 self-start">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-800"></div>
              <span>AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex p-6 border-t border-gray-200 bg-white rounded-b-lg">
        <input
          type="text"
          className="flex-1 px-4 py-3 border-2 border-black rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontSize: '16px',
            border: '2px solid black'
          }}
          placeholder={isLoading ? "Please wait..." : "Type a message..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={`px-6 py-3 rounded-r-lg transition-colors text-base font-medium ${
            isLoading 
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}