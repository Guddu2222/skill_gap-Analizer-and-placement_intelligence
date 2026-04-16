const dialog = qs$('#dialog');
const dialogHeader = qs$('#dialog-header');
const curtain = qs$('#curtain');
const closeDialog = qs$('#close-dialog');
const selectTextBox = qs$('#select-text-box');
const specificitySlider = qs$('#specificity-slider');
const ancestorsSlider = qs$('#ancestors-slider');
const selectorButton = qs$('#selectorButton');
const previewCheckbox = qs$('#previewCheckbox');
const saveButton = qs$('#saveButton');
const parentDoc = parent.window.document;

const regexValidClass = /-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;
const DEFAULT_SPECIFICITY_SLIDER_LENGTH = 2;

let dragging = false;
let xOffset = 0;
let yOffset = 0;
let currentWindowIframe = null;
let currentSelector = null;
let specificityActions = [];

/* Preview Mode */

function clearPreviewMode() {
  if (!previewCheckbox.checked) return;
  previewCheckbox.checked = false;
  stopPreviewMode();
}

function startPreviewMode() {
  const elements = parentDoc.querySelectorAll(currentSelector);
  for (const element of elements) {
    curtain.innerHTML = '';
    element.style.setProperty('display', 'none', 'important');
  }
}

function stopPreviewMode() {
  const elements = parentDoc.querySelectorAll(currentSelector);
  for (const element of elements) {
    element.style.setProperty('display', null);
  }
}

/* Preview Mode */

/* Dragging */

function startDragging(event) {
  dragging = true;
  xOffset = event.screenX - dialog.offsetLeft;
  yOffset = event.screenY - dialog.offsetTop;
}

function stopDragging() {
  dragging = false;
}

function dragDialogBox(event) {
  if (!dragging) return;
  let x = event.screenX - xOffset;
  let y = event.screenY - yOffset;
  const maxX = window.innerWidth - dialog.offsetWidth;
  const maxY = window.innerHeight - dialog.offsetHeight;
  x = Math.max(0, Math.min(x, maxX));
  y = Math.max(0, Math.min(y, maxY));
  dialog.style.left = x + 'px';
  dialog.style.top = y + 'px';
}

/* Dragging */

/* Dialog Box */

function findAncestorSelectors(selector) {
  const element = parentDoc.querySelector(selector);
  const ancestors = [selector];
  let traverseElement = element;
  while (element?.parentNode && !isTag(traverseElement?.parentNode, 'body')) {
    traverseElement = traverseElement?.parentNode;
    ancestors.unshift(getCssSelector(traverseElement));
  }
  return ancestors;
}

function onAncestorsSliderChange(event, elementHierarchy) {
  clearPreviewMode();
  setCurrentSelector(elementHierarchy[parseInt(event.target.value)]);
  setupSlider(specificitySlider, 2);
  highlightElementsBySelector(currentSelector);
  setSpecificityActions(currentSelector);
  setupSlider(specificitySlider);
}

function onSpecificitySliderChange(event) {
  clearPreviewMode();
  // if is 2 should be currentIndex
  // if is 1 should remove nth-child from end or id
  // if is 0 should be last tag only
  const specificSelector = specificityActions[parseInt(event.target.value)];
  highlightElementsBySelector(specificSelector);
  setCurrentSelector(specificSelector);
}

function showDialogBox(selector) {
  dom.cl.remove(dialog, 'd-none');
  setCurrentSelector(selector);
  const elementHierarchy = findAncestorSelectors(selector);
  const ancestorsSliderLength = elementHierarchy.length - 1;
  setupSlider(specificitySlider);
  setupSlider(ancestorsSlider, ancestorsSliderLength);
  ancestorsSlider.addEventListener('input', (event) => onAncestorsSliderChange(event, elementHierarchy));
  specificitySlider.addEventListener('input', onSpecificitySliderChange);
}

function hideDialogBox() {
  if (previewCheckbox.checked) {
    previewCheckbox.checked = false;
    stopPreviewMode();
  }
  dom.cl.add(dialog, 'd-none');
  curtain.innerHTML = '';
  setCurrentSelector(null);
}

/* Dialog Box */

function setCurrentWindowIframe() {
  for (const iframe of parentDoc.getElementsByTagName('iframe')) {
    if (iframe.contentWindow !== window) continue;
    currentWindowIframe = iframe;
  }
}

function setCurrentSelector(selector) {
  currentSelector = selector;
  selectTextBox.textContent = selector;
  return selector;
}

function getSpecificityActions(selector) {
  return [extractTagFromSelector(selector), getPlainTagLastChild(selector), selector];
}

function setSpecificityActions(selector) {
  specificityActions = getSpecificityActions(selector);
  return specificityActions;
}

function setPointerEventsForIFrame(val) {
  currentWindowIframe.style.pointerEvents = val;
}

function onElementPick(event) {
  if (!currentSelector) return;
  if (!dom.cl.has(dialog, 'd-none')) return;
  event.preventDefault();
  event.stopPropagation();
  showDialogBox(currentSelector);
  setSpecificityActions(currentSelector);
}

function highlightElementsOnMouseMove(event) {
  if (!dom.cl.has(dialog, 'd-none')) return;
  event.preventDefault();
  event.stopPropagation();
  const element = getEventElement(event.clientX, event.clientY);
  if (!isNotRootElement(element)) return;
  setCurrentSelector(getCssSelector(element));
  highlightElementsBySelector(currentSelector);
}

function highlightElementsBySelector(selector) {
  curtain.innerHTML = '';
  for (const element of parentDoc.querySelectorAll(selector)) {
    const highlight = dom.create('div');
    dom.cl.add(highlight, 'highlight');
    const { width, height, top, left } = element.getBoundingClientRect();
    highlight.style.top = `${top}px`;
    highlight.style.left = `${left}px`;
    highlight.style.width = `${width}px`;
    highlight.style.height = `${height}px`;
    curtain.appendChild(highlight);
  }
}

function getEventElement(x, y) {
  setPointerEventsForIFrame('none');
  const elem = parentDoc.elementFromPoint(x, y);
  setPointerEventsForIFrame('auto');
  return elem;
}

function registerDragEventListeners() {
  dom.on(dialogHeader, 'pointerdown', startDragging);
  dom.on(window, 'pointerup', stopDragging);
  dom.on(window, 'pointermove', dragDialogBox);
}

function registerCurtainEventListeners() {
  dom.on(curtain, 'pointermove', highlightElementsOnMouseMove);
  dom.on(curtain, 'click', onElementPick);
}

function registerDefaultEventListeners() {
  dom.on(closeDialog, 'click', () => {
    if (previewCheckbox.checked) stopPreviewMode();
    closeElementPicker();
  });
  dom.on(saveButton, 'click', saveBlockedElements);
  dom.on(previewCheckbox, 'change', (el) => (el.target.checked ? startPreviewMode() : stopPreviewMode()));
  dom.on(selectorButton, 'click', hideDialogBox);
  dom.on(window, 'keydown', onDeleteOrEscapePushed);
  dom.on(parent, 'keydown', onDeleteOrEscapePushed);
  dom.on(parent, 'scroll', () => {
    highlightElementsBySelector(currentSelector);
  });
}

function isNotRootElement(el) {
  return el && typeof el === 'object' && 'nodeType' in el && !(isTag(el, '#document') || isTag(el, 'html') || isTag(el, 'body'));
}

function getElementPath(element) {
  if (element.id) return [`${element.nodeName.toLowerCase()}#${element.id}`];
  const path = [];
  while (isAbleToTraverse(element)) {
    const nodeName = element.nodeName.toLowerCase();
    const classes = element
      .getAttribute('class')
      ?.split(' ')
      ?.filter((className) => regexValidClass.test(className));
    const selector = classes?.length > 0 ? `${nodeName}.${classes.join('.')}` : `${nodeName}`;
    path.unshift(selector);
    element = element.parentNode;
  }
  if (path.length === 0) return [];
  return path;
}

function getCssSelector(element, lastItems = []) {
  const iterationNumber = lastItems.length + 1;
  let path = [...getElementPath(element), ...lastItems];
  if (path.length === 0) return null;
  const selector = path.join(' > ');
  if (path.length === 1) return selector;
  const elements = [...parentDoc.querySelectorAll(selector)];
  if (elements.length <= 1) return selector;
  path = appendIndexToPath(element, path, iterationNumber);
  lastItems = [...path.splice(-iterationNumber)];
  if (isTag(element?.parentNode, 'body')) return path.join(' > ');
  return getCssSelector(element.parentNode, lastItems);
}

function appendIndexToPath(targetElement, path, trace) {
  const index = getElementIndex(targetElement);
  path[path.length - trace] = `${targetElement.nodeName.toLowerCase()}:nth-child(${index})`;
  return [...path];
}

function getElementIndex(node) {
  let index = 1;
  while ((node = node?.previousElementSibling)) index++;
  return index;
}

function isTag(element, tag) {
  return element?.nodeName?.toLowerCase() === tag.toLowerCase();
}

function isAbleToTraverse(element) {
  return !isTag(element.parentNode, 'html');
}

function setupSlider(slider, value = DEFAULT_SPECIFICITY_SLIDER_LENGTH) {
  slider.max = value;
  slider.value = value;
  return slider;
}

function getPlainTagLastChild(selector) {
  const path = getPathFromSelector(selector);
  path.pop();
  path.push(extractTagFromSelector(selector));
  return path.join(' > ');
}

function extractTagFromSelector(selector) {
  const path = getPathFromSelector(selector);
  const lastItemInSelector = path.pop();
  const idIndex = lastItemInSelector.indexOf('#');
  const childIndex = lastItemInSelector.indexOf(':');
  const sliceIndex = idIndex === -1 ? childIndex : idIndex;
  if (sliceIndex === -1) return lastItemInSelector;
  return lastItemInSelector.slice(0, sliceIndex);
}

function getPathFromSelector(selector) {
  return selector.split(' > ');
}

function saveBlockedElements() {
  parent.postMessage({
    sender: 'sblock',
    eventName: 'blocker.addSelectorToBlocker',
    params: {
      hostname: extractHostnameFromUrl(parent.location.href),
      selector: currentSelector,
    },
  });
  if (!previewCheckbox.checked) startPreviewMode();
  closeElementPicker();
}

function extractHostnameFromUrl(link) {
  try {
    const { hostname } = new URL(link);
    return hostname.replace(/^(www\.)/, '');
  } catch (e) {
    return null;
  }
}

function onDeleteOrEscapePushed(event) {
  if (event.key === 'Delete' || event.key === 'Backspace') {
    return saveBlockedElements();
  }
  if (event.key === 'Escape' || event.which === 27) {
    if (previewCheckbox.checked) stopPreviewMode();
    closeElementPicker();
  }
}

function closeElementPicker() {
  dom.offAll();
  currentWindowIframe.remove();
}

(() => {
  setCurrentWindowIframe();
  registerDragEventListeners();
  registerCurtainEventListeners();
  registerDefaultEventListeners();
})();












