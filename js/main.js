/* =============================================
   FinCalcHub - Main JavaScript
   All calculator logic
   ============================================= */

'use strict';

/* --- Utility Functions --- */
const fmt = {
  currency: (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  number:   (n) => Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }),
  integer:  (n) => Math.round(n).toLocaleString('en-US'),
  percent:  (n) => Number(n).toFixed(2) + '%',
};

function el(id) { return document.getElementById(id); }
function val(id) { return parseFloat(el(id)?.value) || 0; }
function strval(id) { return el(id)?.value || ''; }
function setHTML(id, html) { if (el(id)) el(id).innerHTML = html; }
function setText(id, text) { if (el(id)) el(id).textContent = text; }
function show(id) { if (el(id)) el(id).classList.remove('hidden'); }
function hide(id) { if (el(id)) el(id).classList.add('hidden'); }
function showError(id, msg) {
  const el_err = document.getElementById(id + '-error');
  if (el_err) { el_err.textContent = msg; el_err.classList.add('show'); }
}
function clearError(id) {
  const el_err = document.getElementById(id + '-error');
  if (el_err) { el_err.classList.remove('show'); }
}
function addPayoffDateText(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + Math.ceil(months));
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/* =============================================
   1. MORTGAGE CALCULATOR
   ============================================= */
function calcMortgage() {
  const homePrice = val('home-price');
  const downPayment = val('down-payment');
  const annualRate = val('interest-rate');
  const termYears = val('loan-term');
  let valid = true;

  ['home-price','down-payment','interest-rate','loan-term'].forEach(id => clearError(id));

  if (homePrice <= 0) { showError('home-price', 'Please enter a valid home price.'); valid = false; }
  if (downPayment < 0 || downPayment >= homePrice) { showError('down-payment', 'Down payment must be less than home price.'); valid = false; }
  if (annualRate <= 0 || annualRate > 30) { showError('interest-rate', 'Enter a valid interest rate (0.1–30%).'); valid = false; }
  if (termYears <= 0 || termYears > 50) { showError('loan-term', 'Enter a valid term (1–50 years).'); valid = false; }
  if (!valid) return;

  const principal = homePrice - downPayment;
  const r = (annualRate / 100) / 12;
  const n = termYears * 12;
  let monthly;
  if (r === 0) {
    monthly = principal / n;
  } else {
    monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - principal;

  setHTML('mortgage-result', `
    <div class="result-item">
      <div class="result-label">Monthly Payment</div>
      <div class="result-value large">${fmt.currency(monthly)}</div>
    </div>
    <div class="results-divider"></div>
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Loan Amount</div>
        <div class="result-value">${fmt.currency(principal)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Interest</div>
        <div class="result-value">${fmt.currency(totalInterest)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Cost</div>
        <div class="result-value">${fmt.currency(totalPaid + downPayment)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Down Payment</div>
        <div class="result-value">${fmt.currency(downPayment)}</div>
      </div>
    </div>
    <div class="results-divider"></div>
    <div class="alert alert-success" style="margin:0;font-size:0.85rem;">
      💡 Over ${termYears} years, you'll pay ${fmt.currency(totalInterest)} in interest — ${fmt.percent((totalInterest/totalPaid)*100)} of total payments.
    </div>
  `);
  show('mortgage-result');
}

/* =============================================
   2. CAR LOAN CALCULATOR
   ============================================= */
function calcCarLoan() {
  const vehiclePrice = val('vehicle-price');
  const downPayment = val('car-down-payment');
  const annualRate = val('car-rate');
  const termMonths = val('car-term');
  let valid = true;

  ['vehicle-price','car-down-payment','car-rate','car-term'].forEach(id => clearError(id));
  if (vehiclePrice <= 0) { showError('vehicle-price', 'Enter a valid vehicle price.'); valid = false; }
  if (downPayment < 0 || downPayment >= vehiclePrice) { showError('car-down-payment', 'Down payment must be less than vehicle price.'); valid = false; }
  if (annualRate < 0 || annualRate > 30) { showError('car-rate', 'Enter a valid interest rate.'); valid = false; }
  if (termMonths <= 0 || termMonths > 120) { showError('car-term', 'Enter a valid term (1–120 months).'); valid = false; }
  if (!valid) return;

  const principal = vehiclePrice - downPayment;
  const r = (annualRate / 100) / 12;
  const n = termMonths;
  let monthly;
  if (r === 0) {
    monthly = principal / n;
  } else {
    monthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }
  const totalPaid = monthly * n;
  const totalInterest = totalPaid - principal;

  setHTML('car-result', `
    <div class="result-item">
      <div class="result-label">Monthly Payment</div>
      <div class="result-value large">${fmt.currency(monthly)}</div>
    </div>
    <div class="results-divider"></div>
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Loan Amount</div>
        <div class="result-value">${fmt.currency(principal)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Interest</div>
        <div class="result-value">${fmt.currency(totalInterest)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Paid</div>
        <div class="result-value">${fmt.currency(totalPaid)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Loan Term</div>
        <div class="result-value">${n} months</div>
      </div>
    </div>
  `);
  show('car-result');
}

/* =============================================
   3. COMPOUND INTEREST CALCULATOR
   ============================================= */
function calcCompound() {
  const principal = val('ci-principal');
  const rate = val('ci-rate');
  const years = val('ci-years');
  const freq = parseInt(strval('ci-freq')) || 12;

  ['ci-principal','ci-rate','ci-years'].forEach(id => clearError(id));
  let valid = true;
  if (principal <= 0) { showError('ci-principal', 'Enter a valid principal amount.'); valid = false; }
  if (rate <= 0 || rate > 100) { showError('ci-rate', 'Enter a valid annual rate.'); valid = false; }
  if (years <= 0 || years > 100) { showError('ci-years', 'Enter a valid number of years.'); valid = false; }
  if (!valid) return;

  const r = rate / 100;
  const A = principal * Math.pow(1 + r / freq, freq * years);
  const interest = A - principal;

  // Build yearly breakdown
  let tableRows = '';
  for (let y = 1; y <= Math.min(years, 30); y++) {
    const a = principal * Math.pow(1 + r / freq, freq * y);
    tableRows += `<tr><td>${y}</td><td>${fmt.currency(a)}</td><td>${fmt.currency(a - principal)}</td></tr>`;
  }

  setHTML('ci-result', `
    <div class="result-item">
      <div class="result-label">Final Amount</div>
      <div class="result-value large">${fmt.currency(A)}</div>
    </div>
    <div class="results-divider"></div>
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Initial Principal</div>
        <div class="result-value">${fmt.currency(principal)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Interest Earned</div>
        <div class="result-value">${fmt.currency(interest)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Growth Rate</div>
        <div class="result-value">${fmt.percent((interest/principal)*100)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Effective Annual Rate</div>
        <div class="result-value">${fmt.percent((Math.pow(1 + r/freq, freq) - 1)*100)}</div>
      </div>
    </div>
    <div class="results-divider"></div>
    <div style="overflow-x:auto;">
      <table style="width:100%;font-size:0.8rem;border-collapse:collapse;">
        <thead><tr style="background:var(--navy);color:white;"><th style="padding:6px 8px;text-align:left;">Year</th><th style="padding:6px 8px;text-align:right;">Balance</th><th style="padding:6px 8px;text-align:right;">Interest</th></tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  `);
  show('ci-result');
}

/* =============================================
   4. RETIREMENT CALCULATOR
   ============================================= */
function calcRetirement() {
  const currentAge = val('ret-current-age');
  const retirementAge = val('ret-retirement-age');
  const currentSavings = val('ret-current-savings');
  const monthlyContrib = val('ret-monthly-contrib');
  const annualReturn = val('ret-return');

  ['ret-current-age','ret-retirement-age','ret-monthly-contrib','ret-return'].forEach(id => clearError(id));
  let valid = true;
  if (currentAge < 16 || currentAge > 80) { showError('ret-current-age', 'Enter a valid current age (16–80).'); valid = false; }
  if (retirementAge <= currentAge || retirementAge > 90) { showError('ret-retirement-age', 'Retirement age must be greater than current age.'); valid = false; }
  if (monthlyContrib < 0) { showError('ret-monthly-contrib', 'Enter a valid contribution.'); valid = false; }
  if (annualReturn < 0 || annualReturn > 30) { showError('ret-return', 'Enter a valid return rate.'); valid = false; }
  if (!valid) return;

  const years = retirementAge - currentAge;
  const n = years * 12;
  const r = (annualReturn / 100) / 12;

  // Future value of existing savings
  const fvSavings = currentSavings * Math.pow(1 + r, n);

  // Future value of monthly contributions
  let fvContribs = 0;
  if (r === 0) {
    fvContribs = monthlyContrib * n;
  } else {
    fvContribs = monthlyContrib * (Math.pow(1 + r, n) - 1) / r;
  }

  const totalBalance = fvSavings + fvContribs;
  const totalContributed = currentSavings + (monthlyContrib * n);
  const totalGrowth = totalBalance - totalContributed;

  setHTML('ret-result', `
    <div class="result-item">
      <div class="result-label">Projected Retirement Balance</div>
      <div class="result-value large">${fmt.currency(totalBalance)}</div>
    </div>
    <div class="results-divider"></div>
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Years to Retirement</div>
        <div class="result-value">${years} yrs</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Contributed</div>
        <div class="result-value">${fmt.currency(totalContributed)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Investment Growth</div>
        <div class="result-value">${fmt.currency(totalGrowth)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Monthly Income (4% rule)</div>
        <div class="result-value">${fmt.currency(totalBalance * 0.04 / 12)}</div>
      </div>
    </div>
    <div class="results-divider"></div>
    <div class="alert alert-success" style="margin:0;font-size:0.85rem;">
      💡 Using the 4% withdrawal rule, you could withdraw ${fmt.currency(totalBalance * 0.04 / 12)}/month in retirement.
    </div>
  `);
  show('ret-result');
}

/* =============================================
   5. DEBT PAYOFF CALCULATOR
   ============================================= */
function calcDebtPayoff() {
  const balance = val('debt-balance');
  const annualRate = val('debt-rate');
  const monthlyPayment = val('debt-payment');

  ['debt-balance','debt-rate','debt-payment'].forEach(id => clearError(id));
  let valid = true;
  if (balance <= 0) { showError('debt-balance', 'Enter a valid balance.'); valid = false; }
  if (annualRate < 0 || annualRate > 50) { showError('debt-rate', 'Enter a valid interest rate.'); valid = false; }
  if (!valid) return;

  const r = (annualRate / 100) / 12;
  const minPayment = r === 0 ? 0 : balance * r;

  if (monthlyPayment <= minPayment && r > 0) {
    showError('debt-payment', `Payment must exceed minimum interest of ${fmt.currency(minPayment)}/mo.`);
    return;
  }
  if (monthlyPayment <= 0) { showError('debt-payment', 'Enter a valid monthly payment.'); return; }

  let months, totalPaid, totalInterest;
  if (r === 0) {
    months = balance / monthlyPayment;
    totalPaid = balance;
    totalInterest = 0;
  } else {
    months = -Math.log(1 - (balance * r / monthlyPayment)) / Math.log(1 + r);
    totalPaid = monthlyPayment * months;
    totalInterest = totalPaid - balance;
  }

  const payoffDate = addPayoffDateText(months);

  setHTML('debt-result', `
    <div class="result-item">
      <div class="result-label">Time to Pay Off</div>
      <div class="result-value large">${fmt.number(Math.ceil(months / 12))} yrs ${Math.ceil(months) % 12} mos</div>
    </div>
    <div class="results-divider"></div>
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Total Months</div>
        <div class="result-value">${Math.ceil(months)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Interest</div>
        <div class="result-value">${fmt.currency(totalInterest)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Paid</div>
        <div class="result-value">${fmt.currency(totalPaid)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Payoff Date</div>
        <div class="result-value" style="font-size:1.1rem;">${payoffDate}</div>
      </div>
    </div>
  `);
  show('debt-result');
}

/* =============================================
   6. CREDIT CARD PAYOFF CALCULATOR
   ============================================= */
function calcCreditCard() {
  const balance = val('cc-balance');
  const apr = val('cc-apr');
  const monthlyPayment = val('cc-payment');

  ['cc-balance','cc-apr','cc-payment'].forEach(id => clearError(id));
  let valid = true;
  if (balance <= 0) { showError('cc-balance', 'Enter a valid balance.'); valid = false; }
  if (apr < 0 || apr > 100) { showError('cc-apr', 'Enter a valid APR.'); valid = false; }
  if (!valid) return;

  const r = (apr / 100) / 12;
  const minPayment = r === 0 ? 0 : balance * r;

  if (monthlyPayment <= minPayment && r > 0) {
    showError('cc-payment', `Payment must exceed minimum interest of ${fmt.currency(minPayment)}/mo.`);
    return;
  }
  if (monthlyPayment <= 0) { showError('cc-payment', 'Enter a valid monthly payment.'); return; }

  let months;
  if (r === 0) {
    months = balance / monthlyPayment;
  } else {
    months = -Math.log(1 - (balance * r / monthlyPayment)) / Math.log(1 + r);
  }
  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - balance;
  const payoffDate = addPayoffDateText(months);

  // Minimum payment comparison
  const minPay = Math.max(balance * 0.02, 25);
  let minMonths = 0, minTotal = 0;
  if (r > 0 && minPay > minPayment) {
    minMonths = -Math.log(1 - (balance * r / minPay)) / Math.log(1 + r);
    minTotal = minPay * minMonths;
  }

  setHTML('cc-result', `
    <div class="result-item">
      <div class="result-label">Months to Pay Off</div>
      <div class="result-value large">${Math.ceil(months)} months</div>
    </div>
    <div class="results-divider"></div>
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Total Interest Paid</div>
        <div class="result-value">${fmt.currency(totalInterest)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Amount Paid</div>
        <div class="result-value">${fmt.currency(totalPaid)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Debt-Free Date</div>
        <div class="result-value" style="font-size:1.1rem;">${payoffDate}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Interest Rate (Monthly)</div>
        <div class="result-value">${fmt.percent(r * 100)}</div>
      </div>
    </div>
    ${minMonths > 0 ? `<div class="results-divider"></div><div class="alert alert-success" style="margin:0;font-size:0.85rem;">💡 Vs. minimum payments (${fmt.currency(minPay)}/mo): you'd pay ${fmt.currency(minTotal - totalPaid)} more and take ${Math.ceil(minMonths - months)} more months!</div>` : ''}
  `);
  show('cc-result');
}

/* =============================================
   7. SAVINGS CALCULATOR
   ============================================= */
function calcSavings() {
  const initial = val('sav-initial');
  const monthly = val('sav-monthly');
  const rate = val('sav-rate');
  const years = val('sav-years');

  ['sav-initial','sav-rate','sav-years'].forEach(id => clearError(id));
  let valid = true;
  if (initial < 0) { showError('sav-initial', 'Enter a valid initial deposit.'); valid = false; }
  if (rate < 0 || rate > 30) { showError('sav-rate', 'Enter a valid interest rate.'); valid = false; }
  if (years <= 0 || years > 100) { showError('sav-years', 'Enter a valid number of years.'); valid = false; }
  if (!valid) return;

  const r = (rate / 100) / 12;
  const n = years * 12;

  const fvInitial = initial * Math.pow(1 + r, n);
  let fvMonthly = 0;
  if (r === 0) {
    fvMonthly = monthly * n;
  } else {
    fvMonthly = monthly * (Math.pow(1 + r, n) - 1) / r;
  }
  const finalBalance = fvInitial + fvMonthly;
  const totalDeposits = initial + (monthly * n);
  const totalInterest = finalBalance - totalDeposits;

  setHTML('sav-result', `
    <div class="result-item">
      <div class="result-label">Final Balance</div>
      <div class="result-value large">${fmt.currency(finalBalance)}</div>
    </div>
    <div class="results-divider"></div>
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Total Deposits</div>
        <div class="result-value">${fmt.currency(totalDeposits)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Interest Earned</div>
        <div class="result-value">${fmt.currency(totalInterest)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Interest % of Total</div>
        <div class="result-value">${fmt.percent((totalInterest/finalBalance)*100)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Monthly Growth (avg)</div>
        <div class="result-value">${fmt.currency(finalBalance / n)}</div>
      </div>
    </div>
  `);
  show('sav-result');
}

/* =============================================
   8. BMI CALCULATOR
   ============================================= */
let bmiUnit = 'imperial';
function setBMIUnit(unit) {
  bmiUnit = unit;
  document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.toggle-btn[data-unit="${unit}"]`)?.classList.add('active');
  if (unit === 'imperial') {
    show('bmi-imperial-inputs');
    hide('bmi-metric-inputs');
  } else {
    hide('bmi-imperial-inputs');
    show('bmi-metric-inputs');
  }
}

function calcBMI() {
  let bmi;
  if (bmiUnit === 'imperial') {
    const weightLbs = val('bmi-weight-lbs');
    const heightFt = val('bmi-height-ft');
    const heightIn = val('bmi-height-in') || 0;
    if (weightLbs <= 0 || heightFt <= 0) {
      alert('Please enter valid height and weight values.');
      return;
    }
    const totalInches = (heightFt * 12) + heightIn;
    bmi = (weightLbs / (totalInches * totalInches)) * 703;
  } else {
    const weightKg = val('bmi-weight-kg');
    const heightCm = val('bmi-height-cm');
    if (weightKg <= 0 || heightCm <= 0) {
      alert('Please enter valid height and weight values.');
      return;
    }
    const heightM = heightCm / 100;
    bmi = weightKg / (heightM * heightM);
  }

  let category, categoryClass, emoji;
  if (bmi < 18.5) { category = 'Underweight'; categoryClass = 'bmi-underweight'; emoji = '⚠️'; }
  else if (bmi < 25) { category = 'Normal Weight'; categoryClass = 'bmi-normal'; emoji = '✅'; }
  else if (bmi < 30) { category = 'Overweight'; categoryClass = 'bmi-overweight'; emoji = '⚠️'; }
  else { category = 'Obese'; categoryClass = 'bmi-obese'; emoji = '🔴'; }

  // Needle position: BMI 15 = 0%, BMI 35 = 100%
  const needlePos = Math.min(Math.max(((bmi - 15) / 20) * 100, 0), 100);

  setHTML('bmi-result', `
    <div class="result-item">
      <div class="result-label">Your BMI</div>
      <div class="result-value large">${bmi.toFixed(1)}</div>
    </div>
    <div class="bmi-bar">
      <div class="bmi-scale"><div class="bmi-needle" style="left:${needlePos}%"></div></div>
      <div class="bmi-labels"><span>15</span><span>18.5</span><span>25</span><span>30</span><span>35+</span></div>
    </div>
    <div style="margin-top:0.75rem;">
      <span class="bmi-category ${categoryClass}">${emoji} ${category}</span>
    </div>
    <div class="results-divider"></div>
    <div style="font-size:0.85rem;color:var(--gray-700);">
      <strong>BMI Categories:</strong><br>
      • Underweight: &lt; 18.5<br>
      • Normal weight: 18.5 – 24.9<br>
      • Overweight: 25 – 29.9<br>
      • Obese: ≥ 30
    </div>
  `);
  show('bmi-result');
}

/* =============================================
   9. BUDGET PLANNER
   ============================================= */
const BUDGET_COLORS = ['#0a2342','#00c853','#3b82f6','#f59e0b','#ef4444','#8b5cf6','#ec4899'];

function calcBudget() {
  const income = val('budget-income');
  if (income <= 0) { alert('Please enter a valid monthly income.'); return; }

  const categories = [
    { id: 'budget-housing', label: 'Housing', color: BUDGET_COLORS[0] },
    { id: 'budget-food', label: 'Food & Dining', color: BUDGET_COLORS[1] },
    { id: 'budget-transport', label: 'Transportation', color: BUDGET_COLORS[2] },
    { id: 'budget-entertainment', label: 'Entertainment', color: BUDGET_COLORS[3] },
    { id: 'budget-savings', label: 'Savings', color: BUDGET_COLORS[4] },
    { id: 'budget-other', label: 'Other', color: BUDGET_COLORS[5] },
  ];

  const amounts = categories.map(c => ({ ...c, amount: val(c.id) }));
  const totalExpenses = amounts.reduce((s, a) => s + a.amount, 0);
  const remaining = income - totalExpenses;
  const status = remaining >= 0 ? 'alert-success' : 'alert-danger';
  const statusMsg = remaining >= 0
    ? `✅ You have ${fmt.currency(remaining)} remaining after expenses.`
    : `⚠️ You're over budget by ${fmt.currency(Math.abs(remaining))}!`;

  // Build CSS conic-gradient for pie
  let deg = 0;
  const gradients = [];
  amounts.forEach(a => {
    if (a.amount > 0) {
      const pct = (a.amount / income) * 360;
      gradients.push(`${a.color} ${deg}deg ${deg + pct}deg`);
      deg += pct;
    }
  });
  if (remaining > 0) {
    gradients.push(`var(--gray-300) ${deg}deg 360deg`);
  }
  const pieBg = gradients.length ? `conic-gradient(${gradients.join(', ')})` : 'var(--gray-200)';

  const breakdownRows = amounts.filter(a => a.amount > 0).map(a => `
    <div class="budget-item">
      <div class="budget-dot" style="background:${a.color}"></div>
      <div class="budget-item-name">${a.label}</div>
      <div class="budget-item-pct">${((a.amount/income)*100).toFixed(1)}%</div>
      <div class="budget-item-amt">${fmt.currency(a.amount)}</div>
    </div>
  `).join('');

  setHTML('budget-result', `
    <div class="results-grid">
      <div class="result-item">
        <div class="result-label">Monthly Income</div>
        <div class="result-value">${fmt.currency(income)}</div>
      </div>
      <div class="result-item">
        <div class="result-label">Total Expenses</div>
        <div class="result-value">${fmt.currency(totalExpenses)}</div>
      </div>
    </div>
    <div class="budget-pie" style="background:${pieBg}"></div>
    <div class="budget-breakdown">${breakdownRows}</div>
    <div class="results-divider"></div>
    <div class="alert ${status}" style="margin:0;font-size:0.85rem;">${statusMsg}</div>
    <div style="margin-top:0.75rem;font-size:0.8rem;color:var(--gray-500);">
      💡 The 50/30/20 rule suggests: 50% needs, 30% wants, 20% savings.
    </div>
  `);
  show('budget-result');
}

/* =============================================
   FAQ ACCORDION
   ============================================= */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* =============================================
   MOBILE NAVIGATION
   ============================================= */
function initNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });
  }
  // Close on link click
  document.querySelectorAll('.mobile-nav-list a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileNav?.classList.remove('open');
    });
  });
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  initFAQ();
  initNav();

  // Bind calculator forms
  const bindings = [
    ['mortgage-form', calcMortgage],
    ['car-loan-form', calcCarLoan],
    ['ci-form', calcCompound],
    ['ret-form', calcRetirement],
    ['debt-form', calcDebtPayoff],
    ['cc-form', calcCreditCard],
    ['sav-form', calcSavings],
    ['bmi-form', calcBMI],
    ['budget-form', calcBudget],
  ];
  bindings.forEach(([id, fn]) => {
    const form = document.getElementById(id);
    if (form) {
      form.addEventListener('submit', (e) => { e.preventDefault(); fn(); });
    }
  });

  // BMI unit toggle
  document.querySelectorAll('.toggle-btn[data-unit]').forEach(btn => {
    btn.addEventListener('click', () => setBMIUnit(btn.dataset.unit));
  });

  // Mark active nav link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .mobile-nav-list a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
});
