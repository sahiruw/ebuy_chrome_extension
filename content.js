function extractLinks() {
    alert("Content.js: extractLinks");
    let links = [...document.querySelectorAll("a[href]")].map(a => a.href);
    return [...new Set(links)]; // Remove duplicates
}
