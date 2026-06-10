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
  Paperclip,
  ImageIcon,
  Loader2,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  imagePreview?: string;
  annotatedImage?: string; // base64 annotated X-ray from YOLO
  link?: string;
  linkText?: string;
  isError?: boolean;
}

// ---------------------------------------------------------------------------
// Quick actions
// ---------------------------------------------------------------------------
const QUICK_ACTIONS = [
  {
    label: "Book Appointment",
    icon: Calendar,
    keyword: "book appointment",
    color:
      "bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 border-blue-100 dark:border-blue-800/40",
  },
  {
    label: "Scan with AI",
    icon: Activity,
    keyword: "scan teeth",
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

// ---------------------------------------------------------------------------
// Nav deep-link knowledge base
// ---------------------------------------------------------------------------
const NAV_KNOWLEDGE_BASE: Array<{
  keywords: string[];
  link: string;
  linkText: string;
}> = [
    {
      keywords: ["appointment", "book", "schedule", "reserve", "doctor", "dentist", "visit"],
      link: "/doctors-list",
      linkText: "View Doctors List 📅",
    },
    {
      keywords: ["scan", "upload", "xray", "x-ray", "mri", "ct", "dicom", "image", "analysis"],
      link: "/scan/upload",
      linkText: "Upload Scan & Analyze 🧬",
    },
    {
      keywords: ["register", "signup", "sign up", "create account", "account", "profile"],
      link: "/register",
      linkText: "Go to Registration Screen 🔐",
    },
    {
      keywords: ["support", "contact", "phone", "email", "help", "live"],
      link: "/support",
      linkText: "Send Support Message ✉️",
    },
    {
      keywords: ["faq", "questions", "how it works"],
      link: "/faq",
      linkText: "Browse FAQ Center 💡",
    },
    {
      keywords: ["payment", "billing", "insurance", "price", "fee", "cost", "receipt"],
      link: "/support",
      linkText: "Inquire about billing 💳",
    },
  ];

// ---------------------------------------------------------------------------
// Backend base URL
// ---------------------------------------------------------------------------
const API_BASE = "https://0xker-multimodal-chatbot.hf.space";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Parse symptoms from plain text so we can call /api/analyze-symptoms.
 * Simple keyword extraction — extend as needed.
 */
function extractSymptoms(text: string): Record<string, unknown> {
  const q = text.toLowerCase();
  return {
    has_pain: /pain|ache|hurt|sore|throb/.test(q),
    pain_location: q.includes("upper") ? "upper" : q.includes("lower") ? "lower" : "",
    pain_type: q.includes("sharp") ? "sharp" : q.includes("dull") ? "dull" : "",
    pain_intensity: /severe|intense|unbearable/.test(q) ? 8 : /mild|slight/.test(q) ? 3 : 5,
    pain_duration: q.includes("week") ? "1 week" : q.includes("day") ? "1 day" : "",
    pain_triggers: q.includes("cold") ? ["cold"] : q.includes("hot") ? ["hot"] : [],
    has_swelling: /swell|swollen/.test(q),
    swelling_severity: "",
    has_fever: /fever|temperature/.test(q),
    difficulty_opening: /open|jaw/.test(q),
    has_trauma: /trauma|hit|accident|fall/.test(q),
    has_broken_tooth: /broken|crack|chip/.test(q),
    previous_root_canal: /root canal/.test(q),
    last_visit: "",
    recent_extraction: /extract|pull/.test(q),
  };
}

/**
 * Format the symptom analysis result into a readable message.
 */
function formatSymptomResult(result: Record<string, unknown>): string {
  const lines: string[] = ["🦷 **Symptom Analysis**\n"];

  if (result.urgency_level) lines.push(`⚠️ Urgency: ${result.urgency_level}`);
  if (result.risk_score !== undefined) lines.push(`📊 Risk Score: ${result.risk_score}/10`);

  if (Array.isArray(result.possible_conditions) && result.possible_conditions.length) {
    lines.push("\n🔍 Possible Conditions:");
    (result.possible_conditions as string[]).forEach((c) => lines.push(`  • ${c}`));
  }

  if (Array.isArray(result.recommendations) && result.recommendations.length) {
    lines.push("\n💡 Recommendations:");
    (result.recommendations as string[]).forEach((r) => lines.push(`  • ${r}`));
  }

  if (!lines.slice(1).length) {
    lines.push("No specific conditions detected. Please describe your symptoms in more detail.");
  }

  return lines.join("\n");
}

/**
 * Format X-ray detection results into a readable message.
 */
function formatDetectionResult(result: Record<string, unknown>): {
  text: string;
  annotatedImage?: string;
} {
  const lines: string[] = ["🔬 **X-Ray Analysis Complete**\n"];
  let annotatedImage: string | undefined;

  const results = result.results as Array<Record<string, unknown>> | undefined;
  if (!results?.length) {
    return { text: "No detections found in the uploaded image. Please ensure the image is a clear dental X-ray." };
  }

  results.forEach((r, idx) => {
    if (idx > 0) lines.push("");
    lines.push(`📷 Image ${idx + 1}:`);

    const detections = r.detections as Array<Record<string, unknown>> | undefined;
    if (!detections?.length) {
      lines.push("  ✅ No issues detected");
    } else {
      lines.push(`  Found ${detections.length} finding(s):`);
      detections.forEach((d) => {
        const label = d.label || d.class || "Unknown";
        const conf = d.confidence ? ` (${Math.round((d.confidence as number) * 100)}% confidence)` : "";
        lines.push(`  • ${label}${conf}`);
      });
    }

    // Grab the annotated image from the first result
    if (!annotatedImage) {
      annotatedImage =
        (r.annotated_image_b64 as string | undefined) ||
        (r.result_image_b64 as string | undefined);
    }
  });

  if (result.total_detections !== undefined) {
    lines.push(`\n📈 Total findings: ${result.total_detections}`);
  }

  lines.push("\n💬 Would you like a detailed treatment plan based on these findings?");

  return { text: lines.join("\n"), annotatedImage };
}

// ---------------------------------------------------------------------------
// Core API call — routes to the right endpoint based on content
// ---------------------------------------------------------------------------
async function callBackend(
  userText: string,
  imageFile: File | null
): Promise<{ text: string; annotatedImage?: string }> {
  // --- Path 1: Image uploaded → X-ray detection pipeline ---
  if (imageFile) {
    const formData = new FormData();
    formData.append("images", imageFile, imageFile.name);

    const res = await fetch(`${API_BASE}/api/detect-xray`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return formatDetectionResult(data);
  }

  // --- Path 2: Symptom-related text → symptom analysis ---
  const symptomKeywords = /pain|ache|hurt|sore|swell|fever|bleed|sensitive|crack|broken|jaw|tooth/i;
  if (symptomKeywords.test(userText)) {
    const symptoms = extractSymptoms(userText);

    const res = await fetch(`${API_BASE}/api/analyze-symptoms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(symptoms),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as { error?: string }).error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    return { text: formatSymptomResult(data) };
  }

  // --- Path 3: General chat — respond with helpful guidance ---
  const q = userText.toLowerCase();

  if (/scan|upload|x.?ray|detect/.test(q)) {
    return {
      text: "📎 Please attach a dental X-ray image using the paperclip button and I'll analyse it for you right away!",
    };
  }

  if (/book|appointment|schedule|doctor/.test(q)) {
    return { text: "📅 You can book an appointment through our Doctors List. Use the link below to find an available dentist." };
  }

  if (/faq|how|what|why|explain/.test(q)) {
    return {
      text:
        "💡 I can help you with:\n\n• **Symptom Analysis** — describe your pain, swelling, or discomfort\n• **X-ray Scanning** — attach a dental X-ray for AI detection\n• **Booking** — find and book a dentist\n• **Support** — reach our team directly\n\nWhat would you like to do?",
    };
  }

  if (/support|contact|help|emergency/.test(q)) {
    return { text: "🆘 Our support team is available to assist you. Click below to send us a message directly." };
  }

  return {
    text:
      "👋 Hi! I'm your Assnani dental assistant. I can:\n\n• Analyse your **symptoms** (describe your pain or discomfort)\n• Examine your **X-rays** (attach an image)\n• Help you **book** an appointment\n• Answer **dental questions**\n\nHow can I help you today?",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingFilePreview, setPendingFilePreview] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---- Persistence --------------------------------------------------------
  useEffect(() => {
    const saved = localStorage.getItem("assnani_chat_history");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // ignore
      }
    } else {
      setMessages([welcomeMessage()]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const serialisable = messages.map((m) => ({
        ...m,
        imagePreview: undefined,
        annotatedImage: undefined,
      }));
      localStorage.setItem("assnani_chat_history", JSON.stringify(serialisable));
    }
  }, [messages]);

  // ---- Open via custom event ----------------------------------------------
  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 300);
    };
    window.addEventListener("open-chatbot", handleOpen);
    return () => window.removeEventListener("open-chatbot", handleOpen);
  }, []);

  // ---- Auto-scroll --------------------------------------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ---- Helpers ------------------------------------------------------------
  function welcomeMessage(): Message {
    return {
      id: "welcome",
      sender: "bot",
      text: "Hi! Welcome to Assnani. I'm your AI-powered dental assistant — describe your symptoms, or attach a dental X-ray and I'll analyse it for you.",
      timestamp: now(),
    };
  }

  function now() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function findNavLink(text: string): { link: string; linkText: string } | null {
    const q = text.toLowerCase();
    return NAV_KNOWLEDGE_BASE.find((kb) => kb.keywords.some((kw) => q.includes(kw))) ?? null;
  }

  // ---- File selection -----------------------------------------------------
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    const dataUrl = await fileToDataUrl(file);
    setPendingFilePreview(dataUrl);
    e.target.value = "";
  };

  const clearPendingFile = () => {
    setPendingFile(null);
    setPendingFilePreview(null);
  };

  // ---- Send ---------------------------------------------------------------
  const handleSend = async (text: string, overrideFile?: File | null) => {
    const trimmed = text.trim();
    const file = overrideFile !== undefined ? overrideFile : pendingFile;
    if (!trimmed && !file) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: trimmed || (file ? `[Attached: ${file.name}]` : ""),
      timestamp: now(),
      imagePreview: pendingFilePreview ?? undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    clearPendingFile();
    setIsTyping(true);

    try {
      const { text: reply, annotatedImage } = await callBackend(trimmed, file ?? null);

      const nav = findNavLink(trimmed + " " + reply);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: reply,
        timestamp: now(),
        annotatedImage,
        link: nav?.link,
        linkText: nav?.linkText,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Sorry, I couldn't reach the AI engine right now. Please check your connection and try again.",
        timestamp: now(),
        isError: true,
      };
      setMessages((prev) => [...prev, errMsg]);
      console.error("Backend call failed:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Clear your conversation history?")) {
      setMessages([welcomeMessage()]);
      localStorage.removeItem("assnani_chat_history");
    }
  };

  const toggleOpen = () => {
    setIsOpen((v) => !v);
    if (!isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  };

  // -------------------------------------------------------------------------
  return (
    <>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* FAB */}
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

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col bg-(--color-surface) border border-(--color-border) shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 ${isMaximized
              ? "w-[calc(100vw-3rem)] h-[calc(100vh-3rem)] max-w-4xl max-h-[800px]"
              : "w-[380px] h-[580px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]"
            }`}
        >
          {/* Header */}
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
                <p className="text-[10px] text-blue-100">Powered by Assnani AI · multimodal</p>
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
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-950/20">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div className={`flex max-w-[85%] ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}>
                  {msg.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="flex flex-col space-y-1">
                    <div
                      className={`px-3.5 py-2.5 text-sm shadow-sm leading-relaxed ${msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-2xl rounded-tr-none"
                          : msg.isError
                            ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-2xl rounded-tl-none"
                            : "bg-(--color-surface) text-(--color-text) border border-(--color-border) rounded-2xl rounded-tl-none"
                        }`}
                    >
                      {/* User-uploaded image preview */}
                      {msg.imagePreview && (
                        <img
                          src={msg.imagePreview}
                          alt="Uploaded X-ray"
                          className="mb-2 rounded-lg max-h-40 object-contain border border-white/20"
                        />
                      )}

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                      {/* Annotated X-ray returned by YOLO */}
                      {msg.annotatedImage && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">🖼️ Annotated X-ray:</p>
                          <img
                            src={
                              msg.annotatedImage.startsWith("data:")
                                ? msg.annotatedImage
                                : `data:image/png;base64,${msg.annotatedImage}`
                            }
                            alt="Annotated X-ray"
                            className="rounded-lg max-h-48 w-full object-contain border border-(--color-border)"
                          />
                        </div>
                      )}

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
                    </div>
                    <span
                      className={`text-[9px] text-gray-400 px-1 ${msg.sender === "user" ? "text-right" : "text-left ml-8"
                        }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                {/* Quick-action cards below welcome message */}
                {msg.id === "welcome" && messages.length <= 2 && (
                  <div className="grid grid-cols-2 gap-2 mt-4 ml-8">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() => handleSend(action.keyword)}
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

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start max-w-[85%] mr-auto">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400 animate-pulse">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex items-center space-x-1 bg-(--color-surface) border border-(--color-border) px-4 py-3.5 rounded-2xl rounded-tl-none shadow-sm">
                  <span className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2.5 h-2.5 bg-blue-400 dark:bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Pending file preview strip */}
          {pendingFilePreview && (
            <div className="px-3 pt-2 bg-(--color-surface) border-t border-(--color-border) flex items-center space-x-2">
              <div className="relative inline-flex items-center">
                <img
                  src={pendingFilePreview}
                  alt="pending attachment"
                  className="h-12 w-12 object-cover rounded-lg border border-(--color-border)"
                />
                <button
                  onClick={clearPendingFile}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
              <span className="text-xs text-gray-500 truncate max-w-[200px]">{pendingFile?.name}</span>
            </div>
          )}

          {/* Input footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputVal);
            }}
            className="p-3 bg-(--color-surface) border-t border-(--color-border) flex items-center space-x-2"
          >
            {/* Attach button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping}
              title="Attach X-ray or image"
              className="flex items-center justify-center w-9 h-9 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              {pendingFile ? (
                <ImageIcon className="w-4 h-4 text-blue-500" />
              ) : (
                <Paperclip className="w-4 h-4" />
              )}
            </button>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={pendingFile ? "Add a message…" : "Describe symptoms or ask anything…"}
                disabled={isTyping}
                className="w-full pl-3 pr-9 py-2.5 bg-gray-50 dark:bg-gray-900 border border-(--color-border) rounded-xl text-sm text-(--color-text) placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 disabled:opacity-50 transition-all"
              />
              <span className="absolute right-3 top-3 text-[10px] text-gray-400 select-none flex items-center space-x-1 max-sm:hidden">
                <CornerDownLeft className="w-3 h-3 text-gray-300" />
              </span>
            </div>

            <button
              type="submit"
              disabled={(!inputVal.trim() && !pendingFile) || isTyping}
              className="flex items-center justify-center w-10 h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:dark:bg-gray-800/40 disabled:text-gray-400 text-white rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
