import { ChevronRight } from "lucide-react";

export default function Cardsection({ name, children }: { name: string; children: React.ReactNode }) {
    return (
        <div className="mx-3 sm:mx-4 md:mx-6 mb-6">
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold m-0">{name}</h1>
                <button className="hover:bg-gray-100 rounded-full p-1 transition-colors flex-shrink-0">
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            <div className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
                {children}
            </div>
        </div>
    );
}
