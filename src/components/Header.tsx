import { Bell, Search } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 border-b border-gray-200 bg-white/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 w-full">
            <div className="flex items-center gap-2">
                <div className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide">
                    ACTIVE MISSION
                </div>
                <span className="font-medium text-gray-900 text-sm">
                    Fix Payment Failures in Checkout Service
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <Search className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-6 w-px bg-gray-200 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-gray-900">Alex Junior</div>
                        <div className="text-xs text-gray-500">Junior Engineer</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                        AJ
                    </div>
                </div>
            </div>
        </header>
    );
}
