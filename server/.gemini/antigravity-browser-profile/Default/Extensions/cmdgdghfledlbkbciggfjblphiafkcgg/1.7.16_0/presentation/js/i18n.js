let jsonI18n;
function i18n$(name) {
  try {
    return i18n.getMessage(name);
  } catch {
    try {
      if (!jsonI18n) jsonI18n = JSON.parse(document.getElementById('jsonI18n').innerText);
      return jsonI18n[name];
    } catch {}
  }
  return false;
}

dom.cl.add(dom.body, i18n$('@@bidi_dir'));

for (const el of qsa$('[data-i18n]')) {
  const text = i18n$(el.getAttribute('data-i18n'));
  if (!text) continue;
  el.innerHTML = text;
}

for (const el of qsa$('[data-i18n-title]')) {
  const text = i18n$(el.getAttribute('data-i18n-title'));
  if (!text) continue;
  el.setAttribute('title', text);
}

for (const el of qsa$('[placeholder]')) {
  const text = i18n$(el.getAttribute('placeholder'));
  if (!text) continue;
  el.setAttribute('placeholder', text);
}

for (const el of qsa$('[data-i18n-toggle]')) {
  const val = el.getAttribute('data-i18n-toggle').split(':');
  if (val?.length !== 2) continue;
  const textB = i18n$(val[0]),
    textF = i18n$(val[1]);
  if (!textB || !textF) continue;
  el.setAttribute('data-toggle-before', textB);
  el.setAttribute('data-toggle-after', textF);
}
