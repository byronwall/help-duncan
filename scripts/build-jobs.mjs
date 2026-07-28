import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const raw = JSON.parse(fs.readFileSync(path.join(root, "data/trueup-raw.json"), "utf8"));

const clean = (value = "") =>
  value
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function parseCard(card) {
  const lines = card.rawText
    .split("\n")
    .map(clean)
    .filter(Boolean);
  const ageIndex = lines.findIndex((line) =>
    /^(\d+\s+)?(hour|hours|day|days|month|months)$/i.test(line)
  );
  const age = ageIndex >= 0 ? lines[ageIndex] : "Age not shown";
  const location = ageIndex > 1 ? lines[ageIndex - 1] : "Location not shown";
  const sector =
    ageIndex > 3 ? lines.slice(2, ageIndex - 1).join(" • ") : "Sector not shown";
  const salaryIndex =
    ageIndex >= 0 && /^\$[\d,.]+[KkMm]?\s*-\s*\$[\d,.]+[KkMm]?/.test(lines[ageIndex + 1] || "")
      ? ageIndex + 1
      : -1;
  const detailStart = salaryIndex >= 0 ? salaryIndex + 1 : ageIndex + 1;
  const fitIndex = lines.findIndex((line, index) => index >= detailStart && line === "Am I a fit?");
  const signalIndex = lines.findIndex(
    (line, index) =>
      index >= detailStart &&
      (line === "Trajectory score" ||
        line === "•" ||
        /^\d{1,3}$/.test(line) ||
        /employees$|open jobs$|valuation|funding|startup|public|unicorn|ATS|watchlist/i.test(line))
  );
  const detailEnd = [fitIndex, signalIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0] ?? lines.length;
  const skills = lines
    .slice(Math.max(detailStart, 0), detailEnd)
    .filter((line) => line.length <= 34 && !/^https?:/i.test(line))
    .slice(0, 12);
  const companySignals = lines
    .slice(fitIndex >= 0 ? fitIndex + 1 : detailEnd)
    .filter((line) => line !== "•" && line !== "Trajectory score" && !/^\d{1,3}$/.test(line))
    .slice(0, 7);

  return {
    title: clean(card.title),
    company: clean(card.company),
    applyUrl: card.url,
    companyUrl: card.companyUrl,
    sector,
    location,
    age,
    salary: salaryIndex >= 0 ? lines[salaryIndex] : "Not listed",
    skills,
    companySignals,
    sourceQuery: card.query,
  };
}

const titleWeights = [
  [/data governance analyst|data governance specialist|data governance$/i, 30, "direct governance alignment"],
  [/data steward/i, 28, "direct stewardship alignment"],
  [/data quality analyst|quality control data analyst/i, 27, "data-quality ownership"],
  [/senior health data analyst|senior data analyst/i, 25, "senior analysis scope"],
  [/analytics engineer/i, 24, "pipeline and analytics overlap"],
  [/data integration analyst|data integration engineer/i, 24, "integration-heavy scope"],
  [/business intelligence analyst|business intelligence engineer/i, 22, "reporting and BI alignment"],
  [/reporting.*analyst|analyst.*reporting/i, 21, "reporting operations alignment"],
  [/data operations analyst|data operations engineer/i, 20, "production data operations"],
  [/data engineer/i, 20, "data-engineering scope"],
  [/data analyst/i, 18, "general data-analysis alignment"],
  [/salesforce.*data|data.*salesforce/i, 17, "Salesforce data-model overlap"],
  [/sql.*analyst|analyst.*sql/i, 16, "SQL-centered analysis"],
  [/operations analyst/i, 12, "operations analysis background"],
];

const negativeTitleWeights = [
  [/\(Canada\)/i, -30, "listing is explicitly Canada-specific"],
  [/machine learning|applied scientist|data scientist/i, -25, "ML specialization"],
  [/software engineer|backend|frontend|full.?stack/i, -24, "software-engineering specialization"],
  [/data center|hardware|mechanical|electrical|facilities/i, -35, "data-center infrastructure, not data engineering"],
  [/director|vice president|principal|head of/i, -32, "likely above current management scope"],
  [/staff data analyst|staff analytics|staff business intelligence/i, -14, "staff-level scope needs validation"],
  [/manager|lead/i, -14, "people or program leadership may be required"],
  [/intern|junior|associate/i, -28, "likely below experience level"],
  [/sales|presales|customer success|adoption specialist/i, -12, "customer-facing specialization"],
];

const matchTerms = [
  [/\bSQL\b|SQL Server|stored procedure|SSIS|ETL|ELT/i, 6, "SQL / ETL"],
  [/\bPython\b|\bR\b|RStudio/i, 4, "Python / R automation"],
  [/Power BI|Tableau|Looker|business intelligence/i, 3, "BI and reporting"],
  [/governance|metadata|lineage|catalog|steward/i, 6, "governance and metadata"],
  [/data quality|validation|reconciliation|quality control/i, 5, "data quality"],
  [/Salesforce|CRM/i, 3, "Salesforce / CRM data"],
  [/API|integration|ingestion/i, 4, "API and integration"],
  [/financial|bank|fintech|regulatory|health|insurance/i, 2, "regulated-data domain"],
];

function locationScore(location) {
  const value = location.toLowerCase();
  if (/washington,?\s*d\.?c\.?|arlington|alexandria|mclean|tysons|reston|bethesda|rockville|fairfax|leesburg, va|frederick, md/.test(value)) {
    return { score: 22, market: "DC area", note: "DC-area location" };
  }
  if (/remote[, -]+(us|u\.s\.|usa)|(?:us|u\.s\.|usa)[, -]+remote|united states.*remote|remote.*united states/.test(value)) {
    return { score: 22, market: "Remote US", note: "explicit US-remote location" };
  }
  if (
    /remote/.test(value) &&
    /bangalore|bengaluru|india|philippines|romania|canada|uk\b|gbr|london|israel|tel aviv|emea|europe|portugal|türkiye|cyprus|jakarta|berlin|zurich|bulgaria|latam|asia\b|spain|barcelona|poland|germany|argentina|brazil|chile|costa rica|mexico/.test(value)
  ) {
    return { score: -28, market: "Outside target market", note: "remote role appears limited to a non-US market" };
  }
  if (/remote/.test(value)) {
    return { score: 14, market: "Remote - verify US eligibility", note: "remote; US eligibility needs verification" };
  }
  if (/worldwide|home based/.test(value)) {
    return { score: 10, market: "Remote - verify US eligibility", note: "globally remote; US eligibility needs verification" };
  }
  if (/united states|\busa\b|\bus\b/.test(value)) {
    return { score: 3, market: "US onsite/hybrid", note: "US-based but remote status is unclear" };
  }
  return { score: -28, market: "Outside target market", note: "outside the stated remote-US / DC target" };
}

function scoreJob(job) {
  let score = 22;
  const strengths = [];
  const cautions = [];
  const searchable = [
    job.title,
    job.sector,
    job.skills.join(" "),
    job.companySignals.join(" "),
    job.sourceQuery,
  ].join(" ");

  for (const [pattern, weight, reason] of titleWeights) {
    if (pattern.test(job.title)) {
      score += weight;
      strengths.push(reason);
      break;
    }
  }
  for (const [pattern, weight, reason] of negativeTitleWeights) {
    if (pattern.test(job.title)) {
      score += weight;
      cautions.push(reason);
    }
  }
  for (const [pattern, weight, reason] of matchTerms) {
    if (pattern.test(searchable)) {
      score += weight;
      strengths.push(reason);
    }
  }

  const location = locationScore(job.location);
  score += location.score;
  if (location.score < 14) cautions.push(location.note);
  if (/month/i.test(job.age)) {
    score -= 5;
    cautions.push("older listing; verify it remains open");
  }
  if (job.salary !== "Not listed") strengths.push("salary range is listed");
  if (!job.skills.length) cautions.push("TrueUp card shows limited tool detail");

  score = Math.max(28, Math.min(96, score));
  return {
    ...job,
    score,
    market: location.market,
    strengths: [...new Set(strengths)].slice(0, 4),
    cautions: [...new Set(cautions)].slice(0, 3),
  };
}

const parsed = [...new Map(raw.map((card) => [card.url, card])).values()]
  .map(parseCard);

const preferred = [...parsed]
  .sort((a, b) => locationScore(b.location).score - locationScore(a.location).score);

const roleDeduped = [
  ...new Map(
    preferred.map((job) => [
      `${job.company.toLowerCase()}|${job.title.toLowerCase()}`,
      job,
    ])
  ).values(),
];

const deduped = roleDeduped
  .map(scoreJob)
  .filter((job) => job.score >= 28)
  .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
  .slice(0, 50)
  .map((job, index) => ({
    rank: index + 1,
    ...job,
    tier:
      job.score >= 55 &&
      (job.market === "Remote US" ||
        (job.market === "Remote - verify US eligibility" && job.score >= 60)) &&
      !/director|vice president|principal|manager|staff|lead\b|junior|intern/i.test(job.title) &&
      !job.cautions.some((item) => /outside|Canada-specific|above current|below experience|people or program leadership/i.test(item))
        ? "Priority shortlist"
        : "Stretch / blocked lead",
    fitSummary: `Strongest signals: ${job.strengths.join(", ") || "adjacent data experience"}.`,
    nextStep:
      job.cautions.length > 0
        ? `Verify ${job.cautions[0].replace(/^./, (letter) => letter.toLowerCase())}.`
        : "Read the full description and map the top three requirements to resume evidence.",
  }));

if (deduped.length < 50) {
  throw new Error(`Only ${deduped.length} roles cleared the fit threshold; adjust the search or scoring before publishing.`);
}

const output = `window.JOBS = ${JSON.stringify(deduped, null, 2)};\n`;
fs.writeFileSync(path.join(root, "data/jobs.js"), output);
console.log(`Wrote ${deduped.length} ranked roles to data/jobs.js`);
