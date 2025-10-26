"use client"
import { ArrowBigUp, Heart, Clock, DollarSign, MapPin, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CardProps {
    name: string;
    image: string;
    votes: number;
    title?: string;
    description?: string;
    price?: number;
    startTime?: string;
    endTime?: string;
    dayOfWeek?: number;
    placeName?: string;
}

const dayNames: { [key: number]: string } = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Every day',
    8: 'Weekends'
};

export default function Card({ 
    name, 
    image, 
    votes, 
    title, 
    description, 
    price, 
    startTime, 
    endTime, 
    dayOfWeek,
    placeName 
}: CardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    const formatTime = (time?: string) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatPrice = (price?: number) => {
        if (price === undefined || price === null) return null;
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? null : numPrice.toFixed(2);
    };

    return (
        <div className="w-full min-w-[160px] max-w-[280px] sm:min-w-[180px] md:min-w-[200px] perspective-1000">
            <div 
                className="relative w-full aspect-square cursor-pointer"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Front Side */}
                <motion.div
                    className="absolute inset-0 backface-hidden"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ backfaceVisibility: 'hidden' }}
                    onClick={() => setIsFlipped(true)}
                >
                    <div className="w-full h-full overflow-hidden rounded-lg hover:opacity-90 transition-opacity">
                        <img 
                            src={image} 
                            alt={name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>

                {/* Back Side */}
                <motion.div
                    className="absolute inset-0 backface-hidden"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 0 : -180 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)'
                    }}
                >
                    <div className="w-full h-full bg-white rounded-lg shadow-lg p-3 sm:p-4 flex flex-col justify-between overflow-y-auto">
                        <div className="space-y-2">
                            {/* Close button */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsFlipped(false);
                                }}
                                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={16} className="text-gray-600" />
                            </button>

                            {/* Title */}
                            {title && (
                                <h3 className="text-sm sm:text-base font-bold text-gray-800 pr-6 line-clamp-2">
                                    {title}
                                </h3>
                            )}

                            {/* Description */}
                            {description && (
                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3">
                                    {description}
                                </p>
                            )}

                            {/* Price */}
                            {formatPrice(price) && (
                                <div className="flex items-center gap-1.5 text-green-600">
                                    <DollarSign size={16} />
                                    <span className="text-sm sm:text-base font-bold">
                                        ${formatPrice(price)}
                                    </span>
                                </div>
                            )}

                            {/* Time */}
                            {startTime && endTime && (
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <Clock size={14} />
                                    <span className="text-xs sm:text-sm">
                                        {formatTime(startTime)} - {formatTime(endTime)}
                                    </span>
                                </div>
                            )}

                            {/* Day */}
                            {dayOfWeek !== undefined && (
                                <div className="text-xs sm:text-sm text-gray-600">
                                    📅 {dayNames[dayOfWeek] || 'N/A'}
                                </div>
                            )}

                            {/* Place Name */}
                            {placeName && (
                                <div className="flex items-center gap-1.5 text-gray-600">
                                    <MapPin size={14} />
                                    <span className="text-xs sm:text-sm truncate">
                                        {placeName}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Votes at bottom */}
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-2 pt-2 border-t border-gray-200">
                            <ArrowBigUp size={16} />
                            <span>{votes} votes</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Info below card - only show when not flipped */}
            <AnimatePresence>
                {!isFlipped && (
                    <motion.div 
                        className="flex flex-col mt-2 gap-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
