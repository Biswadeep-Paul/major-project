import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

const MedicalChatbot = () => {
  const [messages, setMessages] = useState<Array<{sender: string; text: string; type: string}>>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [commonConditions] = useState([
    "Diabetes", "Hypertension", "Asthma", "Migraine", 
    "Anxiety", "Depression", "Common Cold", "Flu"
  ]);
  const [commonMedications] = useState([
    "Aspirin", "Ibuprofen", "Acetaminophen", "Lisinopril",
    "Metformin", "Amoxicillin", "Atorvastatin", "Levothyroxine"
  ]);
  const [recentlyUsedQueries, setRecentlyUsedQueries] = useState<string[]>([]);
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

  // Generate suggested queries based on input text
  useEffect(() => {
    if (inputText.trim().length > 2) {
      const lowerInput = inputText.toLowerCase();
      
      // Generate suggestions based on input
      let newSuggestions: string[] = [];
      
      // Check if they might be typing a condition
      if (lowerInput.includes("what is") || lowerInput.includes("about") || lowerInput.includes("symptoms")) {
        newSuggestions = commonConditions
          .filter(condition => condition.toLowerCase().includes(lowerInput) || 
                              `what is ${condition.toLowerCase()}`.includes(lowerInput))
          .map(condition => `What is ${condition} and its symptoms?`);
      }
      
      // Check if they might be typing about a medication
      if (lowerInput.includes("medication") || lowerInput.includes("drug") || lowerInput.includes("medicine") || 
          lowerInput.includes("dose") || lowerInput.includes("side effect")) {
        newSuggestions = [
          ...newSuggestions,
          ...commonMedications
            .filter(med => med.toLowerCase().includes(lowerInput) || 
                          `information about ${med.toLowerCase()}`.includes(lowerInput))
            .map(med => `Information about ${med} (uses, dosage, side effects)`)
        ];
      }
      
      // Limit to 5 suggestions
      setSuggestions(newSuggestions.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [inputText, commonConditions, commonMedications]);

  const sendMessage = async (messageText: string = inputText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      sender: "You",
      text: messageText,
      type: "user",
    };

    // Add to recently used queries if not already present
    if (!recentlyUsedQueries.includes(messageText) && messageText === inputText) {
      setRecentlyUsedQueries(prev => [messageText, ...prev].slice(0, 5));
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setSuggestions([]);
    setIsLoading(true);

    try {
      const medicalPrompt = `You are a highly trained medical assistant specializing in medicine, healthcare, and pharmaceuticals. Your responses must be:

      🔹 Accurate & Evidence-Based: Use medical guidelines, clinical research, and pharmaceutical standards.  
      🔹 Precise & To the Point: Avoid unnecessary details while ensuring clarity.  
      🔹 Structured & Readable: Use bullet points or short paragraphs for easy understanding.  
      🔹 Scope-Limited: Answer ONLY medical and pharmaceutical-related queries. Reject unrelated questions politely.     
      
      ---
      
      ### How to Respond to Different Queries:     
      
      1️⃣ Diseases & Conditions:     
      - Briefly describe cause, symptoms, diagnosis, and treatment options.  
      - If applicable, mention preventive measures.  
      
      2️⃣ Medications & Drugs (If user asks about a specific medicine):     
      - Generic & Brand Name     
      - Purpose & Mechanism of Action (how it works)  
      - Dosage & Administration     
      - Common Side Effects & Warnings     
      - Drug Interactions & Contraindications (when not to use)  
      - Precautions (pregnancy, liver/kidney conditions, allergies, etc.)  
      
      3️⃣ Diagnostic Tests & Procedures:     
      - Explain what the test is for, how it's performed, and how to interpret results.  
      
      4️⃣ General Healthcare Advice:     
      - Provide medical recommendations, preventive tips, and lifestyle changes.  
      
      ---
      
      ### Important Rules:     
      1️⃣ Only provide factual, well-researched medical and pharmaceutical information.     
      2️⃣ DO NOT give personal medical advice, prescribe medications, or diagnose diseases.     
      3️⃣ If the user needs medical attention, suggest consulting a healthcare professional.     
      
      ---
      
      ### User Query:     
      ${messageText}
      
      User Query: ${messageText}`;
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

  // Quick response buttons for categories
  const quickResponseCategories = [
    {
      title: "Common Conditions",
      items: commonConditions,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      textColor: "text-blue-700",
      iconColor: "text-blue-400"
    },
    {
      title: "Popular Medications",
      items: commonMedications,
      bgColor: "bg-teal-50",
      borderColor: "border-teal-100",
      textColor: "text-teal-700",
      iconColor: "text-teal-400"
    },
    {
      title: "General Health",
      items: ["Nutrition advice", "Exercise recommendations", "Sleep hygiene", "Stress management"],
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-100",
      textColor: "text-indigo-700", 
      iconColor: "text-indigo-400"
    }
  ];

  // Handle quick category item selection
  const handleQuickSelection = (item: string, category: string) => {
    let query = "";
    switch (category) {
      case "Common Conditions":
        query = `What is ${item} and what are the symptoms, causes, and treatments?`;
        break;
      case "Popular Medications":
        query = `Information about ${item}: uses, dosage, side effects, and precautions`;
        break;
      case "General Health":
        query = `Provide advice on ${item.toLowerCase()}`;
        break;
      default:
        query = item;
    }
    
    sendMessage(query);
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
            <h2 className="font-bold text-lg sm:text-xl truncate">HealthAssist Medical Chat BETA</h2>
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
              <p className="text-base sm:text-lg max-w-md mb-2">
                Ask me anything about medical topics, medications, conditions, or health advice
              </p>
              
              {/* Quick selection categories */}
              <div className="w-full max-w-3xl">
                {quickResponseCategories.map((category, idx) => (
                  <div key={idx} className={`${category.bgColor} p-3 sm:p-4 rounded-lg border ${category.borderColor} mb-3 sm:mb-4`}>
                    <h4 className={`font-medium ${category.textColor} mb-2`}>{category.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item, itemIdx) => (
                        <button
                          key={itemIdx}
                          onClick={() => handleQuickSelection(item, category.title)}
                          className="bg-white text-xs sm:text-sm text-gray-700 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-xs sm:text-sm text-yellow-600 bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-100 mt-2 sm:mt-4 w-full max-w-2xl">
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
                        <div>
                          <ReactMarkdown 
                            className="prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-blue-600 prose-h1:text-base prose-h2:text-sm prose-h3:text-sm prose-p:my-1 prose-a:text-blue-600 prose-strong:text-blue-700 prose-strong:font-semibold prose-li:my-0.5"
                          >
                            {message.text}
                          </ReactMarkdown>
                          
                          {/* Related questions after bot responses */}
                          {message.type === "bot" && (
                            <div className="mt-3 pt-2 border-t border-gray-100">
                              <div className="text-xs text-blue-500 mb-1.5">Related questions:</div>
                              <div className="flex flex-wrap gap-2">
                                {generateRelatedQuestions(message.text).map((q, i) => (
                                  <button
                                    key={i}
                                    onClick={() => sendMessage(q)}
                                    className="bg-blue-50 text-xs text-blue-700 px-2 py-1 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors"
                                  >
                                    {truncateText(q, 40)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
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

      {/* Input area with suggestions - fixed at bottom */}
      <div className="border-t border-gray-200 bg-white p-2 sm:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Show suggestions if available and input is focused */}
          {suggestions.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(suggestion);
                    sendMessage(suggestion);
                  }}
                  className="bg-blue-50 text-xs sm:text-sm text-blue-700 px-2 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                >
                  {truncateText(suggestion, 40)}
                </button>
              ))}
            </div>
          )}

          {/* Recently used queries */}
          {recentlyUsedQueries.length > 0 && messages.length > 0 && !suggestions.length && (
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Recent queries:</div>
              <div className="flex flex-wrap gap-1.5">
                {recentlyUsedQueries.map((query, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(query)}
                    className="bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
                  >
                    {truncateText(query, 30)}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              onClick={() => sendMessage()}
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

// Helper function to generate related questions based on bot response
const generateRelatedQuestions = (botText: string): string[] => {
  // Simple implementation - in a real app this would be more sophisticated
  const textLower = botText.toLowerCase();
  const relatedQuestions: string[] = [];
  
  // Check for condition mentions and generate follow-up questions
  const commonConditions = ["diabetes", "hypertension", "asthma", "migraine", "anxiety", "depression"];
  commonConditions.forEach(condition => {
    if (textLower.includes(condition)) {
      relatedQuestions.push(`What are the treatments for ${condition}?`);
      relatedQuestions.push(`What are common medications for ${condition}?`);
    }
  });
  
  // Check for medication mentions
  const commonMeds = ["aspirin", "ibuprofen", "acetaminophen", "lisinopril", "metformin"];
  commonMeds.forEach(med => {
    if (textLower.includes(med)) {
      relatedQuestions.push(`What are the side effects of ${med}?`);
      relatedQuestions.push(`Can ${med} interact with other medications?`);
    }
  });
  
  // Add some generic follow-ups if nothing specific was found
  if (relatedQuestions.length < 2) {
    if (textLower.includes("symptom")) {
      relatedQuestions.push("When should I see a doctor about these symptoms?");
    }
    if (textLower.includes("treatment") || textLower.includes("medication")) {
      relatedQuestions.push("Are there any natural remedies for this condition?");
    }
    // Generic fallbacks
    relatedQuestions.push("What preventive measures should I take?");
    relatedQuestions.push("What lifestyle changes are recommended?");
  }
  
  // Return 2-4 unique questions
  return [...new Set(relatedQuestions)].slice(0, 4);
};

// Helper function to truncate text with ellipsis
const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export default MedicalChatbot;