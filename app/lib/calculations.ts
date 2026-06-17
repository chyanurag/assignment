import type { LoanInputs, PathResult, Evaluation, TaxBreakdown, WhatIfScenario } from "./types";

function roundTo(n: number, d = 0) {
  const f = Math.pow(10, d);
  return Math.round(n * f) / f;
}

function pmt(p: number, r: number, n: number) {
  if (r === 0) return p / n;
  return p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
}

function computeStandardInterest(principal: number, monthlyRate: number, totalMonths: number, emi: number) {
  let b = principal, i = 0;
  for (let m = 1; m <= totalMonths; m++) {
    const int = b * monthlyRate; i += int; b -= emi - int;
    if (b < 0) b = 0;
  }
  return i;
}

export function evaluate(inputs: LoanInputs): Evaluation {
  const {
    principal, annualRate, tenureYears,
    monthlySurplus, yearlySurplus, lumpSum,
  } = inputs;

  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = tenureYears * 12;
  const emi = pmt(principal, monthlyRate, totalMonths);

  const stdInterest = computeStandardInterest(principal, monthlyRate, totalMonths, emi);

  const build = (investRatio: number, id: string, label: string, emoji: string, desc: string) =>
    buildPath(inputs, id, label, emoji, desc, investRatio, monthlyRate, totalMonths, emi, stdInterest);

  const basePaths: PathResult[] = [
    build(0, "prepay", "Prepay First", "🏠",
      `Put ₹${((monthlySurplus + yearlySurplus / 12 + lumpSum / 12) || 0).toLocaleString("en-IN")}/mo toward your loan`),
    build(1, "invest", "Invest It", "📈",
      `Invest ₹${((monthlySurplus + yearlySurplus / 12 + lumpSum / 12) || 0).toLocaleString("en-IN")}/mo and let compounding grow your wealth`),
    build(0.5, "balanced", "Balanced", "⚖️",
      `Split 50/50 — prepay some, invest some. Best of both worlds`),
  ];

  basePaths.sort((a, b) => b.totalBenefit - a.totalBenefit);

  const totalTaxSaved = basePaths.reduce((s, p) => s + p.taxBreakdown.totalTaxSaved, 0) / basePaths.length;

  const surplusMultValues = [0.5, 1, 2];
  const surplusLabels = ["Conservative", "Base", "Aggressive"];
  const whatIfScenarios: WhatIfScenario[] = surplusMultValues.map((mult, idx) => {
    const wiInputs: LoanInputs = {
      ...inputs,
      monthlySurplus: roundTo(monthlySurplus * mult),
      yearlySurplus: roundTo(yearlySurplus * mult),
      lumpSum: roundTo(lumpSum * mult),
    };
    const wiPaths: PathResult[] = [
      buildPath(wiInputs, "prepay", "Prepay First", "🏠", `${surplusLabels[idx]} surplus — all to loan`,
        0, monthlyRate, totalMonths, emi, stdInterest),
      buildPath(wiInputs, "invest", "Invest It", "📈", `${surplusLabels[idx]} surplus — all to investments`,
        1, monthlyRate, totalMonths, emi, stdInterest),
      buildPath(wiInputs, "balanced", "Balanced", "⚖️", `${surplusLabels[idx]} surplus — split 50/50`,
        0.5, monthlyRate, totalMonths, emi, stdInterest),
    ];
    wiPaths.sort((a, b) => b.totalBenefit - a.totalBenefit);
    return {
      id: surplusLabels[idx].toLowerCase(),
      label: surplusLabels[idx],
      multiplier: mult,
      evaluation: {
        inputs: wiInputs,
        emi, principal, standardInterest: stdInterest, standardPayoffMonths: totalMonths,
        paths: wiPaths, winner: wiPaths[0],
        totalTaxSaved: 0,
        whatIfScenarios: [],
      } as Evaluation,
    };
  });

  return {
    inputs,
    emi: roundTo(emi),
    principal,
    standardInterest: roundTo(stdInterest),
    standardPayoffMonths: totalMonths,
    paths: basePaths,
    winner: basePaths[0],
    totalTaxSaved,
    whatIfScenarios,
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
  stdInterest: number,
): PathResult {
  const {
    principal, monthlySurplus, yearlySurplus, lumpSum,
    expectedReturnRate, inflationRate, taxRate,
  } = inputs;

  const investReturn = expectedReturnRate / 100 / 12;

  let balance = principal;
  let totalInterest = 0;
  let investmentValue = 0;
  let payoffMonth = totalMonths;
  let totalSection24Savings = 0;
  let totalSection80CSavings = 0;
  let yearlyInterest = 0;
  let yearlyPrincipal = 0;

  const chartData: { year: number; balance: number; netWorth: number; netWorthReal: number }[] = [];
  chartData.push({ year: 0, balance: roundTo(balance), netWorth: 0, netWorthReal: 0 });

  for (let m = 1; m <= totalMonths; m++) {
    if (balance <= 0) {
      investmentValue *= (1 + investReturn);
      if (payoffMonth === totalMonths) payoffMonth = m - 1;
      if (m % 12 === 0) {
        const yr = m / 12;
        const nw = roundTo(principal + investmentValue);
        const nwr = roundTo(nw / Math.pow(1 + inflationRate / 100, yr));
        chartData.push({ year: yr, balance: 0, netWorth: nw, netWorthReal: nwr });
      }
      if (m % 12 === 0 || m === totalMonths) flushYearlyTax();
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

    yearlyInterest += interest;
    yearlyPrincipal += principalPaid;

    if (m % 12 === 0 || m === payoffMonth || m === totalMonths) flushYearlyTax();

    if (m % 12 === 0 || m === payoffMonth) {
      const yr = Math.ceil(m / 12);
      const homeEquity = principal - balance;
      const nw = roundTo(homeEquity + investmentValue);
      const nwr = roundTo(nw / Math.pow(1 + inflationRate / 100, yr));
      chartData.push({ year: yr, balance: roundTo(balance), netWorth: nw, netWorthReal: nwr });
    }
  }

  function flushYearlyTax() {
    const sec24 = Math.min(yearlyInterest, 200000) * (taxRate / 100);
    const sec80c = Math.min(yearlyPrincipal, 150000) * (taxRate / 100);
    totalSection24Savings += sec24;
    totalSection80CSavings += sec80c;
    yearlyInterest = 0;
    yearlyPrincipal = 0;
  }

  const totalInvested = ((monthlySurplus * payoffMonth) + (yearlySurplus * Math.ceil(payoffMonth / 12)) + lumpSum) * investRatio;

  const interestSaved = stdInterest - totalInterest;

  const gains = Math.max(0, investmentValue - totalInvested);
  const ltcgTax = Math.max(0, gains - 100000) * 0.10;
  const postTaxInvestmentValue = Math.max(0, investmentValue - ltcgTax);

  const totalTaxSaved = totalSection24Savings + totalSection80CSavings;
  const totalBenefit = interestSaved + postTaxInvestmentValue + totalTaxSaved;

  const finalYr = Math.max(1, Math.ceil(payoffMonth / 12));
  const homeEquity = principal - balance;
  const netWorth = roundTo(homeEquity + investmentValue);
  const netWorthReal = roundTo(netWorth / Math.pow(1 + inflationRate / 100, finalYr));

  return {
    id, label, emoji, description: desc,
    payoffYears: Math.floor(payoffMonth / 12),
    payoffMonths: payoffMonth,
    totalInterest: roundTo(totalInterest),
    interestSaved: roundTo(interestSaved),
    investmentValue: roundTo(investmentValue),
    totalInvested: roundTo(totalInvested),
    netWorth,
    netWorthReal,
    monthlyCommitment: roundTo(emi + monthlySurplus + yearlySurplus / 12 + lumpSum / 12),
    tag: id,
    chartData,
    taxBreakdown: {
      section24Savings: roundTo(totalSection24Savings),
      section80CSavings: roundTo(totalSection80CSavings),
      totalTaxSaved: roundTo(totalTaxSaved),
      ltcgTax: roundTo(ltcgTax),
      postTaxInvestmentValue: roundTo(postTaxInvestmentValue),
    },
    totalBenefit: roundTo(totalBenefit),
  };
}
