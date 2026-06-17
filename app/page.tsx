"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LoanInputs, Evaluation } from "./lib/types";
import { evaluate } from "./lib/calculations";
import LoanForm from "./components/LoanForm";
import ResultsDashboard from "./components/ResultsDashboard";

export default function Home() {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);

  const handleCalculate = useCallback((inputs: LoanInputs) => {
    const result = evaluate(inputs);
    setEvaluation(result);
  }, []);

  const handleBack = useCallback(() => {
    setEvaluation(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="border-b border-gray-100 bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm">
            D
          </div>
          <span className="text-sm font-bold text-gray-900">Decide</span>
          <span className="text-[10px] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full font-medium">prepay vs invest</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <AnimatePresence mode="wait">
          {!evaluation ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoanForm onCalculate={handleCalculate} />
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <ResultsDashboard evaluation={evaluation} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs text-gray-500">
            <span className="font-semibold">Decide</span>. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
