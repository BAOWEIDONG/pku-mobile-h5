/* =========================================================
   北京大学国际医院 · 医疗团队成员介绍
   ========================================================= */

(function () {
  "use strict";

  const TEAM = Array.isArray(window.MEDICAL_TEAM) ? window.MEDICAL_TEAM : [];
  const OPERATIONS = Array.isArray(window.OPERATIONS_TEAM) ? window.OPERATIONS_TEAM : [];
  const DETAILS = window.MEMBER_DETAILS || {};
  const idParam = new URLSearchParams(window.location.search).get("id") || "";
  const doctor = TEAM.find(item => String(item.id) === idParam);
  const operationsMember = doctor ? null : OPERATIONS.find(item => item.id === idParam);
  const member = doctor || operationsMember;
  const isOps = Boolean(operationsMember);
  const detail = DETAILS[idParam] || {};
  const content = document.getElementById("memberContent");

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function paragraphs(items, className) {
    if (!items || !items.length) return "";
    return `<div class="${className}">${items.map(item => `<p>${escapeHtml(item)}</p>`).join("")}</div>`;
  }

  function listSection(title, items) {
    if (!items || !items.length) return "";
    return `
      <section class="member-section">
        <h2>${title}</h2>
        <ul class="member-list">${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
    `;
  }

  if (!member) {
    content.innerHTML = `
      <div class="member-error">
        <h1>没有找到该成员</h1>
        <p>成员信息可能已更新，请返回医疗团队重新选择。</p>
        <a href="./team.html">返回医疗团队</a>
      </div>
    `;
    return;
  }

  document.title = `${member.name} · 医疗团队 · 北京大学国际医院`;
  const photo = member.photo ? `
    <img src="${escapeHtml(member.photo)}" alt="${escapeHtml(member.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'" />
  ` : "";
  const photoAlt = `<span class="member-photo-fallback"${member.photo ? ' style="display:none"' : ""}>${escapeHtml(member.name.slice(0, 1))}</span>`;
  const tags = isOps
    ? '<span class="member-badge">运营团队</span>'
    : [
        member.expert ? '<span class="member-badge">专家</span>' : "",
        ...(member.tags || []).map(tag => `<span class="member-tag">${escapeHtml(tag)}</span>`)
      ].join("");

  const qualification = member.qualification || "";
  const specialty = isOps ? qualification : (detail.specialty || member.specialty || "暂无详细介绍");
  const bio = isOps ? (member.bio || []) : (detail.bio || []);
  const appointments = isOps ? [] : (detail.appointments || []);
  const honors = isOps ? [] : (detail.honors || []);

  content.innerHTML = `
    <section class="member-hero">
      <div class="member-profile">
        <div class="member-photo">${photo}${photoAlt}</div>
        <div class="member-profile-copy">
          <p class="member-eyebrow">${isOps ? "OPERATIONS TEAM · PKU HEALTHCARE" : "PKU INTERNATIONAL HOSPITAL · TEAM"}</p>
          <h1>${escapeHtml(member.name)}</h1>
          <div class="member-role">${escapeHtml(member.role)}${tags}</div>
          <div class="member-dept">
            <svg class="ic ic-14"><use href="#i-hospital"/></svg>
            <span>${escapeHtml(isOps ? "营期服务团队" : (member.dept || "临床科室"))}</span>
          </div>
          <div class="member-hospital">${isOps ? escapeHtml(qualification) : `来源医院 · ${escapeHtml(member.hospital)}`}</div>
        </div>
      </div>
    </section>

    <section class="member-section specialty">
      <h2>${isOps ? "专业资质" : "擅长方向"}</h2>
      <p>${escapeHtml(specialty)}</p>
    </section>

    ${bio.length ? `
      <section class="member-section">
        <h2>${isOps ? "岗位介绍" : "医生简介"}</h2>
        ${paragraphs(bio)}
      </section>
    ` : ""}

    ${listSection("学术及社会任职", appointments)}
    ${listSection("荣誉与成果", honors)}

    ${!bio.length && !appointments.length && !honors.length ? `
      <section class="member-section">
        <h2>成员介绍</h2>
        <p class="member-empty">该成员的详细介绍暂未发布。</p>
      </section>
    ` : ""}
  `;
})();
