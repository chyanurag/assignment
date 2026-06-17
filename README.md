# Decide — Prepay vs Invest

## The Assignment
> A home loan is most people's largest debt and longest commitment. Most borrowers aren't sure when, how much, or whether to pay it down faster. Go talk to a few home loan borrowers. Understand how they think about their loan and where they get stuck. Then design a product that helps them decide their best payoff strategy. Deliver it however best shows your thinking and stick to it.

---

## 1. Problem & User

### Who I built for
The **Indian salaried home loan borrower**, 28–40, with a loan of ₹20L–₹1Cr at 8–10% interest. They have some surplus cash each month (₹5K–₹25K) and maybe a bonus or lump sum once a year. They've heard that "prepaying saves interest" but also that "investing beats inflation." They're stuck between these two narratives and don't know which one applies to *them*.

### The core tension
| Prepay narrative | Invest narrative |
|---|---|
| "You're paying the bank crores in interest" | "Equity gives 12–15% over the long run" |
| "Debt-free is peace of mind" | "Your money should work for you" |
| "Loan is a burden" | "Loan is leverage" |

Borrowers oscillate between these. They want a clear, personalized answer — not generic advice.

---

## 2. Research (Synthesized Insights)

*I spoke with 3 home loan borrowers (friends, ages 29–36, loans of ₹25L–₹65L):*

**Key finding: The question is never "should I prepay or invest?" — it's "how MUCH should I put toward each?"**

| Pain point | What I heard |
|---|---|
| **Analysis paralysis** | "I know I should do something but I keep putting it off because I'm not sure" |
| **Hidden costs** | "I didn't realize the tax benefit I'd lose if I prepay too fast" |
| **No feedback loop** | "I prepaid ₹2L last year... was that a good decision? I have no idea" |
| **One-size-fits-all advice** | "My friend says prepay everything. My CA says invest everything. Who's right?" |
| **Fear of commitment** | "If I put money into the loan, I can't take it back out" |

**Surprise:** The balanced approach (split surplus between prepay and invest) was genuinely appealing to all 3 borrowers — none of them even knew that was an option.

---

## 3. Design Principles

1. **One answer, not three.** Show results, but declare a winner. Don't make the user decide.
2. **Show the why.** Numbers without context are meaningless. Every number needs a reference point.
3. **Account for taxes.** Most calculators ignore Indian tax law (Sec 24, 80C, LTCG). Borrowers kept mentioning tax as a blind spot.
4. **Debt is emotional.** Peace of mind matters. The calculator should acknowledge that the "right" answer depends on risk tolerance too.
5. **Exportable.** If someone is making a ₹10L+ decision, they want something to take to their spouse/CA/bank.

---

## 4. Key Design Decisions

### Why three strategies and not a slider?
The user's mental model is binary (prepay vs invest). A slider from 0–100% is abstract and doesn't map to a clear action. Three strategies — Prepay First, Invest It, Balanced — are concrete, named options that a user can understand and act on.

### Why include a "Balanced" path?
The 50/50 split often wins in middle-ground scenarios. More importantly, it changes the frame from "which is right?" to "how much of each?" — which is the actual question borrowers have.

### Why hard-code the 50/50 split instead of making it adjustable?
Simplicity. 50/50 is a simple heuristic (half to each). Making it adjustable adds UI complexity and analysis paralysis. If the user wants to customize, they can run the calculator again with different numbers.

### Why tax brackets as a dropdown instead of free input?
Tax brackets in India are discrete (0/5/20/30%). A dropdown prevents invalid inputs and subtly educates the user about the brackets.

### Why PDF export?
For a ₹50L–1Cr decision, users want to share results with their spouse, CA, or bank officer. A shareable PDF makes the tool useful beyond the browser session.

### What's the assumed investment return?
Default 12% (historical Nifty 50 CAGR ~14–16%, but we conservative it to 12%). User can override 0–40%. This is the single most sensitive variable in the model, so making it adjustable was non-negotiable.

---

## 5. What I'd Add With More Time

| Feature | Why |
|---|---|
| **Prepayment penalty check** | Some banks charge 0–3% on partial prepayment (especially for fixed-rate loans). This changes the math significantly. |
| **Section 80C overlap warning** | If the user already maxes out 80C via EPF/PPF, the principal deduction is redundant. The tool should detect this. |
| **New vs old tax regime toggle** | Under the new regime, Sec 24 and 80C deductions vanish. The recommendation flips for many users. |
| **Risk preference slider** | Some borrowers want the guaranteed return of prepaying even if investing has higher expected value. A risk slider would adjust the recommendation. |
| **Live rate feed** | Pull repo rate, FD rates, and equity index returns automatically so assumptions stay current. |
| **Goal-based what-ifs** | "I want to be debt-free by age 45" → show me what surplus I need. The reverse of the current flow. |

---

## 6. Product Walkthrough

### Step 1: Enter loan details
Users enter their loan amount, interest rate, and tenure. Defaults are set at realistic Indian values (₹50L @ 9% / 20yr).

### Step 2: Enter surplus
Monthly surplus, yearly bonuses, and any lump sum available. The default is ₹10K/mo — a realistic surplus for a dual-income household with a ₹50L loan.

### Step 3: Set assumptions
- **Expected return** (default 12%) — the big lever
- **Inflation** (default 6%) — adjusts net worth to real purchasing power
- **Tax bracket** — impacts Section 24 and 80C benefits

A note explains how Indian tax law applies.

### Step 4: See the winner
The verdict card shows which strategy wins, why, and by how much. Key stats: payoff time, interest saved, investment value, net worth.

### Step 5: Understand the taxes
A dedicated tax table shows Section 24 savings, Section 80C savings, and LTCG tax for each strategy.

### Step 6: Check inflation impact
The inflation reality card shows nominal vs real net worth. Many users are shocked at how much inflation eats into nominal returns.

### Step 7: Explore what-ifs
Three pre-built scenarios (Conservative 0.5x, Base 1x, Aggressive 2x) show how the recommendation changes with surplus amount.

### Step 8: Export PDF
Download a clean, formatted PDF report to share or save.

---

## 7. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Animation | Framer Motion |
| PDF | jsPDF |
| Font | Geist (by Vercel) |

---

## 8. Running the App

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

To build for production:

```bash
pnpm build
pnpm start
```

---

*Built for the internship assignment. Not financial advice.*
