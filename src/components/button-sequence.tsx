"use client";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BanknoteArrowDown, Percent } from "lucide-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        x: 50,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.1,
            ease: "easeOut",
        },
    },
};

export function ButtonSequence({
    isHiddenBadge,
    onPromotionClick, // <-- Receives the function
    onOfferClick,     // <-- Receives the function
}: {
    isHiddenBadge: boolean;
    onPromotionClick: () => void;
    onOfferClick: () => void;
}) {
    return (
        <AnimatePresence>
            {!isHiddenBadge && (
                <motion.div
                    key="button-container"
                    className="flex flex-col w-full items-end py-4 gap-1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.button
                        type="button"
                        onClick={onPromotionClick} // <-- Calls parent function
                        className={cn(
                            "w-auto rounded-full px-5 py-3 text-sm font-semibold",
                            "bg-[#D22E1E] text-white shadow-lg",
                            "hover:bg-red-700 hover:shadow-xl active:scale-[0.98]",
                            "transition-all duration-300 flex-row flex items-center justify-center gap-2"
                        )}
                        variants={itemVariants}
                    >
                        Promotion
                        <Percent size={18} />
                    </motion.button>

                    {/* <motion.button
                        type="button"
                        onClick={onOfferClick} // <-- Calls parent function
                        className={cn(
                            "w-auto rounded-full px-5 py-3 text-sm font-medium",
                            "bg-[#004878] text-white shadow-md",
                            " hover:shadow-lg active:scale-[0.98]",
                            "transition-all duration-300 flex-row flex items-center justify-center gap-2"
                        )}
                        variants={itemVariants}
                    >
                        Big Discount
                        <BanknoteArrowDown size={18} />
                    </motion.button> */}
                </motion.div>
            )}
        </AnimatePresence>
    );
}