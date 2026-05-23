const EXPIRATION_MAP = {
    "5 min":  "5m",
    "10 min": "10m",
    "1 hour": "1h",
};

async function createPaste() {
    const contentName = document.getElementById("content-name").value.trim();
    const contentBody = document.getElementById("content-body").value.trim();
    const expirationLabel = document.getElementById("expiration").value;
    const expiresIn = EXPIRATION_MAP[expirationLabel];

    if (!contentName || !contentBody) {
        showErrorModal("Fill the title and the content before generating the link");
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/paste`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content_name: contentName,
                content_body: contentBody,
                expires_in:   expiresIn,
            }),
        });

        if (!response.ok) throw new Error("Error creating the paste.");

        const { slug } = await response.json();
        const pasteUrl = `${window.location.origin}/paste.html?slug=${slug}`;

        showSuccessModal(pasteUrl, expiresIn);
        clearFields();
    } catch (err) {
        console.error(err);
        showErrorModal("The paste could not be created. Please check if the server is running.");
    }
}

function clearFields() {
    document.getElementById("content-name").value = "";
    document.getElementById("content-body").value = "";
    document.getElementById("expiration").selectedIndex = 0;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generate-btn").addEventListener("click", createPaste);
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.querySelectorAll(".docs-link").forEach(el => {
        el.href = CONFIG.DOCS_URL;
    });
});