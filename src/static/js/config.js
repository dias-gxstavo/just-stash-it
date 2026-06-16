const CONFIG = {
    API_BASE: window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://juststash.com",

    get DOCS_URL() {
        return this.API_BASE + "/docs";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('current-year').textContent = new Date().getFullYear();
    document.querySelectorAll(".docs-link").forEach(el => {
        el.href = CONFIG.DOCS_URL;
    });
});