const normalizeTarget = target => {
    if (target === null) {
        return [];
    }
    if (typeof target === 'string') {
        return Array.from(qsa$(target));
    }
    if (target && typeof target === "object" && "nodeType" in target) {
        return [target];
    }
    if (Array.isArray(target)) {
        return target;
    }
    return Array.from(target);
};

const makeEventHandler = (selector, callback) => {
    return function (event) {
        const dispatcher = event.currentTarget;
        if (typeof dispatcher?.querySelectorAll !== 'function') return;
        const receiver = event.target;
        const ancestor = receiver.closest(selector);
        if (ancestor === receiver && ancestor !== dispatcher && dispatcher.contains(ancestor)) {
            callback.call(receiver, event);
        }
    };
};

class dom {
    static listeners = []

    static attr(target, attr, value = undefined) {
        for (const elem of normalizeTarget(target)) {
            if (value === undefined) return elem.getAttribute(attr);
            if (value === null) {
                elem.removeAttribute(attr);
            } else {
                elem.setAttribute(attr, value);
            }
        }
    }

    static clone(target) {
        return normalizeTarget(target)[0].cloneNode(true);
    }

    static create(a) {
        if (typeof a === 'string') {
            return document.createElement(a);
        }
    }

    static createNS(ns, a) {
        if (typeof a === 'string' && typeof ns === 'string') {
            return document.createElementNS(ns, a);
        }
    }

    static text(target, text) {
        const targets = normalizeTarget(target);
        if (text === undefined) {
            return targets.length !== 0 ? targets[0].textContent : undefined;
        }
        for (const elem of targets) {
            elem.textContent = text;
        }
    }

    static remove(target) {
        for (const elem of normalizeTarget(target)) {
            elem.remove();
        }
    }

    // target, type, callback, [options]
    // target, type, subTarget, callback, [options]

    static on(target, type, subTarget, callback, options) {
        if (typeof subTarget === 'function') {
            options = callback;
            callback = subTarget;
            if (typeof options === 'boolean') {
                options = {capture: true};
            }
        } else {
            callback = makeEventHandler(subTarget, callback);
            if (options === undefined || typeof options === 'boolean') {
                options = {capture: true};
            } else {
                options.capture = true;
            }
        }
        const targets = target?.constructor?.name === 'Window' || target?.constructor?.name === 'HTMLDocument' ? [target] : normalizeTarget(target);
        for (const elem of targets) {
            this.listeners.push([elem, type, callback, options])
            elem.addEventListener(type, callback, options);
        }
    }

    static offAll() {
        for (const listener of this.listeners) {
            const [elem, type, callback, options] = listener
            elem.removeEventListener(type, callback, options);
        }
    }

    static off(target, type, callback, options) {
        if (typeof callback !== 'function') {
            return;
        }
        if (typeof options === 'boolean') {
            options = {capture: true};
        }
        const targets = target?.constructor?.name === 'Window' || target?.constructor?.name === 'HTMLDocument' ? [target] : normalizeTarget(target);
        for (const elem of targets) {
            elem.removeEventListener(type, callback, options);
        }
    }
}

dom.cl = class {
    static add(target, name) {
        for (const elem of normalizeTarget(target)) {
            elem.classList.add(name);
        }
    }

    static remove(target, name) {
        for (const elem of normalizeTarget(target)) {
            elem.classList.remove(name);
        }
    }

    static toggle(target, name, state) {
        let r;
        for (const elem of normalizeTarget(target)) {
            r = elem.classList.toggle(name, state);
        }
        return r;
    }

    static has(target, name) {
        for (const elem of normalizeTarget(target)) {
            if (elem.classList.contains(name)) {
                return true;
            }
        }
        return false;
    }
};

function qs$(a, b) {
    if (typeof a === 'string') {
        return document.querySelector(a);
    }
    return a.querySelector(b);
}

function qsa$(a, b) {
    if (typeof a === 'string') {
        return document.querySelectorAll(a);
    }
    return a.querySelectorAll(b);
}

dom.root = qs$(':root');
dom.html = document.documentElement;
dom.head = document.head;
dom.body = document.body;

