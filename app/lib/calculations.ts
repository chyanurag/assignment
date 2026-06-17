import type { LoanInputs, PathResult, Evaluation } from "./types";

function roundTo(n: number, d = 0) {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

function pmt(p: number, r: number, n: number) {
  if (r === 0) return p / n;
  return p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

export function evaluate(inputs: LoanInputs): Evaluation {
  const { principal, annualRate, tenureYears, monthlySurplus, yearlySurplus, lumpSum } = inputs;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  const emi = pmt(principal, monthlyRate, totalMonths);

  const stdInterest = (() => {
    let b = principal, i = 0;
    for (let m = 1; m <= totalMonths; m++) {
      const int = b * monthlyRate; i += int; b -= emi - int;
      if (b < 0) b = 0;
    }
    return i;
  })();

  const paths: PathResult[] = [
    buildPath(inputs, "prepay", "Prepay First", "🏠", `Put ₹${(monthlySurplus + yearlySurplus / 12 + lumpSum / 12).toLocaleString("en-IN")}/mo toward your loan`,
      0, monthlyRate, totalMonths, emi),
    buildPath(inputs, "invest", "Invest It", "📈", `Invest ₹${(monthlySurplus + yearlySurplus / 12 + lumpSum / 12).toLocaleString("en-IN")}/mo and let compounding grow your wealth`,
      1, monthlyRate, totalMonths, emi),
    buildPath(inputs, "balanced", "Balanced", "⚖️", `Split 50/50 — prepay some, invest some. Best of both worlds`,
      0.5, monthlyRate, totalMonths, emi),
  ];

  paths.sort((a, b) => {
    const sa = a.interestSaved + a.investmentValue;
    const sb = b.interestSaved + b.investmentValue;
    return sb - sa;
  });

  return {
    emi: roundTo(emi),
    principal,
    standardInterest: roundTo(stdInterest),
    standardPayoffMonths: totalMonths,
    paths,
    winner: paths[0],
  };
}

function buildPath(
  inputs: LoanInputs,
  id: string,
  label: string,
  emoji: string,
  desc: string,
  investRatio: number,
  monthlyRate: number,
  totalMonths: number,
  emi: number,
): PathResult {
  const { principal, monthlySurplus, yearlySurplus, lumpSum } = inputs;
  const investReturn = 0.12 / 12;

  let balance = principal;
  let totalInterest = 0;
  let investmentValue = 0;
  let payoffMonth = totalMonths;
  const chartData: { year: number; balance: number; netWorth: number }[] = [];
  chartData.push({ year: 0, balance: roundTo(balance), netWorth: 0 });

  for (let m = 1; m <= totalMonths; m++) {
    if (balance <= 0) {
      investmentValue *= (1 + investReturn);
      if (payoffMonth === totalMonths) payoffMonth = m - 1;
      if (m % 12 === 0) chartData.push({ year: m / 12, balance: 0, netWorth: roundTo(principal + investmentValue) });
      continue;
    }

    const interest = balance * monthlyRate;
    totalInterest += interest;

    const surplusMonthly = monthlySurplus;
    const surplusYearly = (m % 12 === 0) ? yearlySurplus : 0;
    const surplusLump = (m === 1) ? lumpSum : 0;
    const totalSurplus = surplusMonthly + surplusYearly + surplusLump;

    const investAmount = totalSurplus * investRatio;
    const prepayAmount = totalSurplus - investAmount;

    investmentValue = (investmentValue + investAmount) * (1 + investReturn);

    const totalPayment = emi + prepayAmount;
    let principalPaid = totalPayment - interest;
    if (principalPaid >= balance) { principalPaid = balance; balance = 0; payoffMonth = m; }
    else { balance -= principalPaid; }

    if (m % 12 === 0 || m === payoffMonth) {
      const homeEquity = principal - balance;
      chartData.push({ year: Math.ceil(m / 12), balance: roundTo(balance), netWorth: roundTo(homeEquity + investmentValue) });
    }
  }

  const totalInvested = (monthlySurplus + yearlySurplus / 12) * payoffMonth * investRatio + (lumpSum * investRatio);
  const interestSaved = (() => {
    let b = principal, i = 0;
    for (let m = 1; m <= totalMonths; m++) { const int = b * monthlyRate; i += int; b -= emi - int; if (b < 0) b = 0; }
    return i - totalInterest;
  })();

  return {
    id, label, emoji, description: desc,
    payoffYears: Math.floor(payoffMonth / 12),
    payoffMonths: payoffMonth,
    totalInterest: roundTo(totalInterest),
    interestSaved: roundTo(interestSaved),
    investmentValue: roundTo(investmentValue),
    totalInvested: roundTo(totalInvested),
    netWorth: roundTo(principal + investmentValue),
    monthlyCommitment: roundTo(emi + monthlySurplus + yearlySurplus / 12 + lumpSum / 12),
    tag: id,
    chartData,
  };
}
