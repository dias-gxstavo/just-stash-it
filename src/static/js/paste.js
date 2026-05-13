const API_BASE = "http://localhost:8000";

function getSlugFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug");
}

function formatRelativeTime(isoString) {
    const created = new Date(isoString);
    const diffMs = Date.now() - created.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1)  return "agora mesmo";
    if (diffMin < 60) return `${diffMin} min atrás`;

    const diffH = Math.floor(diffMin / 60);
    return `${diffH}h atrás`;
}

async function loadPaste() {
    const slug = getSlugFromUrl();

    if (!slug) {
        showErrorModal("No slug found in the URL.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/p/${slug}`);

        if (response.status === 404) {
            showErrorModal("Paste not found or has expired.");
            return;
        }

        if (!response.ok) throw new Error("Unexpected error.");

        const paste = await response.json();

        document.getElementById("content-name").textContent = paste.content_name;
        document.getElementById("content-body").textContent = paste.content_body;
        document.getElementById("created-at").textContent   = formatRelativeTime(paste.created_at);
    } catch (err) {
        console.error(err);
        showErrorModal("The paste could not be loaded.");
    }
}

async function copyContent() {
    const content = document.getElementById("content-body").textContent;
    await navigator.clipboard.writeText(content);

    const btn = document.getElementById("copy-btn");
    btn.querySelector("span.label").textContent = "Copied!";
    setTimeout(() => (btn.querySelector("span.label").textContent = "Copy All"), 2000);
}

function shareLink() {
    navigator.clipboard.writeText(window.location.href);
}

document.addEventListener("DOMContentLoaded", () => {
    loadPaste();
    document.getElementById("copy-btn").addEventListener("click", copyContent);
    document.getElementById("share-btn").addEventListener("click", shareLink);
    document.getElementById("current-year").textContent = new Date().getFullYear();
});
