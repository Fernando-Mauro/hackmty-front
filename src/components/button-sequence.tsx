import { motion, Variants, AnimatePresence } from "framer-motion"; // 1. Importa AnimatePresence
import { cn } from "@/lib/utils";
import { BanknoteArrowDown, Percent } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      // 1. Más rápido el retraso entre elementos
      staggerChildren: 0.1, 
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
    // 3. Asegura que la animación de SALIDA sea igual de rápida
    transition: {
      duration: 0.3, // 2. Animación más rápida
      ease: "easeOut",
    },
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.1, // 2. Animación más rápida
      ease: "easeOut",
    },
  },
};

export function ButtonSequence({
  isHiddenBadge,
}: {
  isHiddenBadge: boolean;
}) {
  return (
    // 2. Envuelve la lógica condicional con AnimatePresence
    <AnimatePresence>
      {/* 3. Usa renderizado condicional en lugar de clases de Tailwind */}
      {!isHiddenBadge && (
        <motion.div
          key="button-container" // 4. Añade una key única
          className="flex flex-col w-full items-end py-4 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden" // 5. Define la animación de salida
        >
          <motion.button
            type="button"
            onClick={() => console.log("Create promotion clicked")}
            className={cn(
              "w-auto rounded-full px-5 py-3 text-sm font-semibold",
              "bg-[#D22E1E] text-white shadow-lg ring-1 ring-green-700/30",
              "hover:bg-green-700 hover:shadow-xl active:scale-[0.98]",
              "transition-all duration-300 flex-row flex items-center justify-center gap-2"
            )}
            variants={itemVariants}
          >
            Promotion
            <Percent size={18}/>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => console.log("Create descuentazazo clicked")}
            className={cn(
              "w-auto rounded-full px-5 py-3 text-sm font-medium",
              "bg-[#004878] text-white shadow-md",
              " hover:shadow-lg active:scale-[0.98]",
              "transition-all duration-300 flex-row flex items-center justify-center gap-2"
            )}
            variants={itemVariants}
          >
            Descuentazazo
            <BanknoteArrowDown size={18} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}