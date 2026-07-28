const resumes = window.RESUME_VARIANTS || [];
const questions = window.SEARCH_QUESTIONS || [];
const jobs = window.JOBS || [];

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

function renderBullets(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function renderResume(variant, preview = false) {
  return `
    <article class="resume-page${preview ? " is-preview" : ""}" data-resume-id="${escapeHtml(variant.id)}">
      <header class="resume-page__header">
        <h3>DUNCAN BARTLEY</h3>
        <p class="resume-contact">Maryland / Washington, DC area | (000) 000-0000 | name@example.com | linkedin.com/in/your-profile</p>
        <p class="resume-headline">${escapeHtml(variant.headline)}</p>
      </header>
      <section class="resume-block">
        <h4>PROFESSIONAL SUMMARY</h4>
        <p class="resume-summary">${escapeHtml(variant.summary)}</p>
      </section>
      <section class="resume-block">
        <h4>PROFESSIONAL EXPERIENCE</h4>
        <div class="resume-role">
          <div class="resume-role__line">
            <strong>Callahan &amp; Associates — Data Steward</strong>
            <span>Washington, DC | 2021–Present</span>
          </div>
          ${renderBullets(variant.current)}
        </div>
        <div class="resume-role">
          <div class="resume-role__line">
            <strong>Callahan &amp; Associates — Data Analyst</strong>
            <span>Washington, DC | 2019–2021</span>
          </div>
          ${renderBullets(variant.analyst)}
        </div>
        <div class="resume-role">
          <div class="resume-role__line">
            <strong>Thomson Reuters Court Express — Business Operations Analyst</strong>
            <span>Washington, DC | 2015–2019</span>
          </div>
          ${renderBullets(variant.operations)}
        </div>
      </section>
      <section class="resume-block">
        <h4>CORE SKILLS</h4>
        <p class="resume-skills">${escapeHtml(variant.skills)}</p>
      </section>
      <section class="resume-block">
        <h4>EDUCATION</h4>
        <div class="resume-education">
          <p><strong>Hood College</strong> — M.S., Information Technology; Data Science &amp; Analytics</p>
          <p>Frederick, MD</p>
          <p><strong>Indiana University</strong> — B.A., History</p>
          <p>Bloomington, IN</p>
        </div>
      </section>
    </article>
  `;
}

function renderHero() {
  const heroResume = document.querySelector("#hero-resume");
  if (heroResume && resumes[0]) {
    heroResume.innerHTML = renderResume(resumes[0], true);
  }

  const heroRoles = document.querySelector("#hero-roles");
  if (heroRoles) {
    heroRoles.innerHTML = jobs
      .filter((job) => job.tier === "Priority shortlist")
      .slice(0, 3)
      .map(
        (job) => `
          <li>
            <span class="signal-list__rank">${String(job.rank).padStart(2, "0")}</span>
            <div>
              <strong>${escapeHtml(job.title)}</strong>
              <span>${escapeHtml(job.company)} · ${escapeHtml(job.market)} · score ${job.score}</span>
            </div>
          </li>
        `
      )
      .join("");
  }
}

function renderContactSheet() {
  const contactSheet = document.querySelector("#resume-contact-sheet");
  if (!contactSheet) return;

  contactSheet.innerHTML = resumes
    .map(
      (variant, index) => `
        <button
          class="resume-preview"
          type="button"
          data-resume="${escapeHtml(variant.id)}"
          aria-label="Open ${escapeHtml(variant.label)} resume direction"
        >
          <span class="resume-preview__meta">
            <span class="resume-preview__number">${String(index + 1).padStart(2, "0")}</span>
            <span>
              <strong>${escapeHtml(variant.label)}</strong>
              <small>${escapeHtml(variant.target)}</small>
            </span>
          </span>
          <span class="resume-preview__page">${renderResume(variant, true)}</span>
        </button>
      `
    )
    .join("");

  contactSheet.addEventListener("click", (event) => {
    const button = event.target.closest("[data-resume]");
    if (!button) return;
    openResume(button.dataset.resume);
  });
}

const resumeDialog = document.querySelector("#resume-dialog");
const resumeDialogBody = document.querySelector("#dialog-resume-body");
const resumeDialogTitle = document.querySelector("#dialog-resume-title");
let resumeFitObserver;

function fitOpenResume() {
  const fit = resumeDialogBody?.querySelector(".resume-screen-fit");
  const stage = resumeDialogBody?.querySelector(".resume-scale-stage");
  const page = resumeDialogBody?.querySelector(".resume-page");
  if (!fit || !stage || !page) return;
  const pageWidth = 816;
  const pageHeight = 1056;
  const scale = Math.min(1, fit.clientWidth / pageWidth);
  stage.style.width = `${pageWidth * scale}px`;
  stage.style.height = `${pageHeight * scale}px`;
  page.style.transform = `scale(${scale})`;
}

function openResume(id) {
  const variant = resumes.find((item) => item.id === id);
  if (!variant || !resumeDialog || !resumeDialogBody || !resumeDialogTitle) return;
  resumeDialogTitle.textContent = `${variant.label} — ${variant.target}`;
  resumeDialogBody.innerHTML = `
    <div class="resume-direction-note">
      <p><strong>Why this direction:</strong> ${escapeHtml(variant.rationale)}</p>
      <dl>
        <div>
          <dt>Editorial move</dt>
          <dd>${escapeHtml(variant.editorialMove)}</dd>
        </div>
        <div>
          <dt>Impact to verify</dt>
          <dd>${escapeHtml(variant.impactPrompt)}</dd>
        </div>
      </dl>
    </div>
    <div class="resume-screen-fit">
      <div class="resume-scale-stage">${renderResume(variant)}</div>
    </div>
  `;
  resumeDialog.showModal();
  resumeFitObserver?.disconnect();
  resumeFitObserver = new ResizeObserver(fitOpenResume);
  resumeFitObserver.observe(resumeDialogBody.querySelector(".resume-screen-fit"));
  requestAnimationFrame(fitOpenResume);
}

document.querySelector("#close-resume")?.addEventListener("click", () => resumeDialog?.close());

resumeDialog?.addEventListener("click", (event) => {
  if (event.target === resumeDialog) resumeDialog.close();
});

document.querySelector("#print-resume")?.addEventListener("click", () => {
  document.body.classList.add("is-printing-resume");
  window.print();
});

window.addEventListener("afterprint", () => document.body.classList.remove("is-printing-resume"));

const answerStorageKey = "help-duncan-search-answers-v1";

function loadAnswers() {
  try {
    return JSON.parse(localStorage.getItem(answerStorageKey) || "{}");
  } catch {
    return {};
  }
}

function collectLiveAnswers() {
  const answers = {};
  document.querySelectorAll("[data-question-answer]").forEach((field) => {
    answers[field.dataset.questionAnswer] = field.value;
  });
  return answers;
}

function saveAnswers() {
  const answers = collectLiveAnswers();
  localStorage.setItem(answerStorageKey, JSON.stringify(answers));
  const status = document.querySelector("#answer-status");
  if (status) status.textContent = `Saved locally at ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`;
}

function renderQuestions() {
  const container = document.querySelector("#question-list");
  if (!container) return;
  const answers = loadAnswers();

  container.innerHTML = questions
    .map(
      (question, index) => `
        <div class="question-row">
          <span class="question-number">${String(index + 1).padStart(2, "0")}</span>
          <div class="question-copy">
            <label for="question-${escapeHtml(question.id)}">${escapeHtml(question.prompt)}</label>
            <p>${escapeHtml(question.why)}</p>
          </div>
          <textarea
            id="question-${escapeHtml(question.id)}"
            data-question-answer="${escapeHtml(question.id)}"
            placeholder="Duncan’s answer…"
          >${escapeHtml(answers[question.id] || "")}</textarea>
        </div>
      `
    )
    .join("");

  let saveTimer;
  container.addEventListener("input", () => {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(saveAnswers, 220);
  });
  container.addEventListener("change", saveAnswers);
  window.addEventListener("pagehide", saveAnswers);
}

async function copyAnswerBrief() {
  const answers = collectLiveAnswers();
  localStorage.setItem(answerStorageKey, JSON.stringify(answers));
  const text = questions
    .map(
      (question, index) =>
        `${index + 1}. ${question.prompt}\n${answers[question.id]?.trim() || "[Not answered]"}`
    )
    .join("\n\n");
  const status = document.querySelector("#answer-status");

  try {
    await navigator.clipboard.writeText(text);
    if (status) status.textContent = "Answer brief copied.";
  } catch {
    const fallback = document.createElement("textarea");
    fallback.value = text;
    document.body.append(fallback);
    fallback.select();
    document.execCommand("copy");
    fallback.remove();
    if (status) status.textContent = "Answer brief copied.";
  }
}

document.querySelector("#copy-answers")?.addEventListener("click", copyAnswerBrief);

function renderRole(job) {
  const strengths = job.strengths.length
    ? job.strengths
    : ["Adjacent data experience; inspect the full description."];
  const cautions = job.cautions.length
    ? job.cautions
    : ["No major mismatch visible on the TrueUp card; verify the full requirements."];
  const skills = job.skills.length ? job.skills.join(", ") : "Not shown on the TrueUp card";
  const signals = job.companySignals.length
    ? job.companySignals.join(" · ")
    : "No additional company signals shown";

  return `
    <details class="role-dossier" data-role-market="${escapeHtml(job.market)}" data-role-score="${job.score}">
      <summary>
        <span class="role-summary">
          <span class="role-rank">${String(job.rank).padStart(2, "0")}</span>
          <span class="role-title">
            <strong>${escapeHtml(job.title)}</strong>
            <span>${escapeHtml(job.company)} · ${escapeHtml(job.location)}</span>
          </span>
          <span class="market-tag" data-market="${escapeHtml(job.market)}">${escapeHtml(job.market)}</span>
          <span class="role-score">${job.score}</span>
          <span class="role-next">${escapeHtml(job.nextStep)}</span>
        </span>
      </summary>
      <div class="role-details">
        <div>
          <div class="evidence-columns">
            <section class="evidence-block">
              <h3>Why it may fit</h3>
              <ul>${strengths.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </section>
            <section class="evidence-block">
              <h3>Verify before applying</h3>
              <ul>${cautions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </section>
          </div>
          <div class="role-actions">
            <span class="role-source">TrueUp query: ${escapeHtml(job.sourceQuery)} · captured July 27, 2026</span>
            <a class="action-tab" href="${escapeHtml(job.applyUrl)}" target="_blank" rel="noreferrer">Open application ↗</a>
          </div>
        </div>
        <dl class="role-facts">
          <div><dt>Sector</dt><dd>${escapeHtml(job.sector)}</dd></div>
          <div><dt>Salary</dt><dd>${escapeHtml(job.salary)}</dd></div>
          <div><dt>Listed</dt><dd>${escapeHtml(job.age)}</dd></div>
          <div><dt>Tools</dt><dd>${escapeHtml(skills)}</dd></div>
          <div><dt>Signals</dt><dd>${escapeHtml(signals)}</dd></div>
        </dl>
      </div>
    </details>
  `;
}

function filterRoles() {
  const search = document.querySelector("#role-search")?.value.trim().toLowerCase() || "";
  const market = document.querySelector("#market-filter")?.value || "all";
  const minScore = Number(document.querySelector("#score-filter")?.value || 0);
  const filtered = jobs.filter((job) => {
    const haystack = [
      job.title,
      job.company,
      job.location,
      job.sector,
      job.skills.join(" "),
      job.strengths.join(" "),
    ]
      .join(" ")
      .toLowerCase();
    return (
      (!search || haystack.includes(search)) &&
      (market === "all" || job.market === market) &&
      job.score >= minScore
    );
  });

  const list = document.querySelector("#role-list");
  const count = document.querySelector("#role-count");
  const empty = document.querySelector("#role-empty");
  const priority = filtered.filter((job) => job.tier === "Priority shortlist");
  const stretch = filtered.filter((job) => job.tier !== "Priority shortlist");
  if (list) {
    list.innerHTML = `
      ${
        priority.length
          ? `<div class="role-group-label">
              <div><strong>Priority shortlist</strong><span>Target-market roles with the clearest current fit</span></div>
              <b>${priority.length}</b>
            </div>${priority.map(renderRole).join("")}`
          : ""
      }
      ${
        stretch.length
          ? `<div class="role-group-label role-group-label--stretch">
              <div><strong>Stretch / blocked leads</strong><span>Useful source leads with a location, seniority, freshness, or specialization concern</span></div>
              <b>${stretch.length}</b>
            </div>${stretch.map(renderRole).join("")}`
          : ""
      }
    `;
  }
  if (count) count.textContent = String(filtered.length);
  if (empty) empty.hidden = filtered.length > 0;
}

["#role-search", "#market-filter", "#score-filter"].forEach((selector) => {
  document.querySelector(selector)?.addEventListener("input", filterRoles);
});

function trackSections() {
  const tabs = [...document.querySelectorAll(".case-tab[data-section]")];
  const sections = [...document.querySelectorAll(".observed-section")];
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      tabs.forEach((tab) => {
        const active = tab.dataset.section === visible.target.id;
        tab.classList.toggle("is-active", active);
        if (active) tab.setAttribute("aria-current", "location");
        else tab.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.1, 0.4] }
  );

  sections.forEach((section) => observer.observe(section));
}

renderHero();
renderContactSheet();
renderQuestions();
filterRoles();
trackSections();
requestAnimationFrame(() => document.body.classList.add("is-ready"));
