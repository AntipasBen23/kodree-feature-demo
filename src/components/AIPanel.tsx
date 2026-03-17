"use client";

import { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { MessageSquare, Send, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIPanel() {
    const { state, addAIMessage } = useSimulation();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        addAIMessage({
            persona: "Mentor", // Hack: represent user or internal for now, but UI will show as "You"
            text: input,
        });

        setInput("");

        // Simulate generic AI response to chat
        setTimeout(() => {
            addAIMessage({
                persona: "Mentor",
                text: "I see you're working on the payment issue. Make sure to check the webhook signatures first.",
            });
        }, 1200);
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all z-50 flex items-center justify-center group"
                >
                    <MessageSquare className="w-6 h-6" />
                    {/* Notification dot if there are unread messages */}
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-gray-900 rounded-full animate-pulse"></span>
                </button>
            )}

            {/* AI Panel Chat Window */}
            <div
                className={cn(
                    "fixed bottom-6 right-6 w-[380px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all duration-300 origin-bottom-right",
                    isOpen ? "scale-100 opacity-100 h-[600px]" : "scale-95 opacity-0 h-0 pointer-events-none"
                )}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center justify-between text-white shrink-0 shadow-sm relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white z-20">PM</div>
                            <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white z-10">M</div>
                            <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-gray-800 flex items-center justify-center text-xs font-bold text-white">R</div>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm tracking-wide">Engineering Team</h3>
                            <p className="text-[10px] text-gray-400 font-medium">Mentor, Reviewer, PM</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg">
                            <span className="sr-only">Close menu</span>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50 custom-scrollbar flex flex-col justify-end">
                    {state.aiMessages.length === 0 ? (
                        <div className="text-center text-gray-400 text-sm mt-auto pb-8">
                            No messages yet. Start a task to alert the team.
                        </div>
                    ) : (
                        <div className="space-y-5 flex-1 min-h-min flex justify-end flex-col">
                            {state.aiMessages.map((msg, idx) => {
                                const isUser = msg.text === input; // Simplistic check for demo
                                const isMentor = msg.persona === "Mentor";
                                const isPM = msg.persona === "PM";
                                const isReviewer = msg.persona === "Reviewer";

                                return (
                                    <div key={msg.id} className={cn("flex flex-col animate-in slide-in-from-bottom-2 fade-in duration-300",
                                        isUser ? "items-end" : "items-start"
                                    )}>
                                        {!isUser && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1 ml-1 flex items-center gap-1.5">
                                                <span className={cn(
                                                    "w-1.5 h-1.5 rounded-full inline-block",
                                                    isPM ? "bg-blue-500" : isMentor ? "bg-purple-500" : "bg-amber-500"
                                                )}></span>
                                                {msg.persona}
                                            </span>
                                        )}
                                        <div className={cn(
                                            "px-4 py-2.5 rounded-2xl max-w-[85%] text-sm shadow-sm border",
                                            isUser
                                                ? "bg-blue-600 text-white rounded-br-sm border-transparent"
                                                : "bg-white text-gray-800 rounded-bl-sm border-gray-100"
                                        )}>
                                            {msg.text}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Ask mentor for help or ping reviewer..."
                            className="w-full text-sm placeholder:text-gray-400 border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                        />
                        <button
                            onClick={handleSend}
                            className={cn(
                                "absolute right-2 p-2 rounded-lg transition-colors flex items-center justify-center group",
                                input.trim() ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                            disabled={!input.trim()}
                        >
                            <Send className="w-4 h-4 transition-transform group-hover:scale-110" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
