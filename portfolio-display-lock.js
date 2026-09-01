(function () {
  "use strict";

  const blockedLabels = new Set([
    "Ask ChatGPT",
    "Edit chart",
    "Edit mode",
    "Edit theme",
    "Publish",
    "Publish changes",
  ]);

  const style = document.createElement("style");
  style.textContent = `
    .dashboard-ask-button,
    .topbar-mode-switcher,
    .dashboard-publish-button,
    .theme-drawer {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  function removeEditingControls(root) {
    if (root.matches?.(".theme-drawer")) {
      root.remove();
      return;
    }
    root.querySelectorAll(".theme-drawer").forEach((element) => element.remove());

    const candidates = [
      ...(root.matches?.("button, a, [role='menuitem']") ? [root] : []),
      ...root.querySelectorAll("button, a, [role='menuitem']"),
    ];
    candidates.forEach((element) => {
      const label = (element.getAttribute("aria-label") || element.textContent || "").trim();
      if (blockedLabels.has(label)) element.remove();
    });
  }

  document.addEventListener(
    "dblclick",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  removeEditingControls(document);
  new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) removeEditingControls(node);
      });
    });
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
