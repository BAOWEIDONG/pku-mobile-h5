/* =========================================================
   北大医疗 · 医疗服务网络品牌展示
   ========================================================= */

(function () {
  "use strict";

  const TEAM = Array.isArray(window.MEDICAL_TEAM) ? window.MEDICAL_TEAM : [];
  const NETWORK = [
    {
      region: "北京",
      names: "北京大学国际医院 · 北京北大医疗康复医院 · 方园中心 · 望京中心 · 北三环中心 · 金融街中心"
    },
    {
      region: "天津",
      names: "北大医疗海洋石油医院"
    },
    {
      region: "山东",
      names: "北大医疗鲁中医院 · 北大医疗淄博医院"
    },
    {
      region: "山西",
      names: "北大医疗潞安医院（含长治分院区）"
    },
    {
      region: "湖南",
      names: "北大医疗恺德心血管病医院"
    },
    {
      region: "广东",
      names: "深圳北医康复医院"
    }
  ];

  const $ = selector => document.querySelector(selector);

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderNetwork() {
    const wrap = $("#networkList");
    if (!wrap) return;
    wrap.innerHTML = NETWORK.map((item, index) => `
      <article class="network-card">
        <span class="network-index">${String(index + 1).padStart(2, "0")}</span>
        <div class="network-main">
          <div class="network-head">
            <b>${escapeHtml(item.region)}</b>
            <span>${item.region === "北京" ? "6 家" : item.region === "山东" ? "2 家" : "1 家"}</span>
          </div>
          <p class="network-names">${escapeHtml(item.names)}</p>
        </div>
      </article>
    `).join("");
  }

  function renderExperts() {
    const wrap = $("#featuredExperts");
    if (!wrap) return;
    const experts = TEAM.filter(item => item.expert).slice(0, 6);
    wrap.innerHTML = experts.map(item => {
      const initial = escapeHtml(item.name.slice(0, 1));
      const photo = item.photo
        ? `<img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'" /><span class="featured-fallback" style="display:none">${initial}</span>`
        : `<span class="featured-fallback">${initial}</span>`;
      return `
        <a class="featured-expert" href="./member.html?id=${item.id}">
          <span class="featured-photo">${photo}</span>
          <span class="featured-copy">
            <b>${escapeHtml(item.name)}</b>
            <span>${escapeHtml(item.role)} · ${escapeHtml(item.dept)}</span>
            <small>${escapeHtml(item.specialty).slice(0, 40)}</small>
          </span>
        </a>
      `;
    }).join("");
  }

  function renderDepartments() {
    const wrap = $("#departmentPills");
    if (!wrap) return;
    const map = new Map();
    TEAM.forEach(item => {
      String(item.dept || "").split(" / ").forEach(raw => {
        const name = raw.trim();
        if (!name) return;
        map.set(name, (map.get(name) || 0) + 1);
      });
    });
    const departments = [...map.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
      .slice(0, 10);
    wrap.innerHTML = departments.map(([name, count]) => `
      <span class="department-pill">${escapeHtml(name)} <b>${count}</b></span>
    `).join("");
  }

  renderNetwork();
  renderExperts();
  renderDepartments();
})();
