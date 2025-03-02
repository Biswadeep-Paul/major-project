import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

const MedicalChatbot = () => {
  const [messages, setMessages] = useState<Array<{sender: string; text: string; type: string}>>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);

  // Initialize Google AI
  const genAI = new GoogleGenerativeAI(
    "AIzaSyCTLJ2cemoCLBBeJGXMEewUq9x0fjtI8JY"
  );
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      sender: "You",
      text: inputText,
      type: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const medicalPrompt = `You are a highly trained medical assistant specializing in    medicine, healthcare, and pharmaceuticals   . Your responses must be:

      🔹    Accurate & Evidence-Based:    Use medical guidelines, clinical research, and pharmaceutical standards.  
      🔹    Precise & To the Point:    Avoid unnecessary details while ensuring clarity.  
      🔹    Structured & Readable:    Use bullet points or short paragraphs for easy understanding.  
      🔹    Scope-Limited:    Answer    ONLY    medical and pharmaceutical-related queries.    Reject unrelated questions politely.     
      
      ---
      
      ###    How to Respond to Different Queries:     
      
         1️⃣ Diseases & Conditions:     
      - Briefly describe    cause, symptoms, diagnosis, and treatment options   .  
      - If applicable, mention    preventive measures   .  
      
         2️⃣ Medications & Drugs (If user asks about a specific medicine):     
      -    Generic & Brand Name     
      -    Purpose & Mechanism of Action    (how it works)  
      -    Dosage & Administration     
      -    Common Side Effects & Warnings     
      -    Drug Interactions & Contraindications    (when not to use)  
      -    Precautions    (pregnancy, liver/kidney conditions, allergies, etc.)  
      
         3️⃣ Diagnostic Tests & Procedures:     
      - Explain    what the test is for, how it’s performed, and how to interpret results   .  
      
         4️⃣ General Healthcare Advice:     
      - Provide    medical recommendations, preventive tips, and lifestyle changes   .  
      
      ---
      
      ###    Important Rules:     
      1️⃣    Only provide factual, well-researched medical and pharmaceutical information.     
      2️⃣    DO NOT give personal medical advice, prescribe medications, or diagnose diseases.     
      3️⃣ If the user needs medical attention,    suggest consulting a healthcare professional.     
      
      ---
      
      ###    User Query:     
      ${inputText}
            
            User Query: ${inputText}`;
      const result = await model.generateContent(medicalPrompt);
      const botResponse = result.response.text();

      const botMessage = {
        sender: "MedBot",
        text: botResponse,
        type: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        sender: "MedBot",
        text: "Sorry, there was an error. Please try again.",
        type: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Chat header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 text-white p-3 sm:p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between px-2 sm:px-4">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="font-bold text-lg sm:text-xl truncate">HealthAssist Medical Chat</h2>
          </div>
          <div className="text-xs sm:text-sm text-blue-100 hidden sm:block">Your AI-powered medical assistant</div>
        </div>
      </div>

      {/* Chat messages area */}
      <div 
        ref={chatWindowRef}
        className="flex-1 w-full max-w-full overflow-y-auto px-2 sm:px-4 py-3 sm:py-4"
      >
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-3 sm:space-y-4 p-2 sm:p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 sm:h-16 sm:w-16 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-medium text-lg sm:text-xl text-blue-600">
                Welcome to HealthAssist
              </h3>
              <p className="text-base sm:text-lg max-w-md">
                Ask me anything about medical topics, medications, conditions, or health advice
              </p>
              
              {/* Responsive grid that stacks on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-2 sm:mt-4 w-full max-w-3xl">
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
                  <h4 className="font-medium text-blue-700 mb-1 sm:mb-2">Medical Conditions</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Information about symptoms, causes, and treatments</p>
                </div>
                
                <div className="bg-teal-50 p-3 sm:p-4 rounded-lg border border-teal-100">
                  <h4 className="font-medium text-teal-700 mb-1 sm:mb-2">Medications</h4>
                  <p className="text-xs sm:text-sm text-gray-600">Details about uses, side effects, and precautions</p>
                </div>
                
                <div className="bg-indigo-50 p-3 sm:p-4 rounded-lg border border-indigo-100 sm:col-span-2 lg:col-span-1">
                  <h4 className="font-medium text-indigo-700 mb-1 sm:mb-2">Health Advice</h4>
                  <p className="text-xs sm:text-sm text-gray-600">General wellness tips and preventive measures</p>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-yellow-600 bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-100 mt-4 sm:mt-6 w-full max-w-2xl">
                <strong>Important:</strong> This tool provides general medical information only and is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
                      message.type === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                    }`}
                  >
                    <div
                      className={`font-medium text-xs sm:text-sm mb-1 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-blue-500"
                      }`}
                    >
                      {message.sender}
                    </div>
                    <div className="whitespace-pre-wrap text-xs sm:text-sm">
                      {message.type === "user" ? (
                        message.text
                      ) : (
                        <ReactMarkdown 
                          className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-blue-600 prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:my-1 prose-a:text-blue-600 prose-strong:text-blue-700 prose-strong:font-semibold prose-li:my-0.5"
                        >
                          {message.text}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none px-3 py-2 sm:px-4 sm:py-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input area - fixed at bottom */}
      <div className="border-t border-gray-200 bg-white p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about medical topics..."
              className="flex-1 py-2 sm:py-3 px-3 sm:px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none text-xs sm:text-sm min-h-10 max-h-32"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputText.trim()}
              className={`p-2 sm:p-3 rounded-full flex-shrink-0 ${
                isLoading || !inputText.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:shadow-md"
              } focus:outline-none transition-all duration-300`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1 sm:mt-2 text-center">
            Ask only medical-related questions • This is not a substitute for professional medical advice
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;