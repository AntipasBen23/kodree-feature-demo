"use client";

import { useSimulation } from "@/context/SimulationContext";
import { CheckCircle2, ChevronRight, Circle, Clock, Target, Activity, Code, Bug } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { state } = useSimulation();
  const { activeMission, tasks, aiMessages } = state;

  const progressPercentage = Math.round((activeMission.progress / activeMission.totalTasks) * 100) || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome back, Alex</h1>
        <p className="text-gray-500">Here's your current work status and priorities for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Mission Card - Spans 2 cols */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-3">
              <Target className="w-4 h-4" />
              ACTIVE MISSION
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{activeMission.title}</h2>
            <p className="text-gray-600 text-sm">{activeMission.description}</p>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm font-medium mb-1">
                <span className="text-gray-700">Mission Progress</span>
                <span className="text-blue-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{activeMission.progress} of {activeMission.totalTasks} tasks completed</p>
            </div>

            <div className="mt-auto">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gray-400" />
                Current Sprint Tasks
              </h3>
              <div className="space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    {task.status === "Done" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    ) : task.status === "In Progress" || task.status === "Review" ? (
                      <Clock className="w-5 h-5 text-amber-500 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm font-medium flex-1 truncate",
                      task.status === "Done" ? "text-gray-500 line-through" : "text-gray-700"
                    )}>
                      {task.title}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-white border border-gray-200 rounded text-gray-600">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/tasks"
                className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Go to Tasks Workspace
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Skill Radar / Stats */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-4">
              <Activity className="w-4 h-4 text-purple-600" />
              Career & Skills Proof
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-gray-500 mb-1 leading-tight">Current Level</div>
                <div className="font-bold text-lg text-gray-900 w-full flex justify-between items-center">
                  L2 Engineer
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-semibold">On Track</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Frontend Architecture", score: 85, icon: Code, color: "bg-blue-500" },
                  { name: "System Debugging", score: 60, icon: Bug, color: "bg-rose-500" },
                  { name: "Deployment & CI/CD", score: 40, icon: Target, color: "bg-purple-500" }
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="flex justify-between items-center mb-1 text-xs font-medium text-gray-700">
                      <span className="flex items-center gap-1.5"><skill.icon className="w-3 h-3 text-gray-400" /> {skill.name}</span>
                      <span>{skill.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${skill.color}`} style={{ width: `${skill.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col h-[320px]">
            <div className="font-bold text-sm text-gray-900 mb-4 flex items-center justify-between">
              Team Activity
              <span className="text-xs font-normal text-blue-600 cursor-pointer hover:underline">View All</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {aiMessages.map((msg, i) => (
                <div key={msg.id} className="relative pl-4 pb-4 border-l border-gray-100 last:border-0 last:pb-0">
                  <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full bg-gray-200 border-2 border-white ring-2 ring-transparent"></div>
                  <div className="text-xs text-gray-400 mb-0.5 font-medium">
                    {msg.persona} <span className="text-gray-300">•</span> {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                  <div className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
