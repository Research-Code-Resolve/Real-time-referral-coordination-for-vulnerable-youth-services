import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const CHAT_ENDPOINT = "https://social-worker-chatbot.onrender.com/chat";

function getSessionId() {
  let id = sessionStorage.getItem("chatbotSessionId");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("chatbotSessionId", id);
  }
  return id;
}

export default function ChatWidget({ currentPage = "dashboard" }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I'm here to help you get around the platform. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: getSessionId(),
          message: text,
          current_page: currentPage,
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");
      const reply = await res.json(); // API returns a plain JSON string
      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "Sorry, I couldn't reach the assistant right now." },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-30">
      {open && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col overflow-hidden">
          <div className="bg-deepblue-500 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Assistant</span>
            <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 max-h-80 overflow-y-auto px-4 py-3 space-y-3 bg-slate-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-sage-500 text-white"
                    : "bg-white border border-slate-200 text-slate-700"
                }`}
              >
                {m.text}
              </div>
            ))}
            {sending && (
              <div className="bg-white border border-slate-200 text-slate-400 text-sm rounded-xl px-3 py-2 max-w-[85%]">
                Typing…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-slate-100 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="flex-1 rounded-full border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sage-500 hover:bg-sage-600 disabled:opacity-50 text-white transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-500 hover:bg-sage-600 text-white shadow-lg transition"
        aria-label="Open assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}