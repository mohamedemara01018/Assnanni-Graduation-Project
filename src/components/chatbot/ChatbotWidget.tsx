import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  Sparkles,
  Trash2,
  Calendar,
  Activity,
  LifeBuoy,
  HelpCircle,
  CornerDownLeft,
} from "lucide-react";

interface TriageState {
  has_pain: boolean;
  pain_location: string;
  pain_type: string;
  pain_intensity: number;
  pain_duration: string;
  pain_triggers: string[];
  has_swelling: boolean;
  swelling_severity: string;
  has_fever: boolean;
  difficulty_opening: boolean;
  has_trauma: boolean;
  has_broken_tooth: boolean;
  previous_root_canal: boolean;
  last_visit: string;
  recent_extraction: boolean;
  [key: string]: boolean | string | number | string[];
}
// import DentalTriage from "./DentalTriage";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  link?: string;
  linkText?: string;
  options?: string[]; // Add this for button options
}

const QUICK_ACTIONS = [
  {
    label: "Book Appointment",
    icon: Calendar,
    keyword: "book appointment",
    color:
      "bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800/40",
  },
  {
    label: "Symbols Analyses",
    icon: Activity,
    keyword: "Analyse your symptoms",
    color:
      "bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 dark:text-purple-400 border-purple-100 dark:border-purple-800/40",
  },
  {
    label: "FAQs & Info",
    icon: HelpCircle,
    keyword: "faq",
    color:
      "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/40",
  },
  {
    label: "Support Desk",
    icon: LifeBuoy,
    keyword: "support",
    color:
      "bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:hover:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-800/40",
  },
];

const KNOWLEDGE_BASE: Array<{
  keywords: string[];
  answer: string;
  link?: string;
  linkText?: string;
}> = [
  {
    keywords: ["hello", "hi", "hey", "greetings", "anyone there"],
    answer:
      "Hello! I am Assnani's AI Assistant. I am here to help you navigate our dental platform. You can ask me about booking appointments, uploading medical scans for AI analysis, checking pricing, or registering accounts!",
  },
  {
    keywords: [
      "appointment",
      "book",
      "schedule",
      "reserve",
      "doctor",
      "dentist",
      "visit",
    ],
    answer:
      "Booking a dental appointment is easy! Browse our certified doctor list, select a doctor that fits your needs, choose an available time slot, and confirm. Would you like to view our available doctors?",
    link: "/doctors-list",
    linkText: "View Doctors List 📅",
  },
  {
    keywords: [
      "Analyse",
      "symptom",
      "xray",
      "x-ray",
      "mri",
      "ct",
      "dicom",
      "image",
      "analysis",
      "ai model",
    ],
    answer:
      "Assnani uses state-of-the-art AI models to analyze dental X-rays, MRIs, and CT scans in formats like DICOM, JPEG, and PNG. Analyses usually complete within 2-5 minutes with over 90% accuracy. You can upload your scan now:",
    link: "/dental-chatbot",
    linkText: "Upload Scan & Analyze 🧬",
  },
  {
    keywords: [
      "register",
      "signup",
      "sign up",
      "create account",
      "account",
      "profile",
    ],
    answer:
      "You can create an account on Assnani as a Patient, Doctor, Student Doctor, or Receptionist. Make sure to verify your email after signing up. Click below to start registration:",
    link: "/register",
    linkText: "Go to Registration Screen 🔐",
  },
  {
    keywords: ["support", "contact", "phone", "email", "help", "chat", "live"],
    answer:
      "Need direct assistance? You can contact our support team at support@assnani.com or call +1 (555) 123-4567 (Mon-Fri, 9 AM - 6 PM EST). Alternatively, write a message on our support page:",
    link: "/support",
    linkText: "Send Support Message ✉️",
  },
  {
    keywords: ["faq", "questions", "how it works"],
    answer:
      "We have answers for most common questions in our FAQ page. Check it out here:",
    link: "/faq",
    linkText: "Browse FAQ Center 💡",
  },
  {
    keywords: [
      "payment",
      "billing",
      "insurance",
      "price",
      "fee",
      "cost",
      "receipt",
    ],
    answer:
      "We support major credit/debit cards and digital payment options. For patient safety and records transparency, your payments generate automated receipts sent to your email. You can manage bills in your profile details.",
    link: "/support",
    linkText: "Inquire about billing 💳",
  },
];
const TRIAGE_QUESTIONS = [
  {
    id: "has_pain",
    question: "Do you currently have dental pain or discomfort?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "pain_location",
    question: "Where exactly is the pain located?",
    type: "select",
    options: ["Upper Right", "Upper Left", "Lower Right", "Lower Left"],
  },
  {
    id: "pain_type",
    question: "What does the pain feel like?",
    type: "select",
    options: [
      "Throbbing/pulsating",
      "Sharp/piercing",
      "Temperature sensitivity",
      "Dull ache",
    ],
  },
  {
    id: "pain_intensity",
    question: "How intense is it right now? (0–10)",
    type: "range",
    options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  },
  {
    id: "pain_duration",
    question: "How long has this been going on?",
    type: "select",
    options: ["Started today", "1–3 days", "3–7 days", "More than a week"],
  },
  {
    id: "has_swelling",
    question: "Do you notice any visible swelling (gum/face)?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "swelling_severity",
    question: "If yes, how would you describe the swelling?",
    type: "select",
    options: ["Mild", "Moderate", "Severe (asymmetrical face)"],
  },
  {
    id: "has_fever",
    question: "Do you have a fever?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "difficulty_opening",
    question: "Do you have difficulty opening your mouth (trismus)?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "has_trauma",
    question: "Have you had recent maxillofacial trauma?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "has_broken_tooth",
    question: "Do you have a structural fracture or broken tooth?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "previous_root_canal",
    question: "Have you had a prior root canal on the treatment site?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "recent_extraction",
    question: "Is this in a recent extraction socket area?",
    type: "yesno",
    options: ["Yes", "No"],
  },
  {
    id: "last_visit",
    question: "When was your last dental clinic visit?",
    type: "select",
    options: [
      "Less than 6 months ago",
      "6–12 months ago",
      "Over 1 year ago",
      "Never",
    ],
  },
];
const DEFAULT_RESPONSE = {
  answer:
    "I'm not sure I understand that completely. I specialize in dental healthcare and Assnani features. You can try asking about 'booking appointments', 'uploading X-rays', or browse our FAQs:",
  link: "/faq",
  linkText: "Go to FAQ Page 💡",
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [triageState, setTriageState] = useState<TriageState | null>(null);
  const [triageStep, setTriageStep] = useState(0);
  const [isInTriage, setIsInTriage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageIdCounter = useRef(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("assnani_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    } else {
      // First welcome message
      const welcomeMsg: Message = {
        id: "welcome",
        sender: "bot",
        text: "Hi! Welcome to Assnani. I am your smart dental assistant. How can I help you today? Feel free to ask a question or select one of the options below.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([welcomeMsg]);
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("assnani_chat_history", JSON.stringify(messages));
    }
  }, [messages]);

  // Handle open-chatbot custom window event
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    };

    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);
  const submitTriageData = async (data: TriageState) => {
    setIsTyping(true);

    const loadingMsg: Message = {
      id: `${Date.now()}-${messageIdCounter.current++}`,
      sender: "bot",
      text: "Analyzing your symptoms...",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const BACKEND_URL = "https://0xker-multimodal-chatbot.hf.space";
      const response = await fetch(`${BACKEND_URL}/api/analyze-symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMsg.id));

      const botMsg: Message = {
        id: `${Date.now()}-${messageIdCounter.current++}`,
        sender: "bot",
        text: `Analysis Complete!\n\n${result.risk_emoji || "🔴"} Risk Level: ${result.risk_level || "Unknown"}\nScore: ${result.score || "N/A"}\nX-ray Recommended: ${result.xray_recommended ? "Yes" : "No"}\n\n${result.recommendation || "Based on your symptoms, we recommend scheduling an appointment for a thorough evaluation."}\n\n🏠 Home Care Instructions:\n${result.home_care?.map((item: string) => `\n• ${item}`).join("") || "\n• No specific home care instructions provided."}`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        link: "/doctors-list",
        linkText: "View Available Dentists 📅",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Analysis failed:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMsg.id));

      const errorMsg: Message = {
        id: `${Date.now()}-${messageIdCounter.current++}`,
        sender: "bot",
        text: "I apologize, but I encountered an error analyzing your symptoms. Please try again or contact our support team for assistance.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    if (isInTriage && triageState) {
      const userMsg: Message = {
        id: `${Date.now()}-${messageIdCounter.current++}`,
        sender: "user",
        text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputVal("");
      setIsTyping(true);

      const currentQuestion = TRIAGE_QUESTIONS[triageStep];
      const updatedState = { ...triageState };

      // Store the answer based on question type
      if (currentQuestion.type === "yesno") {
        updatedState[currentQuestion.id as keyof TriageState] = text
          .toLowerCase()
          .includes("yes");
      } else if (currentQuestion.type === "number") {
        updatedState[currentQuestion.id as keyof TriageState] =
          parseInt(text) || 0;
      } else {
        updatedState[currentQuestion.id as keyof TriageState] = text;
      }

      setTriageState(updatedState);

      // Move to next question or finish
      if (triageStep < TRIAGE_QUESTIONS.length - 1) {
        const nextStep = triageStep + 1;
        setTriageStep(nextStep);
        const nextQuestion = TRIAGE_QUESTIONS[nextStep];

        setTimeout(() => {
          const botMsg: Message = {
            id: `${Date.now()}-${messageIdCounter.current++}`,
            sender: "bot",
            text: nextQuestion.question,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            options: nextQuestion.options,
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsTyping(false);
        }, 500);
        return;
      } else {
        // All questions answered - submit to API
        setIsInTriage(false);
        submitTriageData(updatedState);
        return;
      }
    } // Add this closing brace

    const userMsg: Message = {
      // eslint-disable-next-line react-hooks/purity
      id: `${Date.now()}-${messageIdCounter.current++}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulated Bot thinking
    setTimeout(() => {
      const normalizedQuery = text.toLowerCase().trim();
      const matched = KNOWLEDGE_BASE.find((kb) =>
        kb.keywords.some((keyword) => normalizedQuery.includes(keyword)),
      );

      const responseText = matched ? matched.answer : DEFAULT_RESPONSE.answer;
      const responseLink = matched ? matched.link : DEFAULT_RESPONSE.link;
      const responseLinkText = matched
        ? matched.linkText
        : DEFAULT_RESPONSE.linkText;

      const botMsg: Message = {
        id: `${Date.now()}-${messageIdCounter.current++}`,
        sender: "bot",
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        link: responseLink,
        linkText: responseLinkText,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const handleClearHistory = () => {
    const welcomeMsg: Message = {
      id: "welcome",
      sender: "bot",
      text: "Hi! Welcome to Assnani. I am your smart dental assistant. How can I help you today? Feel free to ask a question or select one of the options below.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([welcomeMsg]);
    localStorage.removeItem("assnani_chat_history");

    setTriageState(null);
    setTriageStep(0);
    setIsInTriage(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleOpen}
          aria-label="Open support chat"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full shadow-[0_4px_20px_rgba(37,99,235,0.45)] hover:shadow-[0_4px_25px_rgba(37,99,235,0.65)] hover:scale-110 active:scale-95 text-white transition-all duration-300 border border-white/10 group cursor-pointer"
        >
          <Bot className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
          <span className="absolute top-0 right-0 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-gray-900"></span>
          </span>
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed bottom-6  right-6 z-50 flex flex-col bg-(--color-surface) border border-(--color-border) shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${
            isMaximized
              ? "w-[calc(100vw-3rem)] h-[calc(100vh-3rem)] max-w-4xl max-h-[800px]"
              : "w-[380px] max-sm:w-full max-sm:h-full h-[580px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white select-none">
            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-9 h-9 bg-white/10 rounded-full border border-white/10">
                <Bot className="w-5 h-5" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-indigo-600 dark:border-indigo-500"></div>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight flex items-center space-x-1">
                  <span>Assnani Assistant</span>
                  <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                </h4>
                <p className="text-[10px] text-blue-100">
                  Usually replies instantly
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearHistory}
                title="Clear conversation history"
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                title={isMaximized ? "Restore size" : "Maximize chat"}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white max-sm:hidden"
              >
                {isMaximized ? (
                  <Minimize2 className="w-4 h-4" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={toggleOpen}
                title="Close chat"
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/20">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div
                  className={`flex max-w-[85%] ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="flex flex-col space-y-1">
                    <div
                      className={`px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                          : "bg-(--color-surface) text-(--color-text) border border-(--color-border) rounded-2xl rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {msg.link && (
                        <div className="mt-3 pt-2.5 border-t border-(--color-border) dark:border-gray-800 flex justify-end">
                          <Link
                            to={msg.link}
                            onClick={() => {
                              if (window.innerWidth < 640) setIsOpen(false);
                            }}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-medium transition-all"
                          >
                            <span>{msg.linkText || "Navigate"}</span>
                          </Link>
                        </div>
                      )}
                      {msg.options && (
                        <div className="mt-3 pt-2.5 border-t border-(--color-border) dark:border-gray-800 flex flex-wrap gap-2">
                          {msg.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSend(option)}
                              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-400 rounded-lg text-xs font-medium transition-all"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-[9px] text-gray-400 px-1 ${
                        msg.sender === "user" ? "text-right" : "text-left ml-8"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {msg.id === "welcome" && messages.length <= 2 && (
                  <div className="grid grid-cols-2 gap-2 mt-4 ml-8">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => {
                            if (action.label === "Symbols Analyses") {
                              setIsInTriage(true);
                              setTriageStep(0);
                              setTriageState({
                                has_pain: false,
                                pain_location: "",
                                pain_type: "",
                                pain_intensity: 0,
                                pain_duration: "",
                                pain_triggers: [],
                                has_swelling: false,
                                swelling_severity: "",
                                has_fever: false,
                                difficulty_opening: false,
                                has_trauma: false,
                                has_broken_tooth: false,
                                previous_root_canal: false,
                                last_visit: "",
                                recent_extraction: false,
                              });
                              const firstQuestion = TRIAGE_QUESTIONS[0];
                              const botMsg: Message = {
                                id: Date.now().toString(),
                                sender: "bot",
                                text: firstQuestion.question,
                                timestamp: new Date().toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }),
                                options: firstQuestion.options,
                              };
                              setMessages((prev) => [...prev, botMsg]);
                            } else {
                              handleSend(action.keyword);
                            }
                          }}
                          className={`flex items-center space-x-2 p-2.5 border rounded-xl text-left transition-all text-xs font-medium group cursor-pointer ${action.color}`}
                        >
                          <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                          <span>{action.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start max-w-[85%] mr-auto">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center space-x-1 bg-(--color-surface) border border-(--color-border) px-4 py-3.5 rounded-2xl rounded-tl-none shadow-sm">
                  <span
                    className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-3 bg-(--color-surface) border-t border-(--color-border) flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Assnani Assistant..."
                disabled={isTyping}
                className="w-full pl-3 pr-9 py-2.5 bg-gray-50 dark:bg-gray-900 border border-(--color-border) rounded-xl text-sm text-(--color-text) placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 disabled:opacity-50 transition-all"
              />
              <span className="absolute right-3 top-3 text-[10px] text-gray-400 select-none flex items-center space-x-1 max-sm:hidden">
                <CornerDownLeft className="w-3 h-3 text-gray-300" />
              </span>
            </div>
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:dark:bg-gray-800/40 disabled:text-gray-400 text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
