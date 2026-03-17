"use client";

import { useState } from "react";
import { useSimulation, Task, TaskStatus } from "@/context/SimulationContext";
import { CheckCircle2, Clock, Circle, ArrowRight, AlertCircle, PlayCircle, GitPullRequest } from "lucide-react";
import { cn } from "@/lib/utils";

const statusColors = {
    "Todo": "bg-gray-100 text-gray-700 border-gray-200",
    "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
    "Review": "bg-purple-100 text-purple-700 border-purple-200",
    "Done": "bg-green-100 text-green-700 border-green-200"
};

const statusIcons = {
    "Todo": Circle,
    "In Progress": PlayCircle,
    "Review": GitPullRequest,
    "Done": CheckCircle2
};

export default function TasksPage() {
    const { state, updateTaskStatus, addAIMessage } = useSimulation();
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(state.tasks[0]?.id || null);

    const selectedTask = state.tasks.find((t) => t.id === selectedTaskId);

    const handleStatusChange = (newStatus: TaskStatus) => {
        if (!selectedTask) return;

        updateTaskStatus(selectedTask.id, newStatus);

        // Simulate AI system responses to status changes
        if (newStatus === "In Progress") {
            setTimeout(() => {
                addAIMessage({
                    persona: "PM",
                    text: `Awesome, seeing you picked up ${selectedTask.id}. Let me know if you need any context!`,
                    taskId: selectedTask.id
                });
            }, 1500);
        } else if (newStatus === "Review") {
            setTimeout(() => {
                addAIMessage({
                    persona: "Reviewer",
                    text: `I'll take a look at the PR for ${selectedTask.id} shortly. Make sure all edge cases are tested.`,
                    taskId: selectedTask.id
                });
            }, 2000);
        } else if (newStatus === "Done") {
            setTimeout(() => {
                addAIMessage({
                    persona: "Mentor",
                    text: `Great job wrapping up ${selectedTask.id}! The fix looks solid.`,
                    taskId: selectedTask.id
                });
            }, 1000);
        }
    };

    return (
        <div className="h-full flex overflow-hidden">
            {/* Task List Sidebar */}
            <div className="w-1/3 border-r border-gray-200 bg-white flex flex-col h-full overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="font-bold text-gray-900 border-b-2 border-blue-600 inline-block pb-1">All Tasks</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {state.tasks.map((task) => {
                        const Icon = statusIcons[task.status];
                        const isSelected = selectedTaskId === task.id;

                        return (
                            <button
                                key={task.id}
                                onClick={() => setSelectedTaskId(task.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-all duration-200",
                                    isSelected
                                        ? "border-blue-300 bg-blue-50 shadow-sm"
                                        : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs font-semibold text-gray-500">{task.id}</span>
                                    <span className={cn(
                                        "text-[10px] uppercase font-bold px-2 py-0.5 rounded border",
                                        statusColors[task.status]
                                    )}>
                                        {task.status}
                                    </span>
                                </div>
                                <h3 className={cn(
                                    "text-sm font-medium line-clamp-2",
                                    task.status === "Done" ? "text-gray-500 line-through" : "text-gray-900"
                                )}>
                                    {task.title}
                                </h3>
                                <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                                    <Icon className={cn(
                                        "w-3.5 h-3.5",
                                        task.status === "Done" ? "text-green-500" :
                                            task.status === "In Progress" ? "text-blue-500" :
                                                task.status === "Review" ? "text-purple-500" : "text-gray-400"
                                    )} />
                                    {task.priority} Priority
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Task Detail Panel */}
            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar">
                {selectedTask ? (
                    <div className="p-8 max-w-3xl mx-auto">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 text-sm font-mono font-bold rounded">
                                {selectedTask.id}
                            </span>
                            <span className={cn(
                                "text-xs uppercase font-bold px-2.5 py-1 rounded border",
                                statusColors[selectedTask.status]
                            )}>
                                {selectedTask.status}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedTask.title}</h1>

                        <div className="prose prose-sm max-w-none mb-8 text-gray-600">
                            <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2 mb-3">
                                <AlertCircle className="w-5 h-5 text-gray-400" />
                                Description
                            </h3>
                            <p className="leading-relaxed bg-gray-50 p-4 rounded-lg border border-gray-100 whitespace-pre-wrap">
                                {selectedTask.description}
                            </p>
                        </div>

                        <div className="mb-10">
                            <h3 className="text-gray-900 font-semibold text-lg flex items-center gap-2 mb-4">
                                <CheckCircle2 className="w-5 h-5 text-gray-400" />
                                Acceptance Criteria
                            </h3>
                            <ul className="space-y-3">
                                {selectedTask.acceptanceCriteria.map((criteria, idx) => (
                                    <li key={idx} className="flex items-start gap-3 bg-white p-3 border border-gray-100 rounded-lg shadow-sm">
                                        <div className="mt-0.5 w-5 h-5 rounded border-2 border-gray-200 flex items-center justify-center bg-gray-50 text-transparent hover:border-blue-400 transition-colors cursor-pointer">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-gray-700">{criteria}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Status Actions */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Update Status</h3>
                            <div className="flex flex-wrap gap-3">
                                {selectedTask.status === "Todo" && (
                                    <button onClick={() => handleStatusChange("In Progress")} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                                        <PlayCircle className="w-4 h-4" /> Start Working
                                    </button>
                                )}
                                {selectedTask.status === "In Progress" && (
                                    <button onClick={() => handleStatusChange("Review")} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                                        <GitPullRequest className="w-4 h-4" /> Request Review
                                    </button>
                                )}
                                {selectedTask.status === "Review" && (
                                    <button onClick={() => handleStatusChange("Done")} className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm">
                                        <CheckCircle2 className="w-4 h-4" /> Ship It
                                    </button>
                                )}
                                {(selectedTask.status === "In Progress" || selectedTask.status === "Review") && (
                                    <button onClick={() => handleStatusChange("Todo")} className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors">
                                        Move to Todo
                                    </button>
                                )}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <CheckCircle2 className="w-16 h-16 mb-4 text-gray-200" />
                        <p className="text-lg font-medium">Select a task to view details</p>
                    </div>
                )}
            </div>
        </div>
    );
}
