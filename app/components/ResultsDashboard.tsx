"use client";

import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { Evaluation } from "../lib/types";

interface Props {
  evaluation: Evaluation;
  onBack: () => void;
}

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
const ym = (m: number) => `${Math.floor(m / 12)}y ${m % 12}m`;

function toLakhs(n: number) { return `₹${(n / 100000).toFixed(1)}L`; }

const colors: Record<string, string> = { prepay: "#059669", invest: "#2563eb", balanced: "#7c3aed" };

function VerdictCard({ winner, principal }: { winner: Evaluation["winner"]; principal: number }) {
  const totalSaved = winner.interestSaved + winner.investmentValue;
  return (
    <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, type: "spring", stiffness: 120 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 text-white shadow-2xl"
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="relative">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">{winner.emoji}</span>
          <div>
            <p className="text-emerald-300 text-xs font-bold uppercase tracking-widest">Our Recommendation</p>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{winner.label}</h2>
        <p className="text-gray-300 text-sm mb-6 max-w-xl leading-relaxed">{winner.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-emerald-300 text-[10px] uppercase">Payoff</p>
            <p className="text-lg sm:text-xl font-bold">{ym(winner.payoffMonths)}</p>
            <p className="text-emerald-200 text-xs">{Math.floor((principal - winner.totalInterest) / principal * 100)}% faster</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-emerald-300 text-[10px] uppercase">Interest Paid</p>
            <p className="text-lg sm:text-xl font-bold">{fmt(winner.totalInterest)}</p>
            <p className="text-emerald-200 text-xs">Save {fmt(winner.interestSaved)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-emerald-300 text-[10px] uppercase">Investment</p>
            <p className="text-lg sm:text-xl font-bold">{winner.investmentValue > 0 ? fmt(winner.investmentValue) : "—"}</p>
            <p className="text-gray-300 text-xs">{winner.totalInvested > 0 ? `From ${fmt(winner.totalInvested)}` : "All to loan"}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-emerald-300 text-[10px] uppercase">Net Worth</p>
            <p className="text-lg sm:text-xl font-bold">{fmt(winner.netWorth)}</p>
            <p className="text-gray-300 text-xs">Home + investments</p>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-sm leading-relaxed">
            With <span className="text-emerald-400 font-bold">{winner.label}</span>, you could
            {winner.interestSaved > 0 && <> save <span className="text-emerald-400 font-bold">{fmt(winner.interestSaved)}</span> in interest</>}
            {winner.interestSaved > 0 && winner.investmentValue > 0 && <> and</>}
            {winner.investmentValue > 0 && <> build <span className="text-blue-300 font-bold">{fmt(winner.investmentValue)}</span> in investments</>}
            {winner.interestSaved > 0 && winner.investmentValue > 0 ? <> — that&apos;s <span className="text-amber-300 font-bold">{fmt(totalSaved)}</span> in total benefit.</>
            : <>.</>}
          </p>
        </div>


      </div>
    </motion.div>
  );
}

function PathCard({ path, rank }: { path: Evaluation["paths"][0]; rank: number }) {
  const isWinner = rank === 0;
  const score = path.interestSaved + path.investmentValue;
  const maxScore = 5000000;
  return (
    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * rank }}
      className={`rounded-2xl border-2 p-5 transition-all ${isWinner ? "border-emerald-300 bg-emerald-50/70 shadow-md" : "border-gray-100 bg-white hover:shadow-sm"}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 ${isWinner ? "bg-emerald-500 text-white shadow-md shadow-emerald-200" : "bg-gray-100 text-gray-500"}`}>
          {isWinner ? "★" : rank + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-lg">{path.emoji}</span>
            <h4 className="font-bold text-gray-900">{path.label}</h4>
            {isWinner && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">BEST</span>}
          </div>
          <p className="text-xs text-gray-500 mb-3">{path.description}</p>
          <div className="grid grid-cols-5 gap-2 text-center mb-3">
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Payoff</p>
              <p className="text-sm font-bold text-gray-900">{ym(path.payoffMonths)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Interest</p>
              <p className="text-sm font-bold text-gray-900">{fmt(path.totalInterest)}</p>
              {path.interestSaved > 0 && <p className="text-[10px] text-emerald-600">-{fmt(path.interestSaved)}</p>}
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Invest</p>
              <p className="text-sm font-bold text-gray-900">{path.investmentValue > 0 ? fmt(path.investmentValue) : "—"}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Net Worth</p>
              <p className="text-sm font-bold text-gray-900">{fmt(path.netWorth)}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Monthly</p>
              <p className="text-sm font-bold text-gray-900">{fmt(path.monthlyCommitment)}</p>
            </div>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (score / maxScore) * 100)}%` }}
              transition={{ duration: 0.6, delay: 0.1 * rank }}
              className={`h-full rounded-full ${isWinner ? "bg-emerald-500" : "bg-blue-400"}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ResultsDashboard({ evaluation, onBack }: Props) {
  const { paths, winner, principal } = evaluation;

  const allChartData = paths.map(p => p.chartData);
  const maxYear = Math.max(...allChartData.flat().map(d => d.year));

  const mergedData = Array.from({ length: maxYear + 1 }, (_, y) => {
    const point: Record<string, number> = { year: y };
    paths.forEach((p, i) => {
      const d = allChartData[i].find(c => c.year === y);
      point[p.label + " (Balance)"] = d?.balance ?? 0;
      point[p.label + " (Net Worth)"] = d?.netWorth ?? 0;
    });
    return point;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <motion.button onClick={onBack} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="text-sm text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1">
          ← Back
        </motion.button>
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full font-medium">
          ₹{fmt(principal)} @ {evaluation.paths[0].payoffYears > 0 ? `${evaluation.paths[0].payoffYears}y` : ""} tenure
        </div>
      </div>

      <VerdictCard winner={winner} principal={principal} />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Balance Over Time</h3>
        <p className="text-xs text-gray-500 mb-4">How each strategy pays down your loan</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={mergedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={toLakhs} />
            <Tooltip formatter={(v) => [fmt(Number(v) || 0), undefined]} labelFormatter={(l) => `Year ${l}`} />
            {paths.map(p => (
              <Line key={p.id} type="monotone" dataKey={`${p.label} (Balance)`} stroke={colors[p.tag]} strokeWidth={2.5} dot={false} name={p.label} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-bold text-gray-900">Compare Your Options</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="grid grid-cols-4 gap-3 text-xs pb-3 mb-3 border-b border-gray-100">
            <span className="text-gray-500 font-semibold uppercase">Path</span>
            <span className="text-gray-500 font-semibold uppercase text-center">Payoff</span>
            <span className="text-gray-500 font-semibold uppercase text-center">You Save</span>
            <span className="text-gray-500 font-semibold uppercase text-center">You Earn</span>
          </div>
          {paths.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }}
              className={`grid grid-cols-4 gap-3 py-3 items-center ${i < paths.length - 1 ? "border-b border-gray-50" : ""} ${i === 0 ? "bg-emerald-50/50 -mx-4 px-4 rounded-lg" : ""}`}>
              <div className="flex items-center gap-2">
                <span>{p.emoji}</span>
                <span className="font-semibold text-gray-900 text-sm">{p.label}</span>
                {i === 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">BEST</span>}
              </div>
              <div className="text-center">
                <span className="font-bold text-gray-900 text-sm">{ym(p.payoffMonths)}</span>
                {p.payoffMonths < evaluation.standardPayoffMonths && (
                  <p className="text-[10px] text-emerald-600">{Math.floor((evaluation.standardPayoffMonths - p.payoffMonths) / 12)}y saved</p>
                )}
              </div>
              <div className="text-center font-bold text-sm" style={{ color: p.interestSaved > 0 ? "#059669" : "#94a3b8" }}>
                {p.interestSaved > 0 ? fmt(p.interestSaved) : "—"}
              </div>
              <div className="text-center font-bold text-sm" style={{ color: p.investmentValue > 0 ? "#2563eb" : "#94a3b8" }}>
                {p.investmentValue > 0 ? fmt(p.investmentValue) : "—"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <h3 className="text-base font-bold text-gray-900">Detailed Breakdown</h3>
        {paths.map((p, i) => <PathCard key={p.id} path={p} rank={i} />)}
      </div>

      <div className="flex gap-3 justify-center pt-2 pb-8">
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-xl text-sm transition-all">
          ← Try Different Numbers
        </motion.button>
      </div>
    </motion.div>
  );
}
