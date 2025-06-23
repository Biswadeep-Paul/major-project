import { useState, useRef, useEffect } from "react";

const MedicalChatbot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [lastIntent, setLastIntent] = useState(null);
  const chatWindowRef = useRef(null);

  // Keyword-based intent mapping
  const intentKeywords = {
    "how to book an appointment": ["book", "appointment", "schedule", "consultation"],
    "where can i find doctors information": ["doctor", "info", "information", "profile"],
    "how do i contact the hospital": ["contact", "call", "email", "phone"],
    "where is the hospital located": ["location", "where", "address"],
    "what are the visiting hours": ["visiting", "hours", "visit time"],
    "what services do you offer": ["services", "departments", "treatment"],
    "do you offer emergency services": ["emergency", "urgent"],
    "do i need to bring any documents": ["documents", "carry", "bring"],
    "can i reschedule my appointment": ["reschedule", "change appointment"],
    "do you accept insurance": ["insurance", "policy", "covered"],
    "how to request a medical certificate": ["medical certificate", "sick note", "request certificate"]
  };

  const responses = {
    "how to book an appointment":
      "You can book an appointment by clicking on the 'All Doctors' section in the menu → Select a doctor → Choose a date and time.",
    "where can i find doctors information":
      "You can find detailed information about our doctors in the 'All Doctors' section.",
    "how do i contact the hospital":
      "You can contact us at +1234567890 or email us at support@hospital.com. More contact details are available on the Contact page.",
    "where is the hospital located":
      "We are located at 123 Health Street, Wellness City. Visit our Contact page for directions.",
    "what are the visiting hours":
      "Our visiting hours are from 10:00 AM to 1:00 PM and 4:00 PM to 7:00 PM every day except Sundays.",
    "what services do you offer":
      "We offer General Medicine, Pediatrics, Surgery, Cardiology, Orthopedics, ENT, Dermatology, and more. Visit our Services page for the full list.",
    "do you offer emergency services":
      "Yes, we offer 24/7 emergency services. In case of emergency, please call our helpline: +1234567899.",
    "do i need to bring any documents":
      "Yes, please bring a valid ID, any previous medical reports, prescriptions, and your insurance card if applicable.",
    "can i reschedule my appointment":
      "Yes, appointments can be rescheduled from your profile under the 'My Appointments' section.",
    "do you accept insurance":
      "Yes, we accept major health insurance providers. You can verify your insurance eligibility at the reception or online in your profile.",
    "how to request a medical certificate":
      "You can request a medical certificate during your consultation. The doctor will issue it if necessary."
  };

  const followUpSuggestions = {
    "how to book an appointment": [
      "Can I cancel an appointment?",
      "What if I miss my appointment?"
    ],
    "what services do you offer": [
      "Do you offer pediatric services?",
      "What are your consultation fees?"
    ],
    "do you accept insurance": [
      "Which providers are covered?",
      "How do I check insurance status?"
    ],
    default: [
      "Can you guide me?",
      "Where do I begin?"
    ]
  };

  const suggestedQuestions = [
    "How to book an appointment?",
    "Where can I find doctors information?",
    "What services do you offer?",
    "How do I contact the hospital?",
    "Where is the hospital located?",
    "What are the visiting hours?",
    "Do you offer emergency services?",
    "Can I reschedule my appointment?",
    "Do you accept insurance?",
    "How to request a medical certificate?"
  ];

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      setMessages([
        { sender: "MedBot", text: "Hi! I'm your medical assistant. Ask me anything!", type: "bot" }
      ]);
    }
  }, [isVisible]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    setHasInteracted(true);
    const userMessage = { sender: "You", text: text, type: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    const lowerInput = text.toLowerCase().replace(/[^\w\s]/gi, "");

    const matchedIntent = Object.keys(intentKeywords).find((intent) =>
      intentKeywords[intent].some((kw) => lowerInput.includes(kw))
    );

    setLastIntent(matchedIntent || "default");

    const botResponse =
      responses[matchedIntent] ||
      "Sorry, I didn't understand that. Please ask about our hospital services.";

    setTimeout(() => {
      const botMessage = { sender: "MedBot", text: botResponse, type: "bot" };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className="fixed bottom-4 right-4 bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all z-30"
        aria-label="Toggle chatbot"
        onClick={() => setIsVisible(!isVisible)}
      >
        💬
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 sm:right-4 left-4 sm:left-auto w-[90vw] sm:w-80 bg-white rounded-lg shadow-lg transition-all z-20 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-white p-3 flex justify-between items-center rounded-t-lg">
          <h2 className="font-bold">Medical Assistant</h2>
          <button onClick={() => setIsVisible(false)} aria-label="Close chat">❌</button>
        </div>

        {/* Message List */}
        <div
          ref={chatWindowRef}
          className="p-3 overflow-y-auto max-h-60 sm:max-h-72 bg-gray-100 space-y-2"
          aria-live="polite"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-1 rounded-lg max-w-xs ${
                message.type === "user"
                  ? "bg-purple-500 text-white self-end ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              <strong>{message.sender}:</strong> {message.text}
            </div>
          ))}
          {isTyping && <p className="text-gray-500 italic">MedBot is typing...</p>}
        </div>

        {/* Quick Questions - Only show before first interaction */}
        {!hasInteracted && (
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
        )}

        {/* Follow-up Suggestions */}
        {lastIntent && followUpSuggestions[lastIntent] && (
          <div className="p-3 border-t">
            <p className="text-sm text-gray-500">You might also ask:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {followUpSuggestions[lastIntent].map((suggestion, index) => (
                <button
                  key={index}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-md hover:bg-gray-200 transition"
                  onClick={() => sendMessage(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-2 border-t flex flex-col sm:flex-row gap-2">
          <input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about our hospital..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={() => sendMessage(inputText)}
            className="bg-primary text-white p-2 rounded-md hover:bg-purple-100 sm:ml-2"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default MedicalChatbot;