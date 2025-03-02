import  { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MedicalChatbot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const chatWindowRef = useRef(null);

  // Initialize Google AI
  const genAI = new GoogleGenerativeAI("AIzaSyCTLJ2cemoCLBBeJGXMEewUq9x0fjtI8JY");
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      sender: 'You',
      text: inputText,
      type: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    try {
      const medicalPrompt = `You are a medical assistant. Answer only medical and medical medicine related questions. If the question is unrelated, politely inform the user that you only handle medical queries. Question: ${inputText}`;
      const result = await model.generateContent(medicalPrompt);
      const botResponse = result.response.text();

      const botMessage = {
        sender: 'Bot',
        text: botResponse,
        type: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: 'Bot',
        text: 'Sorry, there was an error. Please try again.',
        type: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      <button 
        className="fixed bottom-5 right-5 bg-blue-500 text-white rounded-full w-16 h-16 text-2xl shadow-lg hover:bg-blue-600 transition-colors"
        onClick={() => setIsVisible(!isVisible)}
      >
        💬
      </button>

      <div 
        className={`fixed bottom-24 right-5 w-[350px] h-[500px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden z-50 ${
          isVisible ? 'flex' : 'hidden'
        }`}
      >
        <div className="bg-blue-500 text-white p-3 text-center font-bold">
          Medical AI Chatbot
        </div>

        <div 
          ref={chatWindowRef}
          className="flex-1 p-4 overflow-y-auto border-b border-gray-200"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-3 p-2 rounded-xl max-w-[80%] whitespace-pre-wrap clear-both ${
                message.type === 'user'
                  ? 'bg-blue-100 float-right text-right'
                  : 'bg-gray-200 float-left text-left'
              }`}
            >
              <div className="font-bold">{message.sender}:</div>
              <div>{message.text}</div>
            </div>
          ))}
        </div>

        <div className="flex border-t border-gray-200">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about medical topics..."
            className="flex-1 p-3 outline-none"
          />
          <button
            onClick={sendMessage}
            className="px-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default MedicalChatbot;