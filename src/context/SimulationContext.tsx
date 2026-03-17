"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// --- Types ---
export type TaskStatus = "Todo" | "In Progress" | "Review" | "Done";
export type TaskPriority = "High" | "Medium" | "Low";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    acceptanceCriteria: string[];
}

export type AIPersona = "Mentor" | "Reviewer" | "PM";

export interface AIMessage {
    id: string;
    persona: AIPersona;
    text: string;
    timestamp: string;
    taskId?: string;
}

export interface SimulationState {
    activeMission: {
        title: string;
        description: string;
        progress: number;
        totalTasks: number;
    };
    tasks: Task[];
    aiMessages: AIMessage[];
    logs: string[];
    testStatus: "idle" | "running" | "success" | "failure";
    deploymentStatus: "idle" | "building" | "testing" | "deploying" | "success" | "failure";
}

interface SimulationContextType {
    state: SimulationState;
    updateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
    addAIMessage: (message: Omit<AIMessage, "id" | "timestamp">) => void;
    addLog: (log: string) => void;
    runTests: (willFail?: boolean) => Promise<void>;
    deployToProd: (willFail?: boolean) => Promise<void>;
}

// --- Mock Data ---
const initialTasks: Task[] = [
    {
        id: "TASK-1",
        title: "Identify payment failure cause",
        description: "Investigate why 15% of Stripe webhooks are failing with 500 errors. Check the logs in the `payment-webhook.ts` file.",
        status: "Todo",
        priority: "High",
        acceptanceCriteria: ["Locate the exact line causing the crash", "Explain the issue in a comment"],
    },
    {
        id: "TASK-2",
        title: "Implement fallback mechanism",
        description: "If Webhook signature verification fails, log it and return 400 instead of crashing the server.",
        status: "Todo",
        priority: "Medium",
        acceptanceCriteria: ["Add try/catch block", "Return proper HTTP status codes"],
    },
];

const initialState: SimulationState = {
    activeMission: {
        title: "Fix Payment Failures in Checkout Service",
        description: "A recent deployment introduced a bug in the webhook handler causing unhandled promise rejections.",
        progress: 0,
        totalTasks: 2,
    },
    tasks: initialTasks,
    aiMessages: [
        {
            id: "msg-1",
            persona: "PM",
            text: "Hey team, we're seeing a spike in failed payments. This is P0. Please investigate ASAP.",
            timestamp: new Date().toISOString(),
        },
        {
            id: "msg-2",
            persona: "Mentor",
            text: "I'd start by looking at the `src/api/payment-webhook.ts` file. Let me know what you find.",
            timestamp: new Date().toISOString(),
        }
    ],
    logs: [],
    testStatus: "idle",
    deploymentStatus: "idle",
};

// --- Context ---
const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<SimulationState>(initialState);

    const updateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
        setState((prev) => {
            const updatedTasks = prev.tasks.map((t) =>
                t.id === taskId ? { ...t, status: newStatus } : t
            );
            const completed = updatedTasks.filter((t) => t.status === "Done").length;
            return {
                ...prev,
                tasks: updatedTasks,
                activeMission: {
                    ...prev.activeMission,
                    progress: completed,
                },
            };
        });
    };

    const addAIMessage = (message: Omit<AIMessage, "id" | "timestamp">) => {
        setState((prev) => ({
            ...prev,
            aiMessages: [
                ...prev.aiMessages,
                {
                    ...message,
                    id: `msg-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                },
            ],
        }));
    };

    const addLog = (log: string) => {
        setState((prev) => ({
            ...prev,
            logs: [...prev.logs, `[${new Date().toLocaleTimeString()}] ${log}`],
        }));
    };

    const runTests = async (willFail = false) => {
        setState((prev) => ({ ...prev, testStatus: "running" }));
        addLog("Starting test suite...");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (willFail) {
            addLog("❌ Test failed: Unhandled rejection in payment webhook.");
            setState((prev) => ({ ...prev, testStatus: "failure" }));
        } else {
            addLog("✅ All 12 payment tests passed.");
            setState((prev) => ({ ...prev, testStatus: "success" }));
        }
    };

    const deployToProd = async (willFail = false) => {
        setState((prev) => ({ ...prev, deploymentStatus: "building" }));
        addLog("Building complete bundle...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setState((prev) => ({ ...prev, deploymentStatus: "testing" }));
        addLog("Running CI verification...");
        await new Promise((resolve) => setTimeout(resolve, 1500));

        if (willFail) {
            setState((prev) => ({ ...prev, deploymentStatus: "failure" }));
            addLog("❌ CI failed. Deployment aborted.");
            return;
        }

        setState((prev) => ({ ...prev, deploymentStatus: "deploying" }));
        addLog("Deploying to remote edge nodes...");
        await new Promise((resolve) => setTimeout(resolve, 2000));

        setState((prev) => ({ ...prev, deploymentStatus: "success" }));
        addLog("✅ Deployment successful. Version is live across 4 regions.");
    };

    return (
        <SimulationContext.Provider
            value={{
                state,
                updateTaskStatus,
                addAIMessage,
                addLog,
                runTests,
                deployToProd,
            }}
        >
            {children}
        </SimulationContext.Provider>
    );
}

export function useSimulation() {
    const context = useContext(SimulationContext);
    if (context === undefined) {
        throw new Error("useSimulation must be used within a SimulationProvider");
    }
    return context;
}
