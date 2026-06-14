/* East Coast Electrical — interactions */
(function () {
  "use strict";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Sticky nav background on scroll ---- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  }
  if (nav) { onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); }

  /* ---- Hero rolling images ---- */
  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dots button"));
  if (slides.length > 1) {
    // Lazy-load the non-eager slides once the page is ready.
    slides.forEach(function (s, i) {
      if (i === 0) return;
      var url = s.getAttribute("data-bg");
      if (url) {
        var pre = new Image();
        pre.onload = function () { s.style.backgroundImage = "url('" + url + "')"; };
        pre.src = url;
      }
    });

    var current = 0;
    function show(i) {
      slides[current].classList.remove("active");
      if (dots[current]) dots[current].classList.remove("active");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");
    }
    var timer = null;
    function start() {
      if (reduceMotion) return;
      stop();
      timer = setInterval(function () { show(current + 1); }, 6000);
    }
    function stop() { if (timer) clearInterval(timer); }
    dots.forEach(function (d, i) {
      d.addEventListener("click", function () { show(i); start(); });
    });
    start();
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }

  /* ---- Reveal on scroll ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Smooth-scroll close on anchor (mobile) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function () { /* native smooth-scroll handles it */ });
  });

  /* ---- AJAX form submit (FormSubmit) with graceful fallback ---- */
  var form = document.querySelector('form[action*="formsubmit"]');
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn ? btn.textContent : "";
      if (btn) { btn.textContent = "Sending…"; btn.disabled = true; }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      }).then(function (r) {
        return r.json().catch(function () { return {}; });
      }).then(function () {
        form.innerHTML =
          '<div style="text-align:center;padding:30px 8px;">' +
          '<div style="width:58px;height:58px;border-radius:50%;background:var(--navy);color:var(--gold);display:grid;place-items:center;margin:0 auto 18px;">' +
          '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>' +
          '<h3 style="font-family:Fraunces,serif;font-weight:400;font-size:1.5rem;margin-bottom:8px;">Thanks — we’ve got it.</h3>' +
          '<p style="color:var(--muted);">We’ll be in touch shortly. For anything urgent, call <a href="tel:+64800477275" style="color:var(--gold-deep);font-weight:600;">0800 477 275</a>.</p></div>';
      }).catch(function () {
        if (btn) { btn.textContent = original; btn.disabled = false; }
        window.location.href = "tel:+64800477275";
      });
    });
  }

  /* ---- Set current year in footer ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
