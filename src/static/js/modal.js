function injectModal() {
    const html = `
    <div id="pn-modal-backdrop"
         class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm hidden"
         aria-modal="true" role="dialog">

        <div id="pn-modal-success"
             class="hidden relative z-10 w-full max-w-2xl mx-4 bg-surface-container border border-outline/10 p-12 md:p-16 editorial-shadow">
            <div class="flex flex-col items-center text-center space-y-8">
                <div class="space-y-4">
                    <span class="material-symbols-outlined text-primary-container text-5xl mb-4"
                          style="font-variation-settings: 'wght' 200;">check_circle</span>
                    <h1 class="font-headline-lg text-on-surface italic">Generated Link</h1>
                    <p class="font-body-lg text-on-surface-variant max-w-md mx-auto">
                        Your paste is ready for the 🌍 (for a moment).
                    </p>
                </div>

                <div class="w-full py-10 px-6 bg-surface-container-high/50 border border-outline/5">
                    <p id="modal-paste-url"
                       class="font-newsreader italic text-2xl md:text-4xl text-on-primary-fixed-variant tracking-tight break-all">
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-4 w-full">
                    <button id="modal-copy-btn"
                            class="flex-1 bg-primary-container text-on-primary-container py-5 px-8 font-label-sm uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">content_copy</span>
                        <span class="modal-copy-label">Copy Link</span>
                    </button>
                    <a id="modal-view-btn"
                       href="#"
                       target="_blank"
                       class="flex-1 border border-on-surface/20 text-on-surface py-5 px-8 font-label-sm uppercase tracking-widest hover:border-on-surface transition-all flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-sm">visibility</span>
                        View Paste
                    </a>
                </div>

                <p id="modal-meta"
                   class="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/40 pt-4">
                </p>
            </div>

            <button id="modal-success-close"
                    class="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>

        <div id="pn-modal-error"
             class="hidden relative z-10 w-full max-w-2xl mx-4 bg-surface-container border border-outline/10 p-12 md:p-16 editorial-shadow">
            <div class="flex flex-col items-center text-center space-y-8">
                <div class="space-y-4">
                    <span class="material-symbols-outlined text-error text-5xl mb-4"
                          style="font-variation-settings: 'wght' 200;">error</span>
                    <h1 class="font-headline-lg text-on-surface italic">Something went wrong</h1>
                    <p id="modal-error-message"
                       class="font-body-lg text-on-surface-variant max-w-md mx-auto">
                    </p>
                </div>

                <button id="modal-error-close"
                        class="w-full border border-on-surface/20 text-on-surface py-5 px-8 font-label-sm uppercase tracking-widest hover:border-on-surface transition-all">
                    Close
                </button>
            </div>
        </div>

    </div>`;

    document.body.insertAdjacentHTML("beforeend", html);
}


function showSuccessModal(url, expires) {
    const LABEL_MAP = { "5m": "5 MINUTES", "10m": "10 MINUTES", "1h": "1 HOUR" };

    document.getElementById("modal-paste-url").textContent = url;
    document.getElementById("modal-view-btn").href = url;
    document.getElementById("modal-meta").textContent =
        `EXPIRING IN ${LABEL_MAP[expires] ?? expires} `;

    document.getElementById("pn-modal-error").classList.add("hidden");
    document.getElementById("pn-modal-success").classList.remove("hidden");
    document.getElementById("pn-modal-backdrop").classList.remove("hidden");
}

function showErrorModal(message) {
    document.getElementById("modal-error-message").textContent = message;

    document.getElementById("pn-modal-success").classList.add("hidden");
    document.getElementById("pn-modal-error").classList.remove("hidden");
    document.getElementById("pn-modal-backdrop").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("pn-modal-backdrop").classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
    injectModal();

    document.getElementById("modal-success-close").addEventListener("click", closeModal);
    document.getElementById("modal-error-close").addEventListener("click", closeModal);

    document.getElementById("pn-modal-backdrop").addEventListener("click", (e) => {
        if (e.target === document.getElementById("pn-modal-backdrop")) closeModal();
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });

    document.getElementById("modal-copy-btn").addEventListener("click", () => {
        const url = document.getElementById("modal-paste-url").textContent;
        navigator.clipboard.writeText(url).then(() => {
            const label = document.querySelector(".modal-copy-label");
            label.textContent = "Copied!";
            setTimeout(() => (label.textContent = "Copy Link"), 2000);
        });
    });
});