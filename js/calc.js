/* WalletCalcs — shared calculator helpers */
"use strict";

const $ = (id) => document.getElementById(id);

const USD0 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const USD2 = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const NUM0 = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

const fmtUSD = (v) => (isFinite(v) ? USD0.format(v) : "—");
const fmtUSD2 = (v) => (isFinite(v) ? USD2.format(v) : "—");
const fmtNum = (v) => (isFinite(v) ? NUM0.format(v) : "—");
const fmtPct = (v, d = 1) => (isFinite(v) ? v.toFixed(d) + "%" : "—");

/** Read a numeric input; returns fallback when empty/invalid. */
function num(id, fallback = 0) {
  const el = $(id);
  if (!el) return fallback;
  const v = parseFloat(String(el.value).replace(/,/g, ""));
  return isFinite(v) ? v : fallback;
}

/** Format months as "X yr Y mo". */
function fmtMonths(m) {
  if (!isFinite(m) || m < 0) return "—";
  m = Math.round(m);
  const y = Math.floor(m / 12), r = m % 12;
  if (y === 0) return r + " mo";
  if (r === 0) return y + " yr";
  return y + " yr " + r + " mo";
}

/** Monthly payment for a fully amortizing loan. */
function pmt(principal, annualRatePct, months) {
  const r = annualRatePct / 100 / 12;
  if (months <= 0) return NaN;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

/**
 * Run an amortization with a fixed payment (plus optional extra).
 * Returns { months, totalInterest, rows } where rows are yearly snapshots.
 */
function amortize(principal, annualRatePct, payment, extra = 0, maxMonths = 1200) {
  const r = annualRatePct / 100 / 12;
  let bal = principal, totalInterest = 0, m = 0;
  const rows = [];
  let yearInterest = 0, yearPrincipal = 0;
  while (bal > 0.005 && m < maxMonths) {
    m++;
    const interest = bal * r;
    let principalPaid = payment + extra - interest;
    if (principalPaid <= 0) return { months: Infinity, totalInterest: Infinity, rows: [] };
    if (principalPaid > bal) principalPaid = bal;
    bal -= principalPaid;
    totalInterest += interest;
    yearInterest += interest;
    yearPrincipal += principalPaid;
    if (m % 12 === 0 || bal <= 0.005) {
      rows.push({ year: Math.ceil(m / 12), interest: yearInterest, principal: yearPrincipal, balance: bal });
      yearInterest = 0; yearPrincipal = 0;
    }
  }
  return { months: m, totalInterest, rows };
}

/** Attach live recalculation to all inputs/selects inside a form, then run once. */
function liveCalc(formId, fn) {
  const form = $(formId);
  if (!form) return;
  form.addEventListener("submit", (e) => { e.preventDefault(); fn(); });
  form.querySelectorAll("input, select").forEach((el) => {
    el.addEventListener("input", fn);
    el.addEventListener("change", fn);
  });
  fn();
}

/** Render yearly amortization rows into a table body. */
function renderYearlyTable(tbodyId, rows) {
  const tb = $(tbodyId);
  if (!tb) return;
  tb.innerHTML = rows.map((r) =>
    "<tr><td>Year " + r.year + "</td><td>" + fmtUSD(r.principal) + "</td><td>" +
    fmtUSD(r.interest) + "</td><td>" + fmtUSD(r.balance) + "</td></tr>"
  ).join("");
}
