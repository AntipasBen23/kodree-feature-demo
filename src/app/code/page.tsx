"use client";

import { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { Folder, FolderOpen, FileCode, Play, Terminal, CheckCircle2, XCircle, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";

const MOCK_FILES = {
    "src/api/payment-webhook.ts": `import { verifySignature } from "stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // TODO: Fix the unhandled rejection here
  // If verifySignature throws, the server crashes with 500
  const event = verifySignature(body, sig, process.env.STRIPE_WEBHOOK_SECRET);

  if (event.type === "payment_intent.succeeded") {
    await db.payments.updateStatus(event.data.object.id, "success");
  }

  return new Response("OK", { status: 200 });
}`,
    "src/api/payment-webhook.fix.ts": `import { verifySignature } from "stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = verifySignature(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response(\`Webhook Error: \${err.message}\`, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    await db.payments.updateStatus(event.data.object.id, "success");
  }

  return new Response("OK", { status: 200 });
}`,
    "package.json": `{
  "name": "checkout-service",
  "version": "1.0.0",
  "dependencies": {
    "stripe": "^14.0.0",
    "express": "^4.18.2"
  }
}`
};

export default function CodePage() {
    const { state, runTests, addLog } = useSimulation();
    const [selectedFile, setSelectedFile] = useState<string>("src/api/payment-webhook.ts");
    const [isFixed, setIsFixed] = useState(false);

    const currentCode = isFixed && selectedFile === "src/api/payment-webhook.ts"
        ? MOCK_FILES["src/api/payment-webhook.fix.ts"]
        : MOCK_FILES[selectedFile as keyof typeof MOCK_FILES];

    const handleApplyFix = () => {
        setIsFixed(true);
        addLog("Applied manual fix to payment-webhook.ts (Added try/catch block)");
    };

    const handleRunTests = () => {
        runTests(!isFixed);
    };

    return (
        <div className="h-full flex overflow-hidden bg-[#1E1E1E] text-gray-300">
            {/* File Explorer */}
            <div className="w-64 border-r border-[#333333] flex flex-col h-full bg-[#252526] shrink-0">
                <div className="p-3 text-xs font-semibold tracking-wider text-gray-400 uppercase border-b border-[#333333]">
                    Explorer
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pb-4 pt-2">
                    <div className="px-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 text-sm font-medium hover:bg-[#2A2D2E] cursor-pointer text-gray-200 rounded">
                            <FolderOpen className="w-4 h-4 text-blue-400" />
                            checkout-service
                        </div>

                        <div className="pl-4 mt-1 border-l border-[#404040] ml-3">
                            <div className="flex items-center gap-1.5 px-2 py-1 text-sm hover:bg-[#2A2D2E] cursor-pointer rounded">
                                <Folder className="w-4 h-4 text-gray-400" />
                                node_modules
                            </div>

                            <div className="flex items-center gap-1.5 px-2 py-1 text-sm hover:bg-[#2A2D2E] cursor-pointer text-gray-200 mt-0.5 rounded">
                                <FolderOpen className="w-4 h-4 text-blue-400" />
                                src
                            </div>

                            <div className="pl-4 border-l border-[#404040] ml-2 mt-0.5 relative">
                                <div className="flex items-center gap-1.5 px-2 py-1 text-sm hover:bg-[#2A2D2E] cursor-pointer rounded">
                                    <FolderOpen className="w-4 h-4 text-blue-400" />
                                    api
                                </div>
                                <div className="pl-4 border-l border-[#404040] ml-2 mt-0.5">
                                    <div
                                        onClick={() => setSelectedFile("src/api/payment-webhook.ts")}
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-sm group",
                                            selectedFile === "src/api/payment-webhook.ts" ? "bg-[#37373D] text-white" : "hover:bg-[#2A2D2E]"
                                        )}
                                    >
                                        <FileCode className="w-4 h-4 text-blue-400 shrink-0" />
                                        <span className={cn("truncate", isFixed ? "text-amber-300" : "")}>
                                            payment-webhook.ts
                                        </span>
                                        {isFixed && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 shadow-[0_0_5px_rgba(251,191,36,0.5)]"></span>}
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => setSelectedFile("package.json")}
                                className={cn(
                                    "flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer mt-1 rounded",
                                    selectedFile === "package.json" ? "bg-[#37373D] text-white" : "hover:bg-[#2A2D2E]"
                                )}
                            >
                                <FileCode className="w-4 h-4 text-yellow-500 shrink-0" />
                                package.json
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor & Logs Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                {/* Editor Tabs border */}
                <div className="flex items-center bg-[#252526] border-b border-[#333333] shrink-0 h-10 overflow-x-auto custom-scrollbar">
                    <div className="flex items-center gap-2 px-4 h-full border-r border-[#333333] bg-[#1E1E1E] text-gray-300 text-sm border-t-2 border-t-[#007ACC] min-w-[200px] shrink-0">
                        <FileCode className={cn("w-4 h-4", selectedFile.endsWith('.ts') ? "text-blue-400" : "text-yellow-500")} />
                        <span className={isFixed && selectedFile === "src/api/payment-webhook.ts" ? "text-amber-300 italic font-medium" : ""}>
                            {selectedFile.split('/').pop()}
                        </span>
                    </div>

                    <div className="ml-auto flex items-center pr-4 gap-3 shrink-0">
                        {!isFixed && selectedFile === "src/api/payment-webhook.ts" && (
                            <button
                                onClick={handleApplyFix}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 border border-blue-500/30 rounded text-xs font-semibold transition-all hover:scale-105"
                            >
                                <Save className="w-3.5 h-3.5" /> Apply Suggested Fix
                            </button>
                        )}
                        <button
                            onClick={handleRunTests}
                            disabled={state.testStatus === "running"}
                            className={cn(
                                "flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold transition-all shadow-sm",
                                state.testStatus === "running" ? "bg-gray-700/50 text-gray-400 cursor-not-allowed border border-gray-600" :
                                    "bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-500/40 hover:scale-105"
                            )}
                        >
                            {state.testStatus === "running" ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Play className="w-3.5 h-3.5 fill-current" />
                            )}
                            {state.testStatus === "running" ? "Running suite..." : "Run Tests"}
                        </button>
                    </div>
                </div>

                {/* Code Content */}
                <div className="flex-1 overflow-auto bg-[#1E1E1E] font-mono text-[14px] leading-relaxed relative flex flex-col">
                    <div className="flex-1 p-4 pb-20 custom-scrollbar relative">
                        <pre className="text-[#D4D4D4] m-0">
                            <code>
                                {currentCode.split('\n').map((line, i) => {
                                    const highlighted = line
                                        .replace(/verifySignature/g, '<span class="text-[#DCDCAA]">verifySignature</span>')
                                        .replace(/async function|return|const|let|if|catch|try|await/g, '<span class="text-[#C586C0]">$&</span>')
                                        .replace(/"[^"]*"/g, '<span class="text-[#CE9178]">$&</span>')
                                        .replace(/POST/g, '<span class="text-[#DCDCAA]">POST</span>')
                                        .replace(/\/\/.*/g, '<span class="text-[#6A9955]">$&</span>');

                                    return (
                                        <div key={i} className="flex hover:bg-[#2A2D2E]/50 group px-2 rounded-sm">
                                            <span className="w-10 shrink-0 text-right text-[#858585] group-hover:text-gray-400 select-none pr-4 border-r border-[#404040]">
                                                {i + 1}
                                            </span>
                                            <span
                                                className="pl-4 whitespace-pre font-mono"
                                                dangerouslySetInnerHTML={{ __html: highlighted }}
                                            />
                                        </div>
                                    );
                                })}
                            </code>
                        </pre>
                    </div>

                    {/* Overlay when tests are running */}
                    {state.testStatus === "running" && (
                        <div className="absolute inset-0 bg-[#1E1E1E]/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 animate-in fade-in duration-300">
                            <Loader2 className="w-12 h-12 text-[#007ACC] animate-spin mb-6" />
                            <div className="text-xl font-bold text-white mb-2">Executing Test Pipeline</div>
                            <div className="text-sm font-mono text-gray-400 bg-gray-900/50 px-4 py-2 rounded-lg border border-gray-700/50">Running 12 payment and webhook validations...</div>
                        </div>
                    )}
                </div>

                {/* Terminal/Logs Panel */}
                <div className="h-64 border-t border-[#333333] bg-[#1E1E1E] flex flex-col shrink-0">
                    <div className="flex items-center gap-4 px-4 h-10 border-b border-[#333333] text-xs font-semibold tracking-wider text-gray-400 bg-[#252526]">
                        <div className="h-full flex items-center border-b-2 border-[#007ACC] text-[#E7E7E7] px-2 cursor-pointer transition-colors hover:text-white">
                            TERMINAL
                        </div>
                        <div className="h-full flex items-center px-2 cursor-pointer hover:text-[#E7E7E7] transition-colors line-through opacity-50">
                            OUTPUT
                        </div>
                        <div className="h-full flex items-center px-2 cursor-pointer hover:text-[#E7E7E7] transition-colors line-through opacity-50">
                            DEBUG CONSOLE
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 custom-scrollbar">
                        {state.logs.length === 0 && (
                            <div className="text-[#858585] italic flex items-center gap-2">
                                <Terminal className="w-4 h-4 opacity-70" />
                                System initialized. Waiting for test execution.
                            </div>
                        )}

                        {state.logs.map((log, i) => (
                            <div key={i} className="flex gap-2.5 items-start">
                                <Terminal className="w-4 h-4 text-[#858585] shrink-0 mt-0.5 opacity-70" />
                                <span className={cn(
                                    "flex-1 break-words",
                                    log.includes("❌") ? "text-[#F14C4C]" :
                                        log.includes("✅") ? "text-[#89D185]" :
                                            log.includes("fix") ? "text-[#007ACC]" : "text-[#CCCCCC]"
                                )}>
                                    {log}
                                </span>
                            </div>
                        ))}

                        {/* Status Summary */}
                        {state.testStatus === "failure" && (
                            <div className="mt-4 p-4 bg-[#4D0000]/20 border border-[#F14C4C]/30 rounded-lg flex gap-4 text-[#F14C4C] animate-in slide-in-from-bottom-2 duration-300">
                                <XCircle className="w-6 h-6 shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-bold text-lg mb-2">1 failing test</div>
                                    <div className="text-[#CCCCCC] mb-1 font-semibold">Error: UnhandledPromiseRejectionWarning</div>
                                    <div className="text-[#858585] pl-2 border-l-2 border-[#F14C4C]/50 text-xs leading-relaxed">
                                        StripeSignatureVerificationError: No signatures found matching the expected signature for payload.<br />
                                        at process._tickCallback (internal/process/next_tick.js:68:7)<br />
                                        at payment-webhook.ts:9:17
                                    </div>
                                </div>
                            </div>
                        )}

                        {state.testStatus === "success" && (
                            <div className="mt-4 p-4 bg-[#1E4D2B]/20 border border-[#89D185]/30 rounded-lg flex gap-4 text-[#89D185] animate-in slide-in-from-bottom-2 duration-300">
                                <CheckCircle2 className="w-6 h-6 shrink-0 mt-0.5" />
                                <div>
                                    <div className="font-bold text-lg mb-1">✨ Test suite passed successfully! ✨</div>
                                    <div className="text-[#CCCCCC] opacity-80 text-sm">
                                        12 passing (412ms)<br />
                                        All hooks and integrations validated. Ready for deployment.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
