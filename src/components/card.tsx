import { ArrowBigUp, Heart } from "lucide-react";

export default function Card({ name, image, votes }: { name: string; image: string; votes: number }) {
    return (
        <div className="w-full min-w-[160px] max-w-[280px] sm:min-w-[180px] md:min-w-[200px]">
            <button className="w-full aspect-square overflow-hidden rounded-lg hover:opacity-90 transition-opacity">
                <img 
                    src={image} 
                    alt={name} 
                    className="w-full h-full object-cover"
                />
            </button>

            <div className="flex flex-col mt-2 gap-1">
                <div className="flex items-center justify-between">
                    <p className="m-0 text-sm md:text-base font-medium truncate pr-2">{name}</p>
                    <button className="flex-shrink-0 hover:text-red-500 transition-colors">
                        <Heart size={19} />
                    </button>
                </div>

                <div className="flex items-center gap-1.5 text-gray-500 text-xs md:text-sm">
                    <span>{votes}</span>
                    <ArrowBigUp size={20} />
                </div>
            </div>
        </div>
    );
}
