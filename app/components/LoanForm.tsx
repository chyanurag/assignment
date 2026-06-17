"use client";

import { motion } from "framer-motion";
import type { LoanInputs } from "../lib/types";

interface Props {
  onCalculate: (inputs: LoanInputs) => void;
}

export default function LoanForm({ onCalculate }: Props) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    onCalculate({
      principal: Number(fd.get("principal")) || 5000000,
      annualRate: Number(fd.get("annualRate")) || 9,
      tenureYears: Number(fd.get("tenureYears")) || 20,
      monthlySurplus: Number(fd.get("monthlySurplus")) || 10000,
      yearlySurplus: Number(fd.get("yearlySurplus")) || 0,
      lumpSum: Number(fd.get("lumpSum")) || 0,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="w-14 h-14 mx-auto mb-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-200">
          💡
        </motion.div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Should you prepay or invest?</h1>
        <p className="text-gray-500 mt-3 text-lg max-w-lg mx-auto leading-relaxed">
          Tell us about your loan and we&apos;ll show you exactly how much you save or earn with each choice.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-6 sm:p-8 space-y-7"
      >
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-sm">🏡</div>
            <h2 className="text-lg font-bold text-gray-900">Your Loan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Loan Amount</label>
              <div className="mt-1.5 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input type="number" name="principal" defaultValue={5000000} min={0} step={100000} required
                  className="w-full pl-7 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border-0 focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Interest Rate</label>
              <div className="mt-1.5 relative">
                <input type="number" name="annualRate" defaultValue={9} min={0} max={30} step={0.1} required
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border-0 focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">%</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenure</label>
              <div className="mt-1.5 relative">
                <input type="number" name="tenureYears" defaultValue={20} min={1} max={40} required
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border-0 focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">years</span>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-sm">💰</div>
            <h2 className="text-lg font-bold text-gray-900">Your Surplus</h2>
            <span className="text-xs text-gray-500 ml-1">How much extra can you put?</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly</label>
              <div className="mt-1.5 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input type="number" name="monthlySurplus" defaultValue={10000} min={0} step={1000}
                  className="w-full pl-7 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border-0 focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Extra each month</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Yearly</label>
              <div className="mt-1.5 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input type="number" name="yearlySurplus" defaultValue={0} min={0} step={10000}
                  className="w-full pl-7 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border-0 focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Annual bonus etc.</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">One-time</label>
              <div className="mt-1.5 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">₹</span>
                <input type="number" name="lumpSum" defaultValue={0} min={0} step={50000}
                  className="w-full pl-7 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 border-0 focus:ring-2 focus:ring-emerald-500/30 focus:bg-white transition-all" />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Available right now</p>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          type="submit"
          className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-gray-900/20"
        >
          Show Me My Options →
        </motion.button>
      </motion.form>
    </div>
  );
}
