/** Progressive-enhancement only: nav toggle, category filter, print button. */
export const CLIENT = `/* Heirloom Table - site behaviour (vanilla JS, no dependencies) */
(function () {
  "use strict";

  // Mobile navigation
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Category filter on the recipe index
  var filters = document.querySelectorAll(".filters button");
  if (filters.length) {
    var cards = document.querySelectorAll("[data-category]");
    var blocks = document.querySelectorAll(".cat-block");
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var want = btn.getAttribute("data-filter");
        filters.forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        cards.forEach(function (card) {
          var match = want === "all" || card.getAttribute("data-category") === want;
          card.classList.toggle("is-hidden", !match);
        });
        blocks.forEach(function (block) {
          var cat = block.getAttribute("data-cat-block");
          block.classList.toggle("is-hidden", want !== "all" && want !== cat);
        });
      });
    });
  }

  // Jump-link highlighting for long ingredient lists
  var steps = document.querySelectorAll(".steps > li");
  if (steps.length) {
    steps.forEach(function (step, i) {
      step.setAttribute("data-step", String(i + 1));
    });
  }

  // Print the recipe only
  document.querySelectorAll("[data-print]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.print();
    });
  });

  // Advertising slots: collapse any slot an ad network has not filled, so
  // readers never see an empty "Advertisement" box. If you paste a network
  // tag into a .spot-body, the slot stays visible.
  document.querySelectorAll(".spot").forEach(function (slot) {
    var body = slot.querySelector(".spot-body");
    if (!body) {
      slot.hidden = true;
      return;
    }
    function check() {
      var filled = body.children.length > 0 || body.textContent.trim().length > 0;
      slot.hidden = !filled;
    }
    check();
    // Some networks fill the slot asynchronously, so keep re-checking.
    if (window.MutationObserver) {
      new MutationObserver(check).observe(body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    window.addEventListener("load", check);
    setTimeout(check, 1500);
    setTimeout(check, 4000);
  });
})();
`;
