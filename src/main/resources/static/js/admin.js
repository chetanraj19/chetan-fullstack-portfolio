const $ = (selector) => document.querySelector(selector);
const state = { projects: [], skills: [], messages: [], profile: null };


async function api(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();

  // Read Spring Security's CSRF cookie.
  const csrfCookie = document.cookie
    .split("; ")
    .find(cookie => cookie.startsWith("XSRF-TOKEN="));

  const csrfToken = csrfCookie
    ? decodeURIComponent(csrfCookie.substring("XSRF-TOKEN=".length))
    : null;

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {})
  };

  // Send CSRF token for state-changing requests.
  if (!["GET", "HEAD", "OPTIONS", "TRACE"].includes(method)) {
    if (!csrfToken) {
      throw new Error(
        "CSRF token missing. Refresh the admin page and try again."
      );
    }
    headers["X-XSRF-TOKEN"] = csrfToken;
  }

  const response = await fetch(path, {
    ...options,
    method,
    headers,
    credentials: "same-origin"
  });

  if (response.status === 401) {
    throw new Error(
      "Admin authentication required. Refresh and enter your admin username/password in the browser prompt."
    );
  }

  if (response.status === 403) {
    throw new Error(
      "Access denied. Refresh the admin page; the CSRF token may be missing or expired."
    );
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({
    message: "Unexpected server response."
  }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}


function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}

function say(selector, message, error = false) {
  const element = $(selector);
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", error);
}

function projectPayload(form) {
  const data = Object.fromEntries(new FormData(form));
  return {
    title: data.title,
    category: data.category,
    description: data.description,
    stack: data.stack,
    github: normalizeOptionalUrl(data.github, "GitHub project URL"),
    icon: data.icon,
    status: data.status
  };
}

function skillPayload(form) {
  const data = Object.fromEntries(new FormData(form));
  return { name: data.name, group: data.group, level: Number(data.level) };
}

function normalizeOptionalUrl(value, label) {
  const input = String(value || "").trim();
  if (!input) return "";
  if (/https?:\/\/.*https?:\/\//i.test(input)) {
    throw new Error(`${label}: URL seems to contain a duplicated URL prefix. Keep only one https:// prefix.`);
  }

  let url;
  try {
    url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  } catch {
    throw new Error(`${label}: please enter a valid URL starting with https://.`);
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${label}: only HTTP or HTTPS links are allowed.`);
  }
  return url.href.replace(/\/$/, "");
}

function normalizeProfileUrl(value, kind) {
  const label = kind === "github" ? "GitHub profile URL" : "LinkedIn profile URL";
  const url = normalizeOptionalUrl(value, label);
  if (!url) return "";

  const parsed = new URL(url);
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

  if (kind === "github") {
    if (host !== "github.com" || !parsed.pathname.split("/").filter(Boolean)[0]) {
      throw new Error("GitHub URL must look like https://github.com/your-username.");
    }
    if (parsed.pathname.split("/").filter(Boolean).length > 1) {
      throw new Error("Please enter your GitHub profile URL, not a repository URL.");
    }
  } else {
    if (host !== "linkedin.com" || !/^\/in\/[^/]+\/?$/i.test(parsed.pathname)) {
      throw new Error("LinkedIn URL must look like https://www.linkedin.com/in/your-profile/.");
    }
  }
  return url;
}

function renderProjects() {
  $("#projectCount").textContent = String(state.projects.length).padStart(2, "0");
  $("#projectList").innerHTML = state.projects.map(project => `
    <article class="admin-item">
      <div>
        <strong>${esc(project.title)}</strong>
        <small>${esc(project.category)} · ${esc((project.stack || []).join(", "))}</small>
        <small>${esc(project.status)}</small>
      </div>
      <div class="admin-actions">
        <button class="small-button" data-edit-project="${project.id}" type="button">Edit</button>
        <button class="small-button danger" data-delete-project="${project.id}" type="button">Delete</button>
      </div>
    </article>`).join("") || '<p class="admin-sub">No projects found.</p>';
}

function renderSkills() {
  $("#skillCount").textContent = String(state.skills.length).padStart(2, "0");
  $("#skillList").innerHTML = state.skills.map(skill => `
    <article class="admin-item">
      <div><strong>${esc(skill.name)}</strong><small>${esc(skill.group)} · ${Number(skill.level)}%</small></div>
      <div class="admin-actions">
        <button class="small-button" data-edit-skill="${skill.id}" type="button">Edit</button>
        <button class="small-button danger" data-delete-skill="${skill.id}" type="button">Delete</button>
      </div>
    </article>`).join("") || '<p class="admin-sub">No skills found.</p>';
}

function renderMessages() {
  $("#messageCount").textContent = String(state.messages.length).padStart(2, "0");
  $("#messageList").innerHTML = state.messages.map(message => `
    <article class="admin-item message-item">
      <strong>${esc(message.subject)}</strong>
      <small>${esc(message.name)} · ${esc(message.email)} · ${esc(message.createdAt ? new Date(message.createdAt).toLocaleString() : "")}</small>
      <p>${esc(message.message)}</p>
    </article>`).join("") || '<p class="admin-sub">No messages yet.</p>';
}

function fillProfile(profile) {
  const form = $("#profileForm");
  if (!form || !profile) return;
  for (const key of ["name", "role", "email", "location", "githubUrl", "linkedinUrl", "availability", "targetRoles", "resumeUrl", "bio"]) {
    if (form.elements[key]) form.elements[key].value = profile[key] || "";
  }
}

async function load() {
  say("#globalStatus", "Loading data from MySQL…");
  const reloadButton = $("#reloadButton");
  if (reloadButton) reloadButton.disabled = true;

  try {
    const [projects, skills, messages, profile] = await Promise.all([
      api("/api/admin/projects"),
      api("/api/admin/skills"),
      api("/api/admin/messages"),
      api("/api/admin/profile")
    ]);
    state.projects = projects || [];
    state.skills = skills || [];
    state.messages = messages || [];
    state.profile = profile || null;
    renderProjects();
    renderSkills();
    renderMessages();
    fillProfile(profile);
    say("#globalStatus", "Connected. Data loaded from the backend.");
  } catch (error) {
    say("#globalStatus", error.message || "Could not load dashboard data.", true);
  } finally {
    if (reloadButton) reloadButton.disabled = false;
  }
}

function resetProject() {
  const form = $("#projectForm");
  form.reset();
  form.elements.id.value = "";
  $("#projectSubmit").textContent = "Add project ↗";
  $("#projectCancel").hidden = true;
}

function resetSkill() {
  const form = $("#skillForm");
  form.reset();
  form.elements.id.value = "";
  form.elements.level.value = 70;
  $("#skillSubmit").textContent = "Add skill ↗";
  $("#skillCancel").hidden = true;
}

$("#projectForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const id = form.elements.id.value;

  try {
    const payload = projectPayload(form);
    await api(id ? `/api/admin/projects/${id}` : "/api/admin/projects", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    say("#projectStatus", id ? "Project updated." : "Project added to MySQL.");
    resetProject();
    await load();
  } catch (error) {
    say("#projectStatus", error.message || "Could not save project.", true);
  }
});

$("#projectCancel").addEventListener("click", resetProject);
$("#skillCancel").addEventListener("click", resetSkill);
$("#reloadButton").addEventListener("click", load);

$("#projectList").addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit-project]");
  const deleteButton = event.target.closest("[data-delete-project]");

  if (editButton) {
    const project = state.projects.find(item => item.id === Number(editButton.dataset.editProject));
    if (!project) return;
    const form = $("#projectForm");
    form.elements.id.value = project.id;
    form.elements.title.value = project.title || "";
    form.elements.category.value = project.category || "Backend";
    form.elements.description.value = project.description || "";
    form.elements.stack.value = (project.stack || []).join(", ");
    form.elements.github.value = project.github === "#projects" ? "" : (project.github || "");
    form.elements.icon.value = project.icon || "";
    form.elements.status.value = project.status || "Featured";
    $("#projectSubmit").textContent = "Save changes ↗";
    $("#projectCancel").hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (deleteButton && confirm("Delete this project permanently?")) {
    try {
      await api(`/api/admin/projects/${deleteButton.dataset.deleteProject}`, { method: "DELETE" });
      say("#projectStatus", "Project deleted.");
      await load();
    } catch (error) {
      say("#projectStatus", error.message || "Could not delete project.", true);
    }
  }
});

$("#skillForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const id = form.elements.id.value;
  try {
    const payload = skillPayload(form);
    await api(id ? `/api/admin/skills/${id}` : "/api/admin/skills", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    say("#skillStatus", id ? "Skill updated." : "Skill added to MySQL.");
    resetSkill();
    await load();
  } catch (error) {
    say("#skillStatus", error.message || "Could not save skill.", true);
  }
});

$("#skillList").addEventListener("click", async event => {
  const editButton = event.target.closest("[data-edit-skill]");
  const deleteButton = event.target.closest("[data-delete-skill]");

  if (editButton) {
    const skill = state.skills.find(item => item.id === Number(editButton.dataset.editSkill));
    if (!skill) return;
    const form = $("#skillForm");
    form.elements.id.value = skill.id;
    form.elements.name.value = skill.name || "";
    form.elements.group.value = skill.group || "Backend";
    form.elements.level.value = skill.level ?? 70;
    $("#skillSubmit").textContent = "Save changes ↗";
    $("#skillCancel").hidden = false;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  if (deleteButton && confirm("Delete this skill permanently?")) {
    try {
      await api(`/api/admin/skills/${deleteButton.dataset.deleteSkill}`, { method: "DELETE" });
      say("#skillStatus", "Skill deleted.");
      await load();
    } catch (error) {
      say("#skillStatus", error.message || "Could not delete skill.", true);
    }
  }
});

$("#profileForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form));

  try {
    data.name = String(data.name || "").trim();
    data.role = String(data.role || "").trim();
    data.email = String(data.email || "").trim();
    data.location = String(data.location || "").trim();
    data.availability = String(data.availability || "").trim();
    data.targetRoles = String(data.targetRoles || "").trim();
    data.bio = String(data.bio || "").trim();

    if (!data.name || !data.role) {
      throw new Error("Please enter both your full name and professional title.");
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      throw new Error("Please enter a valid public email address.");
    }

    data.githubUrl = normalizeProfileUrl(data.githubUrl, "github");
    data.linkedinUrl = normalizeProfileUrl(data.linkedinUrl, "linkedin");
    data.resumeUrl = normalizeOptionalUrl(data.resumeUrl, "Resume URL");

    const saved = await api("/api/admin/profile", {
      method: "PUT",
      body: JSON.stringify(data)
    });
    state.profile = saved;
    fillProfile(saved);
    say("#profileStatus", "Profile and contact details saved to MySQL.");
    say("#globalStatus", "Profile settings saved successfully.");
  } catch (error) {
    say("#profileStatus", error.message || "Could not save profile settings.", true);
  }
});

load();
