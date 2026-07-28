import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function loadWindowData(relativePath, property) {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, relativePath), "utf8"), context);
  return context.window[property];
}

const resumes = loadWindowData("data/resumes.js", "RESUME_VARIANTS");
const questions = loadWindowData("data/questions.js", "SEARCH_QUESTIONS");
const jobs = loadWindowData("data/jobs.js", "JOBS");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const failures = [];
if (resumes.length !== 10) failures.push(`Expected 10 resumes, found ${resumes.length}`);
if (questions.length !== 20) failures.push(`Expected 20 questions, found ${questions.length}`);
if (jobs.length !== 50) failures.push(`Expected 50 jobs, found ${jobs.length}`);
if (new Set(jobs.map((job) => job.applyUrl)).size !== jobs.length) failures.push("Job application URLs are not unique");
if (jobs.some((job, index) => job.rank !== index + 1)) failures.push("Job ranks are not sequential");
if (resumes.some((resume) => !resume.editorialMove || !resume.impactPrompt)) {
  failures.push("Every resume direction needs an editorial move and impact-verification prompt");
}
if (resumes.some((resume) => resume.project)) failures.push("Technical projects must be woven into work experience");
if (resumes.some((resume) => resume.summary.length > 165)) failures.push("A resume summary exceeds the compact scan limit");
if (resumes.some((resume) => !resume.summary.includes("11+ years of business and analytics experience"))) {
  failures.push("Every resume summary must use the full 11+ years business-and-analytics framing");
}
if (resumes.some((resume) => resume.current.length !== 10 || resume.analyst.length !== 6 || resume.operations.length !== 5)) {
  failures.push("Every resume needs the complete 10/6/5 source-backed experience set");
}
if (resumes.some((resume) => resume.skillLines?.length !== 4)) {
  failures.push("Every resume needs four compact skill lines");
}
if (
  resumes.some((resume) =>
    [...resume.current, ...resume.analyst, ...resume.operations].some((bullet) => bullet.length > 118)
  )
) {
  failures.push("A resume bullet exceeds the one-line drafting limit");
}
if (!html.includes('id="methodology"')) failures.push("Methodology section is missing");
if (!html.includes('id="prompts"')) failures.push("Prompt archive is missing");
if ((html.match(/class="prompt-record"/g) ?? []).length !== 13) failures.push("Expected 13 verbatim prompt records");
if (!html.includes("And we should also avoid saying 7+ years for data.")) {
  failures.push("Latest prompt is not preserved verbatim");
}
if (
  /class="truth-note"|class="hero-resume"|class="hero-roles"|Candidate case file|working draft/i.test(
    html
  )
) {
  failures.push("Removed site commentary or retired overview content is still present");
}
if (!html.includes("The combined capture produced 249 cards representing 229 unique application URLs.")) {
  failures.push("Search methodology totals are missing");
}

const publicFiles = ["index.html", "app.js", "styles.css", "data/resumes.js", "data/questions.js", "data/jobs.js"];
const forbidden = [
  /\((?!000\))\d{3}\)\s*\d{3}-\d{4}/,
  /@gmail\.com/i,
  /linkedin\.com\/in\/(?!your-profile)/i,
];

for (const relativePath of publicFiles) {
  const contents = fs.readFileSync(path.join(root, relativePath), "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(contents)) failures.push(`Private contact detail found in ${relativePath}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Static data and privacy checks passed.");
