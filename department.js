/* =========================================================
   北京大学国际医院 · 科室介绍
   ========================================================= */

(function () {
  "use strict";

  const DEPARTMENTS = Array.isArray(window.DEPARTMENTS) ? window.DEPARTMENTS : [];
  const id = new URLSearchParams(window.location.search).get("id");
  const dept = DEPARTMENTS.find(item => String(item.id) === String(id));
  const content = document.getElementById("deptContent");

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (!dept) {
    content.innerHTML = `
      <div class="dept-error">
        <h1>没有找到该科室</h1>
        <p>科室信息可能已更新，请返回科室列表重新选择。</p>
        <a href="./team.html?view=departments">返回科室列表</a>
      </div>
    `;
    return;
  }

  document.title = `${dept.name} · 科室介绍 · 北京大学国际医院`;
  const paragraphs = (dept.intro || []).filter(Boolean);
  const intro = paragraphs.length
    ? paragraphs.map(item => `<p>${escapeHtml(item)}</p>`).join("")
    : '<p class="dept-empty">该科室详细介绍暂未发布。</p>';

  const photoMarkup = (person, large) => `
    <span class="dept-person-photo${large ? " is-large" : ""}">
      ${person.photo ? `<img src="${escapeHtml(person.photo)}" alt="${escapeHtml(person.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'" />` : ""}
      <span class="dept-person-fallback"${person.photo ? ' style="display:none"' : ""}>${escapeHtml(person.name.slice(0, 1))}</span>
    </span>
  `;

  const personLink = person => person.memberId
    ? `./member.html?id=${person.memberId}`
    : person.profile;

  const leaderSection = (dept.leaders || []).length ? `
    <section class="dept-section">
      <h2>学科带头人</h2>
      <div class="dept-leaders">
        ${dept.leaders.map(person => `
          <a class="dept-leader-card" href="${escapeHtml(personLink(person))}">
            ${photoMarkup(person, true)}
            <span class="dept-leader-copy">
              <b>${escapeHtml(person.name)}</b>
              <span>${escapeHtml(person.title || "学科带头人")}</span>
              <small>查看成员介绍 <svg class="ic ic-12"><use href="#i-arrow"/></svg></small>
            </span>
          </a>
        `).join("")}
      </div>
    </section>
  ` : "";

  const teamSection = (dept.doctors || []).length ? `
    <section class="dept-section">
      <h2>医生团队</h2>
      <div class="dept-doctors">
        ${dept.doctors.map(person => `
          <a class="dept-doctor-card" href="${escapeHtml(personLink(person))}">
            ${photoMarkup(person, false)}
            <span class="dept-doctor-copy">
              <b>${escapeHtml(person.name)}</b>
              <span>${escapeHtml(person.title || "医师")}</span>
            </span>
          </a>
        `).join("")}
      </div>
    </section>
  ` : "";

  const featureSection = (dept.features || []).length ? `
    <section class="dept-section">
      <h2>科室特色</h2>
      <div class="dept-features">
        ${dept.features.map(feature => `
          <article class="dept-feature">
            ${feature.tag ? `<span class="dept-feature-tag">${escapeHtml(feature.tag)}</span>` : ""}
            <h3>${escapeHtml(feature.title || "科室特色")}</h3>
            <p>${escapeHtml(feature.desc || "")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  ` : "";

  content.innerHTML = `
    <section class="dept-hero">
      <span class="dept-category">${escapeHtml(dept.category || "科室中心")}</span>
      <h1>${escapeHtml(dept.name)}</h1>
      <p class="dept-sub">北京大学国际医院 · 科室介绍</p>
    </section>

    <section class="dept-section">
      <h2>科室介绍</h2>
      ${intro}
    </section>

    ${featureSection}
    ${leaderSection}
    ${teamSection}

  `;
})();
