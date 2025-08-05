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
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors text-base font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}