// Keep automatic responsive sizing by default, with an optional view preference.
export function setupDeviceView() {
  const select = document.getElementById('device-view');
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!select || !viewport) return;
  const rules = [];
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule instanceof CSSMediaRule && /max-width\s*:\s*\d+px/i.test(rule.conditionText)) {
          rules.push({ rule, original: rule.media.mediaText, max: Number(rule.conditionText.match(/max-width\s*:\s*(\d+)px/i)[1]) });
        }
      }
    } catch (_) { /* External stylesheets are left unchanged. */ }
  }
  function apply(mode) {
    const chosen = ['auto', 'phone', 'computer'].includes(mode) ? mode : 'auto';
    const virtualWidth = Math.min(390, screen.width || 390);
    for (const entry of rules) entry.rule.media.mediaText = chosen === 'auto' ? entry.original : chosen === 'computer' ? 'not all' : (virtualWidth <= entry.max ? 'all' : 'not all');
    viewport.content = chosen === 'computer' ? 'width=1024' : 'width=device-width, initial-scale=1';
    document.documentElement.dataset.view = chosen;
    select.value = chosen;
    try { localStorage.setItem('alexandria-device-view', chosen); } catch (_) {}
  }
  let saved = 'auto';
  try { saved = localStorage.getItem('alexandria-device-view') || 'auto'; } catch (_) {}
  select.addEventListener('change', () => apply(select.value));
  apply(saved);
}
setupDeviceView();
