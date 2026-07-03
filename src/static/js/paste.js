function getSlugFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug");
}

async function loadPaste() {
    const slug = getSlugFromUrl();

    if (!slug) {
        showErrorModal("No slug found in the URL.");
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/${slug}`);

        if (response.status === 404) {
            window.location.href = "/404.html";
            return;
        }

        if (!response.ok) throw new Error("Unexpected error.");

        const paste = await response.json();

        const created_at = new Date(paste.created_at);

        const formated_time = created_at.toLocaleTimeString(navigator.language, {
            hour: "2-digit",
            minute: "2-digit",
        });

        document.getElementById("content-name").textContent = paste.content_name;
        document.getElementById("content-body").textContent = paste.content_body;
        document.getElementById("created-at").textContent   = formated_time;
        document.getElementById("expires-in").textContent   = paste.expires_in;

        const codeEl = document.getElementById("content-body");
        codeEl.textContent = paste.content_body;
        hljs.highlightElement(codeEl);
    } catch (err) {
        console.error(err);
        showErrorModal("The paste could not be loaded.");
    }
}

async function getRawContent() {
    const slug = getSlugFromUrl();

    if (!slug) {
        showErrorModal("No slug found in the URL.");
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/raw/${slug}`, {
            method: "GET",
            headers: {"Accept": "text/plain"},
        });

        if (!response.ok) throw new Error("Error fetching raw paste.");

        window.location.href = `/raw?slug=${slug}`;

    } catch (err) {
        console.error(err);
        showErrorModal("The raw paste could not be loaded.");
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
    document.getElementById("raw-btn").addEventListener("click", getRawContent);
    document.getElementById("copy-btn").addEventListener("click", copyContent);
    document.getElementById("share-btn").addEventListener("click", shareLink);
});