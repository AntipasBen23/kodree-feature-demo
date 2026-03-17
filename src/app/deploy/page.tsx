"use client";

import { useState } from "react";
import { useSimulation } from "@/context/SimulationContext";
import { Rocket, Server, Activity, CheckCircle2, XCircle, Loader2, ArrowRightLeft, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DeployPage() {
    const { state, deployToProd } = useSimulation();
    const [environment, setEnvironment] = useState<"staging" | "production">("production");

    const isDeploying = ["building", "testing", "deploying"].includes(state.deploymentStatus);
    const isSuccess = state.deploymentStatus === "success";
    const isFailure = state.deploymentStatus === "failure";

    // Compute the current active step in the deployment process
    const steps = [
        { id: "building", title: "Building project bundle", active: state.deploymentStatus === "building" || state.deploymentStatus === "testing" || state.deploymentStatus === "deploying" || isSuccess || isFailure },
        { id: "testing", title: "Running CI/CD pipeline", active: state.deploymentStatus === "testing" || state.deploymentStatus === "deploying" || isSuccess || isFailure },
        { id: "deploying", title: "Deploying to edge network", active: state.deploymentStatus === "deploying" || isSuccess },
        { id: "success", title: "Live and routing traffic", active: isSuccess },
    ];

    const handleDeploy = () => {
        deployToProd(state.testStatus !== "success");
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Deploy to Environment</h1>
                <p className="text-gray-500">Select target infrastructure and monitor deployment progress.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Configuration & Trigger */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                        <h3 className="font-semibold px-1 text-gray-900">Target Environment</h3>

                        <div className="space-y-3">
                            <label className={cn(
                                "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                environment === "staging" ? "border-blue-500 bg-blue-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                            )}>
                                <input
                                    type="radio"
                                    name="environment"
                                    checked={environment === "staging"}
                                    onChange={() => setEnvironment("staging")}
                                    className="mt-0.5 sr-only"
                                />
                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                                    environment === "staging" ? "border-blue-600 bg-blue-600" : "border-gray-300"
                                )}>
                                    {environment === "staging" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm">Staging</div>
                                    <div className="text-xs text-gray-500 mt-1">Deploy to preview URL for QA testing</div>
                                </div>
                            </label>

                            <label className={cn(
                                "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                                environment === "production" ? "border-purple-500 bg-purple-50/50" : "border-gray-100 bg-white hover:border-gray-200"
                            )}>
                                <input
                                    type="radio"
                                    name="environment"
                                    checked={environment === "production"}
                                    onChange={() => setEnvironment("production")}
                                    className="mt-0.5 sr-only"
                                />
                                <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                                    environment === "production" ? "border-purple-600 bg-purple-600" : "border-gray-300"
                                )}>
                                    {environment === "production" && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                        Production {environment === "production" && <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Selected</span>}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">Live customer environment globally</div>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleDeploy}
                            disabled={isDeploying || isSuccess}
                            className={cn(
                                "w-full py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm relative overflow-hidden group",
                                isDeploying ? "bg-gray-100 text-gray-400 cursor-not-allowed border outline-none" :
                                    isSuccess ? "bg-green-600 text-white cursor-not-allowed" :
                                        "bg-gray-900 hover:bg-black text-white hover:shadow-md hover:scale-[1.02]"
                            )}
                        >
                            {isDeploying ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Deploying Sequence...
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </>
                            ) : isSuccess ? (
                                <><CheckCircle2 className="w-5 h-5" /> Deployed Successfully</>
                            ) : (
                                <><Rocket className="w-5 h-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /> Deploy Now</>
                            )}
                        </button>

                        {state.testStatus !== "success" && !isDeploying && !isFailure && !isSuccess && (
                            <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200/50 flex items-start gap-2">
                                <Activity className="w-4 h-4 shrink-0 mt-0.5" />
                                Warning: You have not successfully run the unit tests in the Code workspace. Deployment will fail in CI.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Deployment Progress Pipeline */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Server className="w-5 h-5 text-gray-400" />
                                Deployment Timeline
                            </h3>

                            <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-500 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm">
                                <Globe className="w-3.5 h-3.5 text-blue-500" />
                                {environment}.kodree.app
                            </div>
                        </div>

                        {/* Stepper overview */}
                        <div className="px-8 py-8 border-b border-gray-100 bg-white flex justify-between relative shrink-0">
                            <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>

                            {steps.map((step, i) => {
                                const isCurrent = state.deploymentStatus === step.id;
                                const isFailed = isFailure && step.id === "testing"; // Simulation fails at CI step
                                const isCompleted = step.active && !isCurrent && !isFailed && state.deploymentStatus !== "idle";

                                return (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full border-[3px] flex items-center justify-center bg-white transition-all duration-300 shadow-sm mb-3 relative overflow-hidden",
                                            isFailed ? "border-red-500 text-red-500 bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.2)]" :
                                                isCompleted ? "border-green-500 bg-green-500 text-white" :
                                                    isCurrent ? "border-transparent text-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]" : "border-gray-200 text-gray-300"
                                        )}>
                                            {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white animate-in zoom-in" /> :
                                                isFailed ? <XCircle className="w-5 h-5 animate-in zoom-in" /> :
                                                    !isCurrent ? <span className="text-sm font-bold">{i + 1}</span> : (
                                                        <div className="w-full h-full border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
                                                    )}
                                        </div>

                                        <span className={cn(
                                            "text-xs font-bold uppercase tracking-wider text-center max-w-[90px]",
                                            isFailed ? "text-red-600" :
                                                isCompleted ? "text-gray-900" :
                                                    isCurrent ? "text-blue-600" : "text-gray-400"
                                        )}>
                                            {step.id}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Terminal logs Output */}
                        <div className="flex-1 bg-[#1E1E1E] p-6 overflow-y-auto font-mono text-sm custom-scrollbar relative">
                            {state.deploymentStatus === "idle" ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-3">
                                    <ArrowRightLeft className="w-10 h-10 opacity-30 text-gray-400" />
                                    <p>Ready to deploy. Awaiting execution.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-[#007ACC] font-bold mb-6 flex items-center gap-2 bg-[#252526] px-4 py-2 rounded border border-[#333333] w-max">
                                        <Rocket className="w-4 h-4" /> INITIATING DEPLOYMENT SEQUENCE...
                                    </div>

                                    {state.logs.map((log, idx) => {
                                        const isBuildStatus = log.includes("Building") || log.includes("CI verification") || log.includes("Deploying") || log.includes("✅") || log.includes("❌");
                                        if (!isBuildStatus) return null;

                                        return (
                                            <div
                                                key={idx}
                                                className="animate-in slide-in-from-left-2 fade-in duration-300 flex items-start gap-3"
                                            >
                                                <span className="text-[#858585] mt-0.5 shrink-0">
                                                    [{new Date().toLocaleTimeString().split(' ')[0]}]
                                                </span>
                                                <span className={cn(
                                                    "break-words font-medium",
                                                    log.includes("❌") ? "text-[#F14C4C]" :
                                                        log.includes("✅") ? "text-[#89D185]" :
                                                            log.includes("Deploying") ? "text-[#C586C0]" :
                                                                "text-[#D4D4D4]"
                                                )}>{log}</span>
                                            </div>
                                        );
                                    })}

                                    {isDeploying && (
                                        <div className="flex items-center gap-3 text-[#007ACC] mt-8 animate-pulse bg-[#007ACC]/10 px-4 py-2 rounded border border-[#007ACC]/30 w-max">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Executing Pipeline Step...
                                        </div>
                                    )}

                                    {isFailure && (
                                        <div className="mt-8 border-l-4 border-[#F14C4C] bg-[#F14C4C]/10 rounded-r-lg p-5 text-[#F14C4C] text-sm shadow-sm animate-in slide-in-from-bottom-2">
                                            <div className="font-bold text-base mb-2 flex items-center gap-2">
                                                <XCircle className="w-5 h-5" /> CRITICAL DEPLOYMENT FAILURE
                                            </div>
                                            The CI/CD pipeline aborted the deployment because unit tests failed.<br />
                                            <span className="text-[#CCCCCC] mt-2 inline-block">Review the Code workspace, apply the missing fix, pass the tests, and try deploying again.</span>
                                        </div>
                                    )}

                                    {isSuccess && (
                                        <div className="mt-8 border-l-4 border-[#89D185] bg-[#89D185]/10 rounded-r-lg p-5 text-[#89D185] text-sm shadow-sm animate-in zoom-in-95 duration-500">
                                            <div className="font-bold text-base mb-2 flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" /> DEPLOYMENT SUCCESSFUL
                                            </div>
                                            <span className="text-[#CCCCCC]">Traffic is now routed to the new version across all edge nodes. The active mission is considered complete.</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
