"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Code, Rocket, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Mission Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Tasks Workspace", href: "/tasks", icon: CheckSquare },
    { name: "Code Simulation", href: "/code", icon: Code },
    { name: "Deploy to Prod", href: "/deploy", icon: Rocket },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 border-r border-gray-200 bg-white h-full px-4 py-6">
            <div className="flex items-center gap-2 px-2 mb-8 text-blue-600">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg leading-none pt-0.5">K</span>
                </div>
                <span className="font-bold text-xl tracking-tight text-gray-900">Kodree</span>
            </div>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-blue-700" : "text-gray-400")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto border-t border-gray-100 pt-4">
                <Link
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                    <Settings className="w-5 h-5 text-gray-400" />
                    Settings
                </Link>
            </div>
        </div>
    );
}
