import React, { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Based on your skills assessment, I recommend focusing on digital marketing. You have strong communication skills and showed interest in social media during your profile setup.",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto my-10 shadow-lg rounded-lg border border-gray-200">
      <div className="bg-[#eaf5ff] p-4 rounded-t-lg flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-full text-white font-bold">💬</div>
        <div>
          <div className="font-semibold text-blue-700">Career Advisor AI</div>
          <div className="text-sm text-gray-600">Your personal guidance assistant</div>
        </div>
      </div>

      <div className="p-4 h-64 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === "bot"
                ? "bg-blue-100 text-blue-800 self-start"
                : "bg-gray-200 text-gray-800 self-end ml-auto"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <input
          type="text"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          style={{
            backgroundColor: 'white',
            color: 'black',
            fontSize: '14px'
          }}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}