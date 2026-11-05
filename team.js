/* =========================================================
   北京大学国际医院 · 医疗团队
   Expert / doctor / nursing / department views
   ========================================================= */

(function () {
  "use strict";

  const TEAM = Array.isArray(window.MEDICAL_TEAM) ? window.MEDICAL_TEAM : [];
  const DEPARTMENTS = Array.isArray(window.DEPARTMENTS) ? window.DEPARTMENTS : [];
  const OPERATIONS = Array.isArray(window.OPERATIONS_TEAM) ? window.OPERATIONS_TEAM : [];
  const NURSING = { nurses: 107, bachelor: "61%", phd: 1, master: 15 };
  const DEPT_CATEGORIES = ["科室中心", "特色中心", "特色门诊"];
  const OPS_VIEWS = {
    "ops-supervisor": "运营督导",
    "ops-operations": "运营管家",
    "ops-health": "健管师",
    "ops-nutrition": "营养师",
    "ops-rehab": "康复师"
  };
  const validViews = ["experts", "doctors", "nursing", "departments", ...Object.keys(OPS_VIEWS)];
  const isOpsView = view => Object.prototype.hasOwnProperty.call(OPS_VIEWS, view);
  const params = new URLSearchParams(window.location.search);
  const initialView = validViews.includes(params.get("view")) ? params.get("view") : "doctors";
  const state = {
    view: initialView,
    role: "all",
    query: "",
    page: 1,
    pageSize: 24,
    deptCategory: DEPT_CATEGORIES.includes(params.get("cat")) ? params.get("cat") : "科室中心"
  };
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function roleClass(role) {
    if (role === "主任医师") return "role-chief";
    if (role === "副主任医师") return "role-deputy";
    if (role === "主治医师") return "role-attending";
    return "role-doctor";
  }

  function categoryBase() {
    if (state.view === "experts") return TEAM.filter(item => item.expert);
    if (state.view === "doctors") return TEAM;
    if (isOpsView(state.view)) return OPERATIONS.filter(item => item.role === OPS_VIEWS[state.view]);
    return [];
  }

  function getFiltered() {
    const query = state.query.trim().toLowerCase();
    return categoryBase().filter(item => {
      if (state.role !== "all" && item.role !== state.role) return false;
      if (!query) return true;
      const haystack = `${item.name} ${item.title || ""} ${item.role} ${item.dept || ""} ${item.hospital || ""} ${item.specialty || ""} ${item.qualification || ""} ${(item.tags || []).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  function departmentCategories() {
    return DEPT_CATEGORIES.map(category => ({
      category,
      count: DEPARTMENTS.filter(item => item.category === category).length
    }));
  }

  function departmentData() {
    const query = state.query.trim().toLowerCase();
    return DEPARTMENTS.filter(item => {
      if (item.category !== state.deptCategory) return false;
      if (!query) return true;
      const haystack = `${item.name} ${item.category} ${(item.intro || []).join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  function updateUrl() {
    const next = new URLSearchParams();
    if (state.view !== "doctors") next.set("view", state.view);
    if (state.view === "departments" && state.deptCategory !== "科室中心") next.set("cat", state.deptCategory);
    if (state.role !== "all") next.set("role", state.role);
    const query = next.toString();
    history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
  }

  function renderCategoryCards() {
    const counts = {
      experts: TEAM.filter(item => item.expert).length,
      doctors: TEAM.length,
      nursing: NURSING.nurses,
      ...Object.fromEntries(Object.entries(OPS_VIEWS).map(([view, role]) => [view, OPERATIONS.filter(item => item.role === role).length]))
    };
    $$("#teamCategories [data-view]").forEach(button => {
      const view = button.dataset.view;
      button.classList.toggle("is-active", state.view === view);
      const count = button.querySelector("b");
      if (count) count.textContent = counts[view];
    });
  }

  function renderDeptCategories() {
    const wrap = $("#deptCategories");
    if (!wrap) return;
    const counts = Object.fromEntries(departmentCategories().map(item => [item.category, item.count]));
    $$("[data-dept-category]", wrap).forEach(button => {
      const category = button.dataset.deptCategory;
      button.classList.toggle("is-active", state.deptCategory === category);
      const count = button.querySelector("b");
      if (count) count.textContent = counts[category] || 0;
    });
  }

  function renderRoleSummary() {
    const wrap = $("#roleSummary");
    if (!wrap) return;

    if (isOpsView(state.view)) {
      wrap.hidden = true;
      wrap.innerHTML = "";
      return;
    }

    wrap.hidden = false;
    wrap.className = `team-role-summary cat-${state.view === "experts" ? "experts" : state.view === "nursing" ? "nursing" : "doctors"}`;

    if (state.view === "nursing") {
      wrap.innerHTML = `<span class="role-summary-label">护理角色</span><span class="role-summary-chip">专科护士 <b>${NURSING.nurses}</b></span>`;
      return;
    }

    const base = categoryBase();
    const roles = ["主任医师", "副主任医师", "主治医师", "医师"];
    const chips = roles
      .map(role => ({ role, count: base.filter(item => item.role === role).length }))
      .filter(item => item.count > 0);
    wrap.innerHTML = `
      <span class="role-summary-label">职位角色${state.role !== "all" ? " · 再次点击取消" : ""}</span>
      ${chips.map(chip => `
        <button class="role-summary-chip${state.role === chip.role ? " is-active" : ""}" type="button" data-summary-role="${chip.role}">
          ${chip.role}<b>${chip.count}</b>
        </button>
      `).join("")}
    `;
  }

  function renderCard(item) {
    return `
      <article class="expert-card ${roleClass(item.role)}">
        <div class="expert-head">
          <span class="expert-avatar">
            ${item.photo ? `<img src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'" />` : ""}
            <span class="expert-avatar-fallback"${item.photo ? ' style="display:none"' : ""}>${escapeHtml(item.name.slice(0, 1))}</span>
          </span>
          <div class="expert-name">
            <h2>${escapeHtml(item.name)}</h2>
            <div class="expert-role">
              ${escapeHtml(item.role)}
              ${item.expert ? '<span class="expert-badge">专家</span>' : ""}
              ${(item.tags || []).map(tag => `<span class="expert-tag">${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
          <span class="expert-dept">${escapeHtml(item.dept)}</span>
        </div>
        <div class="expert-hospital">
          <svg class="ic ic-13"><use href="#i-hospital"/></svg>
          来源医院 <b>${escapeHtml(item.hospital)}</b>
        </div>
        <p class="expert-specialty">${escapeHtml(item.specialty)}</p>
        <a class="expert-link" href="./member.html?id=${item.id}">
          查看介绍详情 <svg class="ic ic-12"><use href="#i-arrow"/></svg>
        </a>
      </article>
    `;
  }

  function renderOpsCard(item) {
    return `
      <a class="ops-card role-${item.roleKey}" href="./member.html?id=${encodeURIComponent(item.id)}">
        <span class="ops-avatar">${escapeHtml(item.name.slice(0, 1))}</span>
        <div class="ops-copy">
          <div class="ops-name">
            <b>${escapeHtml(item.name)}</b>
            <span>${item.gender}</span>
          </div>
          <p class="ops-role">${escapeHtml(item.role)}</p>
          <small>${escapeHtml(item.qualification)}</small>
        </div>
      </a>
    `;
  }

  function deptIcon(name) {
    const rules = [
      [/呼吸|肺|胸外|结核/, "lung"],
      [/心|血管/, "heart"],
      [/神经|脑|精神|心理|睡眠/, "brain"],
      [/骨|关节|脊柱|风湿|康复/, "bone"],
      [/眼/, "eye"],
      [/口腔|牙/, "tooth"],
      [/妇|产|乳腺|生殖/, "women"],
      [/儿|新生|小婴/, "child"],
      [/消化|胃肠|肝|胆|胰|内镜/, "stomach"],
      [/肾|泌尿|血透|透析/, "kidney"],
      [/耳鼻|咽喉|耳/, "ent"],
      [/中医|中药|针灸/, "leaf"],
      [/麻醉|疼痛|重症|急诊|发热/, "pulse"]
    ];
    const match = rules.find(([pattern]) => pattern.test(name));
    return match ? match[1] : "cross";
  }

  function renderDepartmentCard(dept) {
    const icon = deptIcon(dept.name);
    const catClass = dept.category === "特色中心" ? "cat-special" : dept.category === "特色门诊" ? "cat-clinic" : "cat-center";
    return `
      <a class="dept-card ${catClass}" href="./department.html?id=${encodeURIComponent(dept.id)}">
        <span class="dept-icon"><svg class="ic ic-18"><use href="#i-dept-${icon}"/></svg></span>
        <span class="dept-card-main">
          <span class="dept-card-name">${escapeHtml(dept.name)}</span>
        </span>
        <svg class="ic ic-14"><use href="#i-arrow"/></svg>
      </a>
    `;
  }

  function setEmpty(copyTitle, copyText) {
    const empty = $("#teamEmpty");
    if (!empty) return;
    const title = empty.querySelector("b");
    const text = empty.querySelector("p");
    if (title) title.textContent = copyTitle;
    if (text) text.textContent = copyText;
  }

  function updateChrome() {
    const isNursing = state.view === "nursing";
    const isDepartments = state.view === "departments";
    const tools = $("#teamTools");
    const browse = $("#teamBrowse");
    const deptHead = $("#teamDeptHead");
    const deptCategories = $("#deptCategories");
    const nursingPanel = $("#nursingPanel");
    const expertList = $("#expertList");
    const deptList = $("#deptList");
    const isOps = isOpsView(state.view);

    if (tools) tools.hidden = isNursing;
    if (browse) browse.hidden = isDepartments;
    if (expertList) expertList.classList.toggle("is-ops", isOps);
    if (deptHead) deptHead.hidden = !isDepartments;
    if (deptCategories) deptCategories.hidden = !isDepartments;
    if (nursingPanel) nursingPanel.hidden = !isNursing;
    if (expertList) expertList.hidden = isNursing || isDepartments;
    if (deptList) deptList.hidden = !isDepartments;

    const search = $("#teamSearch");
    if (search) {
      search.placeholder = isDepartments ? "搜索科室名称" : isOps ? "搜索姓名或资质" : "搜索姓名、科室、角色或擅长方向";
    }
  }

  function render() {
    updateChrome();
    renderCategoryCards();
    renderDeptCategories();
    renderRoleSummary();

    const result = $("#teamResult");
    const moreWrap = $("#teamMoreWrap");
    const more = $("#teamMore");
    const isDepartments = state.view === "departments";
    const isNursing = state.view === "nursing";
    const query = state.query.trim().toLowerCase();

    if (isDepartments) {
      const departments = departmentData();
      const deptList = $("#deptList");
      if (deptList) deptList.innerHTML = departments.map(renderDepartmentCard).join("");
      if (result) result.textContent = query
        ? `找到 ${departments.length} 个科室`
        : `${state.deptCategory} · ${departments.length} 个科室`;
      if (moreWrap) moreWrap.hidden = true;
      if (deptList) deptList.hidden = false;
      $("#teamEmpty").hidden = departments.length > 0;
      if (departments.length === 0) setEmpty("没有找到匹配的科室", "尝试输入其他科室名称。");
      const clear = $("#teamClear");
      if (clear) clear.classList.toggle("is-visible", Boolean(state.query));
      return;
    }

    if (isNursing) {
      if (result) result.textContent = `国际护理 · ${NURSING.nurses} 位专科护士`;
      if (moreWrap) moreWrap.hidden = true;
      $("#teamEmpty").hidden = true;
      return;
    }

    if (isOpsView(state.view)) {
      const items = getFiltered();
      if (result) result.textContent = `${OPS_VIEWS[state.view]} · ${items.length} 位`;
      $("#expertList").innerHTML = items.map(renderOpsCard).join("");
      if (moreWrap) moreWrap.hidden = true;
      $("#teamEmpty").hidden = items.length > 0;
      if (items.length === 0) setEmpty("没有找到匹配的成员", "尝试搜索姓名或资质。");
      const clear = $("#teamClear");
      if (clear) clear.classList.toggle("is-visible", Boolean(state.query));
      return;
    }

    const items = getFiltered();
    const visible = items.slice(0, state.page * state.pageSize);
    if (result) {
      if (state.role !== "all") result.textContent = `${state.role} · ${items.length} 位`;
      else if (state.view === "experts") result.textContent = `共 ${items.length} 位专家`;
      else result.textContent = `共 ${items.length} 位医师`;
    }
    $("#expertList").innerHTML = visible.map(renderCard).join("");
    const remaining = items.length - visible.length;
    if (moreWrap && more) {
      moreWrap.hidden = remaining <= 0;
      if (remaining > 0) more.textContent = `加载更多成员（剩余 ${remaining}）`;
    }
    $("#teamEmpty").hidden = items.length > 0;
    if (items.length === 0) setEmpty("没有找到匹配的成员", "尝试姓名、科室、角色或擅长方向。");
    const clear = $("#teamClear");
    if (clear) clear.classList.toggle("is-visible", Boolean(state.query));
  }

  function setView(view) {
    state.view = view;
    state.role = "all";
    state.query = "";
    state.page = 1;
    if (view === "departments") state.deptCategory = "科室中心";
    const search = $("#teamSearch");
    if (search) search.value = "";
    updateUrl();
    render();
  }

  const search = $("#teamSearch");
  if (search) {
    search.addEventListener("input", event => {
      state.query = event.target.value;
      state.page = 1;
      render();
    });
  }

  $("#teamClear")?.addEventListener("click", () => {
    state.query = "";
    state.page = 1;
    if (search) {
      search.value = "";
      search.focus();
    }
    render();
  });

  $("#teamCategories")?.addEventListener("click", event => {
    const button = event.target.closest("[data-view]");
    if (!button) return;
    setView(button.dataset.view);
  });

  $("#deptCategories")?.addEventListener("click", event => {
    const button = event.target.closest("[data-dept-category]");
    if (!button) return;
    state.deptCategory = button.dataset.deptCategory;
    state.query = "";
    state.page = 1;
    if (search) search.value = "";
    updateUrl();
    render();
  });

  $("#roleSummary")?.addEventListener("click", event => {
    const button = event.target.closest("[data-summary-role]");
    if (!button) return;
    state.role = state.role === button.dataset.summaryRole ? "all" : button.dataset.summaryRole;
    state.page = 1;
    updateUrl();
    render();
  });

  $("#teamMore")?.addEventListener("click", () => {
    state.page += 1;
    render();
  });

  $("#teamEmptyReset")?.addEventListener("click", () => setView("doctors"));

  const doctorCount = $("#doctorCount");
  const expertCount = $("#expertCount");
  const deptCount = $("#deptCount");
  const nurseCount = $("#nurseCount");
  if (doctorCount) doctorCount.textContent = TEAM.length;
  if (expertCount) expertCount.textContent = TEAM.filter(item => item.expert).length;
  if (deptCount) deptCount.textContent = DEPARTMENTS.length;
  if (nurseCount) nurseCount.textContent = NURSING.nurses;

  const roleParam = params.get("role");
  if (roleParam && ["主任医师", "副主任医师", "主治医师", "医师"].includes(roleParam) && (initialView === "doctors" || initialView === "experts")) {
    state.role = roleParam;
  }

  render();
})();
