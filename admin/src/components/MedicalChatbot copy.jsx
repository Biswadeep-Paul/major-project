  import { useState, useRef, useEffect } from "react";
  import { GoogleGenerativeAI } from "@google/generative-ai";

  const MedicalChatbot = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const chatWindowRef = useRef(null);

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
        const medicalPrompt = `You are a medical assistant. Answer only medical and medical medicine related questions. If the question is unrelated, politely inform the user that you only handle medical queries. Question: ${inputText}`;
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

    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    };

    return (
      <>
        {/* Responsive chat toggle button */}
        <button
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-primary text-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300 z-50"
          onClick={() => setIsVisible(!isVisible)}
          aria-label="Toggle chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-8 sm:w-8"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Responsive chat window */}
        <div
          className={`fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-80 md:w-96 bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 transition-all duration-300 transform ${
            isVisible
              ? "scale-100 opacity-100"
              : "scale-95 opacity-0 pointer-events-none"
          }`}
          style={{ maxHeight: isVisible ? "90vh" : "0", height: "auto" }}
        >
          {/* Chat header */}
          <div className="bg-primary text-white p-3 sm:p-4 flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
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
              <h2 className="font-bold text-base sm:text-lg">Medical Assistant</h2>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Chat messages area with dynamic height */}
          <div
            ref={chatWindowRef}
            className="flex-1 p-3 sm:p-4 overflow-y-auto bg-gray-50"
            style={{ 
              height: "calc(100% - 130px)", 
              maxHeight: "calc(90vh - 130px)",
              minHeight: "200px"
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 space-y-2 sm:space-y-3 p-3 sm:p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 sm:h-12 sm:w-12 text-blue-400"
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
                <p className="font-medium text-sm sm:text-base">
                  Ask me anything about medical topics
                </p>
                <p className="text-xs sm:text-sm">
                  I'm here to provide medical information and assistance
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs sm:max-w-sm md:max-w-md rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${
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
                        {message.text}
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

          {/* Input area */}
          <div className="p-2 sm:p-3 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about medical topics..."
                className="flex-1 py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent resize-none text-sm min-h-10 max-h-32"
                rows={1}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputText.trim()}
                className={`p-2 rounded-full ${
                  isLoading || !inputText.trim()
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:shadow-md"
                } focus:outline-none transition-all duration-300`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
              Ask only medical-related questions
            </div>
          </div>
        </div>
      </>
    );
  };

  export default MedicalChatbot;