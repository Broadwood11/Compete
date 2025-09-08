// Minimal LinkedIn → Markdown basics
(function () {
  const getText = (sel) => {
    const el = document.querySelector(sel);
    return el && el.innerText ? el.innerText.trim() : "";
  };
  const pick = (...sels) => {
    for (const s of sels) {
      const v = getText(s);
      if (v) return v;
    }
    return "";
  };

  // Name + headline (robust fallbacks)
  const name = pick("h1.text-heading-xlarge", ".pv-text-details__left-panel h1", "header h1", "h1");
  const headline = pick(".text-body-medium.break-words", ".pv-text-details__left-panel .text-body-medium");

  // Try to snag the first visible Experience row (best-effort, optional)
  let current = "";
  try {
    const expRoot = document.querySelector('section[id*="experience"], #experience');
    if (expRoot) {
      const first = expRoot.querySelector("li, .pvs-entity");
      if (first) {
        const lines = Array.from(first.querySelectorAll('span[aria-hidden="true"]'))
          .map((s) => s.innerText.trim())
          .filter(Boolean);
        current = Array.from(new Set(lines)).slice(0, 2).join(" — ");
      }
    }
  } catch (_) {}

  const url = location.href.split("?")[0];

  const md = [
    `# ${name || "(Name not found)"}`,
    headline ? `**${headline}**` : "",
    current ? `\n**Current:** ${current}` : "",
    `\n${url}\n`,
  ].join("\n").replace(/\n{3,}/g, "\n\n").trim();

  const copy = async (text) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        alert("✅ Copied basics to clipboard. Paste into Notion.");
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch {
      prompt("Copy basics:", text);
    }
  };

  copy(md);
})();
