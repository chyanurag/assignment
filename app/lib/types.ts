export interface LoanInputs {
  principal: number;
  annualRate: number;
  tenureYears: number;
  monthlySurplus: number;
  yearlySurplus: number;
  lumpSum: number;
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
  monthlyCommitment: number;
  tag: string;
  chartData: { year: number; balance: number; netWorth: number }[];
}

export interface Evaluation {
  emi: number;
  principal: number;
  standardInterest: number;
  standardPayoffMonths: number;
  paths: PathResult[];
  winner: PathResult;
}
