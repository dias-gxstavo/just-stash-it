const CONFIG = {
    API_BASE: window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://juststash.com",

    get DOCS_URL() {
        return this.API_BASE + "/docs";
    }
};