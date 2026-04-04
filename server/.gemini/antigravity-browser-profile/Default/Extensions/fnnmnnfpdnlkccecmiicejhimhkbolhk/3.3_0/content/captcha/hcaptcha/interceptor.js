(() => {
    let hCaptchaInstance;
    let nextWidgetId = 0;

    Object.defineProperty(window, "hcaptcha", {
        get: function () {
            return hCaptchaInstance;
        },
        set: function (e) {
            hCaptchaInstance = e;

            // Store the original render function
            let originalRenderFunc = e.render;

            // Override the render function to create an hCaptcha widget and register it
            hCaptchaInstance.render = function (container, opts) {
                createHCaptchaWidget(container, opts);
                return originalRenderFunc(container, opts);
            };

            // Provide a custom method to get the hCaptcha response
            hcaptcha.getResponse = () => document.querySelector('[name=h-captcha-response]').value;

            // If grecaptcha is available, provide a custom method to get its response
            if (grecaptcha) grecaptcha.getResponse = () => document.querySelector('[name=h-captcha-response]').value;
        },
    });

    let createHCaptchaWidget = function (container, opts) {
        if (typeof container !== 'string') {
            // Generate a unique container id if it doesn't have one
            if (!container.id) {
                container.id = "hcaptcha-container-" + Date.now();
            }

            container = container.id;
        }

        if (opts.callback !== undefined && typeof opts.callback === "function") {
            // Generate a unique callback key if it's a function
            let key = "hcaptchaCallback" + Date.now();
            window[key] = opts.callback;
            opts.callback = key;
        }

        let widgetInfo = {
            captchaType: "hcaptcha",
            widgetId: nextWidgetId++,
            containerId: container,
            sitekey: opts.sitekey,
            callback: opts.callback,
        };

        let iter = 0;
        const intId = setInterval(() => {
            if (++iter > 200) clearInterval(intId);
            if (window.registerCaptchaWidget) {
                clearInterval(intId);
                registerCaptchaWidget(widgetInfo);
            }
        }, 500);
    };
})();
