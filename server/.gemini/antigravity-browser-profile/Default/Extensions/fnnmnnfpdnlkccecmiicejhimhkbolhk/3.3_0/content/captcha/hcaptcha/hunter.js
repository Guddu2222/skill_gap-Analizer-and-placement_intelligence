(() => {
    // Use a single setInterval to periodically check for hCaptcha widget registration
    setInterval(function () {
        // Check if the registration function and widget check function exist
        if (window.registerCaptchaWidget && isCaptchaWidgetRegistered("hcaptcha", 0)) return;

        // Find the h-captcha-response textarea element
        let textarea = document.querySelector("textarea[name=h-captcha-response]");

        if (!textarea) return;

        let container = textarea.parentNode;

        // Generate a unique container id if it doesn't have one
        if (!container.id) {
            container.id = "hcaptcha-container-" + Date.now();
        }

        // Check if the container has sitekey and callback data attributes
        if (container.dataset.sitekey != null) {
            // Register the hCaptcha widget with the found information
            registerCaptchaWidget({
                captchaType: "hcaptcha",
                widgetId: 0,
                containerId: container.id,
                sitekey: container.dataset.sitekey || null,
                callback: container.dataset.callback || null,
            });
        }
    }, 2000);
})();
