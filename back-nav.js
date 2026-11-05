/*
 * 微信安卓侧边滑动返回
 * 微信 Android 内置 WebView 没有 iOS 那样的左边缘右滑返回手势，
 * 这里在屏幕左边缘（28px 内）监听单指右滑，松手超过 72px 即返回上一页。
 * 若当前页有打开的浮层（筛选面板 / 机构详情），优先关闭浮层。
 * 仅 Android + 微信环境生效，不影响 iOS 原生侧滑与普通浏览器。
 */
(function () {
  "use strict";

  var ua = navigator.userAgent || "";
  var isAndroid = /Android/i.test(ua);
  var isWeChat = /MicroMessenger/i.test(ua);
  if (!isAndroid || !isWeChat) return;

  var EDGE_WIDTH = 28;       // 左边缘触发区宽度
  var TRIGGER_DISTANCE = 72; // 松手触发返回的横向距离
  var MAX_VERTICAL = 80;     // 允许的纵向偏移
  var ENGAGE_RATIO = 1.2;    // 横向位移需大于纵向的倍数

  var startX = 0;
  var startY = 0;
  var dx = 0;
  var dy = 0;
  var tracking = false;
  var engaged = false;
  var indicator = null;
  var toastEl = null;
  var toastTimer = null;

  var PAGE_FALLBACK = {
    "": "./mobile.html",
    "index.html": "./mobile.html",
    "mobile.html": "",
    "team.html": "./mobile.html",
    "brand.html": "./mobile.html",
    "member.html": "./team.html",
    "department.html": "./team.html?view=departments"
  };

  function ensureIndicator() {
    if (indicator) return indicator;
    var style = document.createElement("style");
    style.textContent =
      ".pku-edge-back{position:fixed;left:0;top:50%;z-index:2147483000;" +
      "display:flex;align-items:center;justify-content:center;width:30px;height:54px;" +
      "margin-top:-27px;border-radius:0 27px 27px 0;background:rgba(255,255,255,.92);" +
      "box-shadow:0 6px 18px rgba(10,46,74,.18);color:#0a6c8f;pointer-events:none;" +
      "opacity:0;transform:translate3d(-100%,0,0);transition:opacity .16s ease,transform .16s ease;}" +
      ".pku-edge-back svg{width:18px;height:18px;stroke:currentColor;fill:none;" +
      "stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}" +
      ".pku-edge-back.is-dragging{transition:none;}" +
      ".pku-edge-back.is-visible{opacity:1;}" +
      ".pku-edge-toast{position:fixed;left:50%;bottom:64px;z-index:2147483001;" +
      "transform:translateX(-50%);padding:9px 16px;border-radius:999px;" +
      "background:rgba(10,46,74,.86);color:#fff;font-size:13px;line-height:1;" +
      "white-space:nowrap;opacity:0;transition:opacity .2s ease;pointer-events:none;}" +
      ".pku-edge-toast.is-visible{opacity:1;}";
    document.head.appendChild(style);

    indicator = document.createElement("div");
    indicator.className = "pku-edge-back";
    indicator.setAttribute("aria-hidden", "true");
    indicator.innerHTML =
      '<svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7"/></svg>';
    document.body.appendChild(indicator);
    return indicator;
  }

  function setIndicator(progress) {
    if (!indicator) return;
    var offset = Math.min(progress * 34, 34);
    indicator.style.transform = "translate3d(" + offset + "px,0,0)";
    indicator.style.opacity = String(0.35 + progress * 0.65);
  }

  function resetGesture() {
    tracking = false;
    engaged = false;
    if (indicator) {
      indicator.classList.remove("is-dragging", "is-visible");
      indicator.style.transform = "";
      indicator.style.opacity = "";
    }
  }

  function showToast(text) {
    ensureIndicator();
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "pku-edge-toast";
      toastEl.setAttribute("role", "status");
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = text;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 1600);
  }

  function pageName() {
    var parts = window.location.pathname.split("/");
    return parts[parts.length - 1] || "";
  }

  function goBack() {
    // 1. 有打开的面板先收面板
    if (typeof window.__pkuCloseOverlay === "function" && window.__pkuCloseOverlay()) {
      return;
    }

    // 2. 有浏览历史则走浏览器返回，保留来源页滚动位置与查询参数
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    // 3. 直接打开的详情页，按页面层级返回
    var fallback = PAGE_FALLBACK[pageName()];
    if (fallback === undefined) fallback = "./mobile.html";
    if (fallback) {
      window.location.href = fallback;
      return;
    }

    // 4. 首页没有上一页
    showToast("已经是第一页");
  }

  function onTouchStart(event) {
    if (event.touches.length !== 1) return;
    var touch = event.touches[0];
    if (touch.clientX > EDGE_WIDTH) return;

    var target = event.target;
    if (target && target.closest) {
      if (target.closest("input, textarea, select, [contenteditable='true']")) return;
    }

    tracking = true;
    engaged = false;
    startX = touch.clientX;
    startY = touch.clientY;
    dx = 0;
    dy = 0;
  }

  function onTouchMove(event) {
    if (!tracking || event.touches.length !== 1) return;
    var touch = event.touches[0];
    dx = touch.clientX - startX;
    dy = touch.clientY - startY;

    if (!engaged) {
      // 纵向滑动优先交还页面滚动
      if (Math.abs(dy) > 14 && Math.abs(dy) >= Math.abs(dx)) {
        tracking = false;
        return;
      }
      if (dx > 10 && Math.abs(dx) > Math.abs(dy) * ENGAGE_RATIO) {
        engaged = true;
        ensureIndicator();
        indicator.classList.add("is-dragging", "is-visible");
      } else {
        return;
      }
    }

    if (event.cancelable) event.preventDefault();
    var progress = Math.min(dx / (window.innerWidth * 0.55), 1);
    setIndicator(progress);
  }

  function onTouchEnd() {
    if (!tracking) return;
    var shouldGoBack = engaged && dx > TRIGGER_DISTANCE && Math.abs(dy) < MAX_VERTICAL;
    resetGesture();
    if (shouldGoBack) goBack();
  }

  window.PkuBack = { go: goBack, isWeChatAndroid: true };

  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd);
  document.addEventListener("touchcancel", resetGesture);
})();
