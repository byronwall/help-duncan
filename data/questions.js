window.SEARCH_QUESTIONS = [
  {
    id: "titles",
    prompt: "Which five job titles feel most accurate, and how would you rank them?",
    why: "Title ranking controls the search vocabulary and prevents adjacent but unwanted roles from crowding the shortlist.",
  },
  {
    id: "next-work",
    prompt: "What work do you want to spend most of the next role doing each week?",
    why: "Daily-work preference matters more than a broad title when comparing engineering, governance, quality, and analytics roles.",
  },
  {
    id: "avoid-work",
    prompt: "Which responsibilities do you want less of, even if you are good at them?",
    why: "A credible exclusion list stops the agent from optimizing for experience Duncan does not want to repeat.",
  },
  {
    id: "proof",
    prompt: "Which three accomplishments are you proudest of, and what changed because of each?",
    why: "The current resume explains scope but needs sharper outcomes and evidence.",
  },
  {
    id: "metrics",
    prompt: "What metrics can you verify: time saved, errors prevented, refresh speed, users served, releases, or datasets automated?",
    why: "Verified numbers can turn competent bullets into persuasive proof without inventing claims.",
  },
  {
    id: "salary",
    prompt: "What are your minimum, target, and excellent base-salary ranges?",
    why: "Compensation bands are currently unknown, so salary cannot yet be used as a reliable filter.",
  },
  {
    id: "remote",
    prompt: "Would you accept fully remote, hybrid, and on-site work—and how would you rank them?",
    why: "“Remote or DC” is broad; a ranked preference changes which roles deserve the fastest response.",
  },
  {
    id: "commute",
    prompt: "For DC-area roles, how many days per week and how far are you willing to commute?",
    why: "A practical radius should include or exclude DC, Northern Virginia, Montgomery County, and Frederick-area options.",
  },
  {
    id: "authorization",
    prompt: "What work-authorization or sponsorship constraints should an agent apply?",
    why: "Remote eligibility and employer requirements must be checked before treating a listing as actionable.",
  },
  {
    id: "clearance",
    prompt: "Do you hold a clearance, have you held one, or would you pursue a role requiring one?",
    why: "The DC market includes federal and contractor roles where clearance changes the viable pool.",
  },
  {
    id: "employment",
    prompt: "Are full-time, contract, contract-to-hire, and consulting roles all acceptable?",
    why: "Several strong governance and integration listings are contracts rather than permanent positions.",
  },
  {
    id: "industries",
    prompt: "Which industries are most appealing, and which are firm exclusions?",
    why: "His experience maps naturally to finance, government, health, compliance, data vendors, and B2B software—but preference is unknown.",
  },
  {
    id: "company",
    prompt: "What company sizes or stages fit best: startup, mid-market, public tech, government, nonprofit, or contractor?",
    why: "The operating environment changes role breadth, stability, tooling, and expectations.",
  },
  {
    id: "scope",
    prompt: "Do you want to remain an individual contributor, mentor informally, lead programs, or manage people?",
    why: "The current pool includes senior IC, staff, lead, manager, and director-adjacent listings.",
  },
  {
    id: "travel",
    prompt: "How much travel is acceptable, including occasional customer or office visits?",
    why: "Some remote listings include travel that is easy to miss in a job-board summary.",
  },
  {
    id: "domains",
    prompt: "Which domain experience should lead the story: regulatory finance, geospatial, CRM, public data, governance, or platform operations?",
    why: "Choosing a lead domain determines which resume variant and employer set will feel most coherent.",
  },
  {
    id: "skills",
    prompt: "Which listed tools are current hands-on strengths, and which should be removed or de-emphasized?",
    why: "A tight resume should distinguish active expertise from older exposure and keyword clutter.",
  },
  {
    id: "learning",
    prompt: "Which common gaps would you actively learn—cloud, dbt, Snowflake, Databricks, Airflow—and which are deal-breakers?",
    why: "Many adjacent roles ask for modern cloud tooling not shown in the source resume.",
  },
  {
    id: "application",
    prompt: "How much application authority should the agent have: research only, draft materials, or submit after approval?",
    why: "Clear authority protects Duncan from inaccurate answers and unwanted submissions.",
  },
  {
    id: "timing",
    prompt: "When do you want to start, how urgent is the search, and how many tailored applications per week are realistic?",
    why: "Timing determines freshness filters, prioritization, and whether the process favors depth or volume.",
  },
];
