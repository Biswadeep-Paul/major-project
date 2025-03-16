import { useState, useRef, useEffect } from "react";

const MedicalChatbot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatWindowRef = useRef(null);

  // Predefined responses
  const responses = {
    "how to book an appointment": 
      "You can book an appointment by clicking on the 'Appointments' section in the menu or by calling our reception at +1234567890.",
      
    "where can i find doctors information": 
      "You can find information about our doctors under the 'Doctors' section in the main menu.",
      
    "what services do you offer": 
      "We offer general checkups, specialist consultations, lab tests, and emergency care. Visit the 'Services' section for more details.",
      
    "how do i contact the hospital": 
      "You can contact us at +1234567890 or email us at support@hospital.com. Our contact page has more details.",
      
    "where is the hospital located": 
      "We are located at 123 Health Street, Wellness City. You can find directions on our 'Contact' page.",
  };

  // Suggested clickable questions
  const suggestedQuestions = [
    "How to book an appointment?",
    "Where can I find doctors information?",
    "What services do you offer?",
    "How do I contact the hospital?",
    "Where is the hospital located?",
  ];

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle user input
  const sendMessage = (text) => {
    if (!text.trim()) return;
  
    const userMessage = { sender: "You", text: text, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);
  
    // Convert text to lowercase and remove punctuation for better matching
    const lowerCaseInput = text.toLowerCase().replace(/[^\w\s]/gi, ""); 
  
    let botResponse = responses[lowerCaseInput] || 
      "Sorry, I didn't understand that. Please ask about our hospital services.";
  
    setTimeout(() => {
      const botMessage = { sender: "MedBot", text: botResponse, type: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800); // Simulate typing delay
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  return (
    <>
      {/* Chatbot Toggle Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
        onClick={() => setIsVisible(!isVisible)}
      >
        💬
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 w-80 bg-white rounded-lg shadow-lg transition-all ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-blue-600 text-white p-3 flex justify-between">
          <h2 className="font-bold">Medical Assistant</h2>
          <button onClick={() => setIsVisible(false)}>❌</button>
        </div>

        {/* Messages */}
        <div ref={chatWindowRef} className="p-3 overflow-y-auto max-h-60 bg-gray-100 space-y-2">
          {messages.length === 0 && (
            <p className="text-gray-500">Ask me anything about our hospital services.</p>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded-lg max-w-xs ${
                message.type === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-white text-gray-800"
              }`}
            >
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}

          {isTyping && <p className="text-gray-500 italic">MedBot is typing...</p>}
        </div>

        {/* Suggested Questions */}
        <div className="p-3">
          <p className="text-sm text-gray-500">Quick Questions:</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-lg hover:bg-gray-300 transition"
                onClick={() => sendMessage(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-2 border-t flex">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about our hospital..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={() => sendMessage(inputText)}
            className="ml-2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default MedicalChatbot1;