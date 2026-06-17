export interface LoanInputs {
  principal: number;
  annualRate: number;
  tenureYears: number;
  monthlySurplus: number;
  yearlySurplus: number;
  lumpSum: number;
  expectedReturnRate: number;
  inflationRate: number;
  taxRate: number;
}

export interface TaxBreakdown {
  section24Savings: number;
  section80CSavings: number;
  totalTaxSaved: number;
  ltcgTax: number;
  postTaxInvestmentValue: number;
}

export interface PathResult {
  id: string;
  label: string;
  emoji: string;
  description: string;
  payoffYears: number;
  payoffMonths: number;
  totalInterest: number;
  interestSaved: number;
  investmentValue: number;
  totalInvested: number;
  netWorth: number;
  netWorthReal: number;
  monthlyCommitment: number;
  tag: string;
  chartData: { year: number; balance: number; netWorth: number; netWorthReal: number }[];
  taxBreakdown: TaxBreakdown;
  totalBenefit: number;
}

export interface WhatIfScenario {
  id: string;
  label: string;
  multiplier: number;
  evaluation: Evaluation;
}

export interface Evaluation {
  inputs: LoanInputs;
  emi: number;
  principal: number;
  standardInterest: number;
  standardPayoffMonths: number;
  paths: PathResult[];
  winner: PathResult;
  totalTaxSaved: number;
  whatIfScenarios: WhatIfScenario[];
}
