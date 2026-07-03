function getSlugFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug");
}

async function loadRaw() {const slug = getSlugFromUrl();
    const el = document.getElementById("raw-content");

    if (!slug) {
        el.textContent = "No slug found in the URL.";
        return;
    }

    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/raw/${slug}`, {
            method: "GET",
            headers: { "Accept": "text/plain" },
        });

        if (response.status === 404) {
            window.location.href = "/404.html";
            return;
        }

        if (!response.ok) throw new Error("Error fetching raw paste.");

        el.textContent = await response.text();
    }
    catch (err) {
        console.error(err);
        el.textContent = "The raw paste could not be loaded.";
    }
}

document.addEventListener("DOMContentLoaded", loadRaw);