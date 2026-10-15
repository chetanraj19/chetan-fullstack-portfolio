const API = "/api";
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

$("#year").textContent = new Date().getFullYear();

const roles = ["backend systems", "RESTful APIs", "useful software", "better solutions"];
let roleIndex = 0;
setInterval(() => {
  const el = $("#typedRole");
  if (!el) return;
  el.style.opacity = "0";
  setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    el.textContent = roles[roleIndex];
    el.style.opacity = "1";
  }, 220);
}, 2600);
$("#typedRole").style.transition = "opacity .2s";

$("#menuToggle").addEventListener("click", () => $("#navLinks").classList.toggle("open"));
$$(".nav-links a").forEach(link => link.addEventListener("click", () => $("#navLinks").classList.remove("open")));

const skillFilters = $("#skillFilters");
let allSkills = [];
function renderSkills(filter = "All") {
  const filtered = filter === "All" ? allSkills : allSkills.filter(skill => skill.group === filter);
  $("#skillsGrid").innerHTML = filtered.map((skill, index) => `
    <article class="skill-card" style="animation-delay:${index * 45}ms">
      <div class="skill-top"><span class="skill-name">${escapeHtml(skill.name)}</span><span class="skill-group">${escapeHtml(skill.group.toUpperCase())}</span></div>
      <div class="skill-meter"><span data-level="${Number(skill.level)}"></span></div>
      <span class="skill-percent">${Number(skill.level)}% <span style="color:#6f6c82">— self-assessed</span></span>
    </article>`).join("") || '<div class="loading-card">No skills in this category yet.</div>';
  requestAnimationFrame(() => $$("#skillsGrid .skill-meter span").forEach(bar => bar.style.width = `${bar.dataset.level}%`));
}
skillFilters.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  $$(".filter-chip").forEach(chip => chip.classList.toggle("active", chip === button));
  renderSkills(button.dataset.filter);
});

function renderProjects(projects) {
  $("#projectCount").textContent = String(projects.length).padStart(2, "0");
  $("#projectsGrid").innerHTML = projects.map((project, index) => `
    <article class="project-card" style="animation:appear .4s ${index * 90}ms both">
      <div class="project-card-top"><div class="project-icon">${escapeHtml(project.icon || "⌘")}</div><span class="project-status">${escapeHtml(project.status || "Project")}</span></div>
      <div class="project-category">${escapeHtml((project.category || "DEVELOPMENT").toUpperCase())}</div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="stack-list">${(project.stack || []).map(tech => `<span>${escapeHtml(tech)}</span>`).join("")}</div>
      <a class="project-link" href="${safeUrl(project.github)}" target="_blank" rel="noreferrer">Explore project <span>↗</span></a>
    </article>`).join("");
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function safeUrl(value) {
  try { const url = new URL(value, window.location.origin); return ["https:", "http:"].includes(url.protocol) ? escapeHtml(url.href) : "#projects"; }
  catch { return "#projects"; }
}

async function loadPortfolioData() {
  try {
    const [skillsResponse, projectsResponse, profileResponse] = await Promise.all([
      fetch(`${API}/skills`), fetch(`${API}/projects`), fetch(`${API}/profile`)
    ]);
    if (!skillsResponse.ok || !projectsResponse.ok || !profileResponse.ok) throw new Error("API unavailable");
    allSkills = await skillsResponse.json();
    const projects = await projectsResponse.json();
    const profile = await profileResponse.json();
    renderSkills();
    renderProjects(projects);
    $("#availability").textContent = (profile.availability || "Open to opportunities").toUpperCase();
    const setText = (selector, value) => { const el = $(selector); if (el && value) el.textContent = value; };
    setText("#heroName", profile.name);
    setText("#heroBio", profile.bio);
    setText("#contactIntro", profile.bio);
    setText("#contactEmail", profile.email);
    setText("#contactGithub", profile.githubUrl ? "GitHub profile ↗" : "GitHub profile");
    setText("#contactLinkedin", profile.linkedinUrl ? "LinkedIn profile ↗" : "LinkedIn profile");
    setText("#availabilityTitle", profile.availability || "Open to opportunities");
    setText("#targetRoles", profile.targetRoles);
    if (profile.email) $("#emailLink").href = "mailto:" + profile.email;
    if (profile.githubUrl && safeUrl(profile.githubUrl) !== "#projects") $("#githubLink").href = safeUrl(profile.githubUrl);
    if (profile.linkedinUrl && safeUrl(profile.linkedinUrl) !== "#projects") $("#linkedinLink").href = safeUrl(profile.linkedinUrl);
    if (profile.resumeUrl && safeUrl(profile.resumeUrl) !== "#projects") {
      const resumeLink = document.querySelector("#resumeLink");
      if (resumeLink) resumeLink.href = safeUrl(profile.resumeUrl);
    }
  } catch (error) {
    $("#skillsGrid").innerHTML = '<div class="loading-card">Could not load skills. Make sure the Spring Boot app is running.</div>';
    $("#projectsGrid").innerHTML = '<div class="loading-card">Could not load projects. Make sure the Spring Boot app is running.</div>';
    console.error("Portfolio API error:", error);
  }
}
loadPortfolioData();

$("#contactForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = $("#formStatus");
  const submit = form.querySelector("button[type=submit]");
  const label = $("#submitLabel");
  status.textContent = "";
  status.classList.remove("error");
  submit.disabled = true;
  label.textContent = "Sending…";
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch(`${API}/contact`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Please check your details and try again.");
    status.textContent = "✓ " + result.message;
    form.reset();
  } catch (error) {
    status.textContent = error.message || "Could not send your message. Please try again.";
    status.classList.add("error");
  } finally {
    submit.disabled = false;
    label.textContent = "Send message";
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .12});
$$(".reveal").forEach(element => observer.observe(element));
