/* =========================================================
   北大医疗集团 · 医疗服务网络（手机版）
   ========================================================= */

(function () {
  "use strict";

  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  const TYPES = {
    general: { key: "general", name: "综合医院", icon: "hospital", color: "#2e6f96" },
    rehab: { key: "rehab", name: "康复医院", icon: "activity", color: "#2f7f78" },
    specialty: { key: "specialty", name: "专科医院", icon: "heart", color: "#9a5f6d" },
    center: { key: "center", name: "健康管理中心", icon: "building", color: "#b7864e" }
  };

  const REGIONS = [
    { id: "beijing", name: "北京地区", short: "北京", city: "北京市", color: "#2c6e9b", summary: "综合 · 康复 · 健管" },
    { id: "tianjin", name: "天津地区", short: "天津", city: "天津市", color: "#3d86ad", summary: "滨海综合医疗" },
    { id: "shandong", name: "山东地区", short: "山东", city: "淄博市", color: "#2f7f78", summary: "淄博综合医疗" },
    { id: "shanxi", name: "山西地区", short: "山西", city: "长治市", color: "#557a96", summary: "长治综合医疗" },
    { id: "hunan", name: "湖南地区", short: "湖南", city: "株洲市", color: "#9a5f6d", summary: "心血管专科" },
    { id: "guangdong", name: "广东地区", short: "广东", city: "深圳市", color: "#b7864e", summary: "深圳康复医疗" }
  ];

  const TEAM_ROLES = [
    {
      key: "supervisor",
      name: "运营督导",
      icon: "eye",
      desc: "作为项目督导，查看所有营的运营情况，负责跨营期督导与质量把控。",
      members: [
        { name: "张伟", gender: "男", qualification: "项目督导 · 医院管理" }
      ]
    },
    {
      key: "operations",
      name: "运营管家",
      icon: "users",
      desc: "每个营期的负责人，统筹医师、健管师、营养师、康复师，组成营期服务团队，服务所负责营期。",
      members: [
        { name: "孙敏", gender: "女", qualification: "营期运营负责人 · 健康管理师" },
        { name: "何佳", gender: "女", qualification: "营期运营专员 · 健康管理师" }
      ]
    },
    {
      key: "doctor",
      name: "医师",
      icon: "stethoscope",
      desc: "负责健康评估、疾病筛查、诊疗方案与医学支持。",
      members: [
        { name: "李静", gender: "女", qualification: "副主任医师 · 全科医学" },
        { name: "周明", gender: "男", qualification: "主治医师 · 内科" }
      ]
    },
    {
      key: "health-manager",
      name: "健管师",
      icon: "clipboard",
      desc: "负责健康档案、营期计划执行、日常随访与健康指导。",
      members: [
        { name: "王琳", gender: "女", qualification: "健康管理师 · 健康管理" },
        { name: "赵倩", gender: "女", qualification: "健康管理师 · 慢病管理" }
      ]
    },
    {
      key: "nutritionist",
      name: "营养师",
      icon: "leaf",
      desc: "负责营养评估、膳食方案与营养干预。",
      members: [
        { name: "陈晓", gender: "女", qualification: "注册营养师 · 临床营养" }
      ]
    },
    {
      key: "rehab",
      name: "康复师",
      icon: "activity",
      desc: "负责康复评估、训练方案与功能恢复指导。",
      members: [
        { name: "刘洋", gender: "男", qualification: "康复治疗师 · 运动康复" }
      ]
    }
  ];

  const INSTITUTIONS = [
    { id: "pku-international", region: "beijing", type: "general", name: "北京大学国际医院", fullName: "北京大学国际医院", subtitle: "", address: "北京市昌平区中关村生命科学园生命园路1号", phone: "010-69007777", aliases: "北大国际医院 PKU International Hospital" },
    { id: "pku-rehab-beijing", region: "beijing", type: "rehab", name: "北京北大医疗康复医院", fullName: "北京北大医疗康复医院", subtitle: "", address: "北京市昌平区中关村生命科学园生命园路8号院7号楼", phone: "010-60849596", aliases: "北大医疗康复医院" },
    { id: "fangyuan-center", region: "beijing", type: "center", name: "方园中心", fullName: "方园中心（北京怡健殿方园门诊部）", subtitle: "北京怡健殿方园门诊部", address: "北京市海淀区中关村南大街甲56号方园大厦商务楼4层", phone: "400-660-3886", aliases: "方园中心 北京怡健殿方园门诊部 怡健殿" },
    { id: "wangjing-center", region: "beijing", type: "center", name: "望京中心", fullName: "望京中心（北京怡健殿望京诊所）", subtitle: "北京怡健殿望京诊所", address: "北京市朝阳区广顺北大街33号福泰中心1-2层", phone: "400-660-3886", aliases: "望京中心 北京怡健殿望京诊所 怡健殿" },
    { id: "beisanhuan-center", region: "beijing", type: "center", name: "北三环中心", fullName: "北三环中心（北京怡健殿北三环门诊部）", subtitle: "北京怡健殿北三环门诊部", address: "北京市海淀区北太平庄18号城建大厦西门C座1-2层", phone: "400-660-3886", aliases: "北三环中心 北京怡健殿北三环门诊部 怡健殿" },
    { id: "financial-street-center", region: "beijing", type: "center", name: "金融街中心", fullName: "金融街中心（北京怡健殿诊所）", subtitle: "北京怡健殿诊所", address: "北京市西城区金融街5号新盛大厦B座1-3层", phone: "400-660-3886", aliases: "金融街中心 北京怡健殿诊所 怡健殿" },
    { id: "ocean-oil-hospital", region: "tianjin", type: "general", name: "北大医疗海洋石油医院", fullName: "北大医疗海洋石油医院", subtitle: "", address: "天津市滨海新区中心商务区渤海石油路10号", phone: "022-25805500", aliases: "北大医疗海洋石油医院 海洋石油医院" },
    { id: "luzhong-hospital", region: "shandong", type: "general", name: "北大医疗鲁中医院", fullName: "北大医疗鲁中医院", subtitle: "", address: "山东省淄博市临淄区太公路65号", phone: "0533-7698050", aliases: "北大医疗鲁中医院 鲁中医院" },
    { id: "zibo-hospital", region: "shandong", type: "general", name: "北大医疗淄博医院", fullName: "北大医疗淄博医院", subtitle: "", address: "山东省淄博市张店区山铝宿舍西山五街2号", phone: "0533-2344485", aliases: "北大医疗淄博医院 淄博医院" },
    { id: "luan-hospital", region: "shanxi", type: "general", name: "北大医疗潞安医院", fullName: "北大医疗潞安医院", subtitle: "含长治分院区", address: "山西省长治市襄垣县侯堡镇北大医疗潞安医院", branch: "长治分院区：长治市威远门北路37号国税大厦旁", phone: "0355-5922495", aliases: "北大医疗潞安医院 潞安医院 长治分院区" },
    { id: "kaide-hospital", region: "hunan", type: "specialty", name: "北大医疗恺德心血管病医院", fullName: "北大医疗恺德心血管病医院", subtitle: "", address: "湖南省株洲市荷塘区茨菇塘街道恺德路99号", phone: "0731-22222100", aliases: "北大医疗恺德心血管病医院 恺德心血管病医院" },
    { id: "shenzhen-rehab", region: "guangdong", type: "rehab", name: "深圳北医康复医院", fullName: "深圳北医康复医院", subtitle: "", address: "深圳市宝安区西乡街道铁岗社区鸿鹏大厦1栋101及整栋", phone: "0755-33269799", aliases: "深圳北医康复医院 北医康复医院" }
  ];

  const state = { region: "all", type: "all", draftType: "all", query: "" };

  const regionById = id => REGIONS.find(item => item.id === id);
  const typeByKey = key => TYPES[key];
  const institutionById = id => INSTITUTIONS.find(item => item.id === id);

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function icon(name, cls) {
    return `<svg class="ic ${cls || "ic-14"}"><use href="#i-${name}"></use></svg>`;
  }

  function regionCount(id) {
    return INSTITUTIONS.filter(item => item.region === id).length;
  }

  function typeCount(key) {
    return INSTITUTIONS.filter(item => item.type === key).length;
  }

  function filterItems(regionId, typeKey, rawQuery) {
    const query = String(rawQuery || "").trim().toLowerCase();
    return INSTITUTIONS.filter(item => {
      const region = regionById(item.region);
      const type = typeByKey(item.type);
      if (regionId !== "all" && item.region !== regionId) return false;
      if (typeKey !== "all" && item.type !== typeKey) return false;
      if (!query) return true;
      const haystack = `${item.name} ${item.fullName} ${item.subtitle} ${item.address} ${item.branch || ""} ${item.phone} ${item.aliases} ${region.name} ${type.name}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  function renderOrg() {
    const grid = $("#mOrgGrid");
    if (!grid) return;
    grid.innerHTML = REGIONS.map(region => `
      <button class="m-org-region${state.region === region.id ? " is-active" : ""}" type="button" data-region="${region.id}">
        <span class="m-region-dot" style="--region-color:${region.color}"></span>
        <span class="m-org-region-name"><b>${region.short}</b><small>${region.city}</small></span>
        <small class="m-org-region-count"><b>${regionCount(region.id)}</b>家</small>
      </button>
    `).join("");
  }

  function renderCard(item) {
    const region = regionById(item.region);
    const type = typeByKey(item.type);
    const phoneHref = `tel:${item.phone.replace(/[^\d+]/g, "")}`;
    return `
      <article class="m-card" data-institution="${item.id}" style="--accent:${region.color}">
        <div class="m-card-top">
          <span class="m-card-mark">${icon(type.icon, "ic-17")}</span>
          <div class="m-card-tags">
            <span class="m-type-tag type-${type.key}">${type.name}</span>
            <span class="m-region-tag">${region.short}</span>
          </div>
        </div>
        <h3>${escapeHtml(item.name)}</h3>
        ${item.subtitle ? `<p class="m-card-sub">${escapeHtml(item.subtitle)}</p>` : ""}
        <div class="m-info">
          <div class="m-info-row">
            ${icon("pin", "ic-12")}
            <span class="m-info-label">地址</span>
            <span class="m-info-value">${escapeHtml(item.address)}</span>
          </div>
          <div class="m-info-row">
            ${icon("phone", "ic-12")}
            <span class="m-info-label">电话</span>
            <a class="m-phone" href="${phoneHref}" onclick="event.stopPropagation()">${escapeHtml(item.phone)}</a>
          </div>
          <div class="m-info-row">
            ${icon(type.icon, "ic-12")}
            <span class="m-info-label">类型</span>
            <span class="m-info-value">${type.name}</span>
          </div>
        </div>
        <div class="m-card-actions">
          <a class="m-action primary" href="${phoneHref}" onclick="event.stopPropagation()">
            ${icon("phone", "ic-12")}拨打电话
          </a>
          <button class="m-action secondary" type="button" data-copy="${escapeHtml(item.address)}">
            ${icon("copy", "ic-12")}复制地址
          </button>
        </div>
        <button class="m-detail-link" type="button" data-detail="${item.id}">
          查看机构详情 ${icon("chev-right", "ic-12")}
        </button>
      </article>
    `;
  }

  function renderList() {
    const list = $("#mList");
    const empty = $("#mEmpty");
    const result = $("#mResult");
    if (!list) return;
    const items = filterItems(state.region, state.type, state.query);
    const region = state.region === "all" ? null : regionById(state.region);
    const type = state.type === "all" ? null : typeByKey(state.type);
    let text = `共 ${items.length} 家机构`;
    if (state.query.trim()) text = `找到 ${items.length} 家机构`;
    else if (region) text = `${region.short} · ${items.length} 家机构`;
    else if (type) text = `${type.name} · ${items.length} 家机构`;
    if (result) result.textContent = text;

    list.innerHTML = items.map(renderCard).join("");
    list.hidden = items.length === 0;
    if (empty) empty.hidden = items.length > 0;

    const clear = $("#mClear");
    if (clear) clear.classList.toggle("is-visible", Boolean(state.query));
    const badge = $("#mFilterBadge");
    if (badge) {
      badge.hidden = state.type === "all";
      badge.textContent = state.type === "all" ? "" : "1";
    }
  }

  function renderAll() {
    renderOrg();
    renderList();
  }

  /* ---------------------------------------------------------
     Filter sheet
     --------------------------------------------------------- */

  const backdrop = $("#mBackdrop");
  const filterSheet = $("#mFilterSheet");
  const detailSheet = $("#mDetailSheet");
  let activeSheet = null;

  function closeSheets() {
    [filterSheet, detailSheet].forEach(sheet => {
      if (!sheet) return;
      sheet.classList.remove("is-open");
      sheet.setAttribute("aria-hidden", "true");
    });
    backdrop?.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
    activeSheet = null;
  }

  // 微信安卓侧滑返回时优先关闭已打开的面板
  window.__pkuCloseOverlay = function () {
    if (!activeSheet) return false;
    closeSheets();
    return true;
  };

  function openSheet(sheet) {
    if (!sheet) return;
    closeSheets();
    activeSheet = sheet;
    sheet.classList.add("is-open");
    sheet.removeAttribute("aria-hidden");
    backdrop?.classList.add("is-open");
    document.body.classList.add("no-scroll");
  }

  function draftCount() {
    return filterItems(state.region, state.draftType, state.query).length;
  }

  function renderTypeOptions() {
    const wrap = $("#mTypeOptions");
    if (!wrap) return;
    const options = [
      { key: "all", name: "全部类型", icon: "building", count: INSTITUTIONS.length },
      ...Object.values(TYPES).map(type => ({
        key: type.key,
        name: type.name,
        icon: type.icon,
        count: typeCount(type.key)
      }))
    ];
    wrap.innerHTML = options.map(option => `
      <button class="m-type-option${state.draftType === option.key ? " is-active" : ""}" type="button" data-type-draft="${option.key}">
        <span class="m-type-option-icon">${icon(option.icon, "ic-16")}</span>
        <span class="m-type-option-copy"><b>${option.name}</b><small>全集团 ${option.count} 家机构</small></span>
        <span class="m-type-check">${icon("check", "ic-11")}</span>
      </button>
    `).join("");
    const apply = $("#mFilterApply");
    if (apply) apply.textContent = `查看 ${draftCount()} 家机构`;
  }

  function openFilter() {
    state.draftType = state.type;
    renderTypeOptions();
    openSheet(filterSheet);
  }

  document.querySelectorAll("[data-open-type-filter]").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      openFilter();
    });
  });

  /* ---------------------------------------------------------
     Detail
     --------------------------------------------------------- */

  function teamSection() {
    const totalMembers = TEAM_ROLES.reduce((sum, role) => sum + role.members.length, 0);
    return `
      <section class="m-team">
        <div class="m-team-head">
          <div>
            <p class="m-team-eyebrow">TEAM STRUCTURE</p>
            <h3>机构团队结构</h3>
          </div>
          <div class="m-team-side">
            <span class="m-team-total">${totalMembers} 人 · ${TEAM_ROLES.length} 个角色</span>
            <button class="m-team-toggle" type="button" data-team-toggle>收起全部</button>
          </div>
        </div>

        <div class="m-team-flow" aria-label="营期角色协作关系">
          <div class="m-flow-step">
            <span class="m-flow-index">01</span>
            <div><b>运营督导</b><small>查看所有营的运营情况，负责跨营期督导</small></div>
          </div>
          <span class="m-flow-line"></span>
          <div class="m-flow-step">
            <span class="m-flow-index">02</span>
            <div><b>运营管家</b><small>每个营期的负责人，统筹全部服务角色</small></div>
          </div>
          <span class="m-flow-line"></span>
          <div class="m-flow-step">
            <span class="m-flow-index">03</span>
            <div><b>医师 · 健管师 · 营养师 · 康复师</b><small>共同组成营期服务团队，服务所负责营期</small></div>
          </div>
        </div>

        <div class="m-team-roles">
          ${TEAM_ROLES.map(role => {
            const open = true;
            return `
              <article class="m-team-role role-${role.key}">
                <div class="m-team-role-head">
                  <span class="m-role-icon">${icon(role.icon, "ic-18")}</span>
                  <div class="m-role-title">
                    <div class="m-role-name">
                      <b>${role.name}</b>
                      <span class="m-role-meta">
                        <span class="m-role-count">${role.members.length} 人</span>
                        <button class="m-role-toggle" type="button" data-role-toggle="${role.key}" aria-expanded="${open}">
                          ${open ? "收起" : "展开"} ${icon("chev", "ic-12")}
                        </button>
                      </span>
                    </div>
                    <p>${role.desc}</p>
                  </div>
                </div>
                <div class="m-team-members${open ? "" : " is-collapsed"}" data-role-members="${role.key}">
                  ${role.members.map(member => `
                    <div class="m-team-member">
                      <span class="m-member-avatar">${escapeHtml(member.name.slice(0, 1))}</span>
                      <div class="m-member-main">
                        <div class="m-member-line">
                          <b>${escapeHtml(member.name)}</b>
                          <span class="m-member-gender">${member.gender}</span>
                        </div>
                        <p class="m-member-qual">${escapeHtml(member.qualification)}</p>
                      </div>
                    </div>
                  `).join("")}
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }

  function openDetail(id) {
    const item = institutionById(id);
    if (!item || !detailSheet) return;
    const region = regionById(item.region);
    const type = typeByKey(item.type);
    const phoneHref = `tel:${item.phone.replace(/[^\d+]/g, "")}`;
    const sameRegion = INSTITUTIONS.filter(other => other.region === item.region && other.id !== item.id);
    $("#mDetailContent").innerHTML = `
      <div class="m-detail-head">
        <p class="m-detail-breadcrumb">北大医疗集团 / ${region.name} / ${escapeHtml(item.name)}</p>
        <div class="m-detail-tags"><span>${type.name}</span><span>${region.name}</span></div>
        <h2>${escapeHtml(item.fullName)}</h2>
        <p>${escapeHtml(item.subtitle || region.summary)}</p>
      </div>
      <div class="m-detail-body">
        <div class="m-detail-section">
          <h3>机构地址</h3>
          <p>${escapeHtml(item.address)}</p>
          ${item.branch ? `<p>${escapeHtml(item.branch)}</p>` : ""}
        </div>
        <div class="m-detail-section">
          <h3>联系电话</h3>
          <a class="m-detail-phone" href="${phoneHref}">${escapeHtml(item.phone)}</a>
        </div>
        <div class="m-detail-section">
          <h3>机构类型</h3>
          <p>${type.name}</p>
        </div>
        <div class="m-detail-actions">
          <a class="m-detail-action primary" href="${phoneHref}">${icon("phone", "ic-13")}拨打电话</a>
          <button class="m-detail-action secondary" type="button" data-copy="${escapeHtml(item.address)}">${icon("copy", "ic-13")}复制地址</button>
        </div>
        ${teamSection()}
        ${sameRegion.length ? `
          <div class="m-detail-related">
            <b>同地区机构</b>
            ${sameRegion.map(other => `
              <button class="m-related-item" type="button" data-related="${other.id}">
                ${icon("building", "ic-13")}
                <span>${escapeHtml(other.name)}</span>
                <span class="m-related-arrow">${icon("chev-right", "ic-12")}</span>
              </button>
            `).join("")}
          </div>
        ` : ""}
      </div>
    `;
    openSheet(detailSheet);
  }

  /* ---------------------------------------------------------
     Utilities / events
     --------------------------------------------------------- */

  function showToast(message) {
    const toast = $("#mToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2100);
  }

  async function copyAddress(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("地址已复制");
    } catch (error) {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        showToast("地址已复制");
      } catch (fallbackError) {
        showToast("复制失败，请长按地址复制");
      }
      area.remove();
    }
  }

  function resetAll() {
    state.region = "all";
    state.type = "all";
    state.draftType = "all";
    state.query = "";
    const input = $("#mSearch");
    if (input) input.value = "";
    renderAll();
  }

  function updateTeamToggleLabel() {
    const button = document.querySelector("[data-team-toggle]");
    if (!button) return;
    const members = [...document.querySelectorAll("[data-role-members]")];
    const anyCollapsed = members.some(item => item.classList.contains("is-collapsed"));
    button.textContent = anyCollapsed ? "展开全部" : "收起全部";
  }

  document.addEventListener("click", event => {
    const roleToggle = event.target.closest("[data-role-toggle]");
    if (roleToggle) {
      const key = roleToggle.dataset.roleToggle;
      const members = document.querySelector(`[data-role-members="${key}"]`);
      if (members) {
        const collapsed = members.classList.toggle("is-collapsed");
        roleToggle.setAttribute("aria-expanded", String(!collapsed));
        roleToggle.innerHTML = `${collapsed ? "展开" : "收起"} ${icon("chev", "ic-12")}`;
        updateTeamToggleLabel();
      }
      return;
    }

    const teamToggle = event.target.closest("[data-team-toggle]");
    if (teamToggle) {
      const members = [...document.querySelectorAll("[data-role-members]")];
      const anyCollapsed = members.some(item => item.classList.contains("is-collapsed"));
      members.forEach(item => item.classList.toggle("is-collapsed", !anyCollapsed ? true : false));
      document.querySelectorAll("[data-role-toggle]").forEach(button => {
        const isCollapsed = !anyCollapsed;
        button.setAttribute("aria-expanded", String(!isCollapsed));
        button.innerHTML = `${isCollapsed ? "展开" : "收起"} ${icon("chev", "ic-12")}`;
      });
      updateTeamToggleLabel();
      return;
    }

    const region = event.target.closest("[data-region]");
    if (region) {
      state.region = region.dataset.region;
      renderOrg();
      renderList();
      return;
    }

    const typeDraft = event.target.closest("[data-type-draft]");
    if (typeDraft) {
      state.draftType = typeDraft.dataset.typeDraft;
      renderTypeOptions();
      return;
    }

    const copy = event.target.closest("[data-copy]");
    if (copy) {
      copyAddress(copy.dataset.copy);
      return;
    }

    const detail = event.target.closest("[data-detail]");
    if (detail) {
      openDetail(detail.dataset.detail);
      return;
    }

    const card = event.target.closest("[data-institution]");
    if (card) {
      openDetail(card.dataset.institution);
      return;
    }

    const related = event.target.closest("[data-related]");
    if (related) {
      openDetail(related.dataset.related);
      return;
    }
  });

  const search = $("#mSearch");
  if (search) {
    search.addEventListener("input", event => {
      state.query = event.target.value;
      renderList();
    });
  }

  $("#mClear")?.addEventListener("click", () => {
    state.query = "";
    if (search) {
      search.value = "";
      search.focus();
    }
    renderList();
  });

  $("#mFilterBtn")?.addEventListener("click", openFilter);
  $("#mFilterClose")?.addEventListener("click", closeSheets);
  $("#mDetailClose")?.addEventListener("click", closeSheets);
  backdrop?.addEventListener("click", closeSheets);

  $("#mFilterApply")?.addEventListener("click", () => {
    state.type = state.draftType;
    closeSheets();
    renderList();
    $(".m-directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  $("#mFilterReset")?.addEventListener("click", () => {
    state.type = "all";
    state.draftType = "all";
    closeSheets();
    renderList();
  });

  $("#mReset")?.addEventListener("click", resetAll);
  $("#mEmptyReset")?.addEventListener("click", resetAll);

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && activeSheet) closeSheets();
  });

  renderAll();
})();
