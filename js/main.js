function normalizeToHtmlFileName(pathname = "") {
  const trimmed = String(pathname).replace(/\/+$/, "");
  const lastSegment = trimmed.split("/").filter(Boolean).pop();

  if (!lastSegment) return "index.html";
  if (lastSegment.endsWith(".html")) return lastSegment;
  if (lastSegment.includes(".")) return lastSegment;
  return `${lastSegment}.html`;
}

function getCurrentPageFileName() {
  return normalizeToHtmlFileName(window.location.pathname);
}

function setActiveNavbarLink(root = document) {
  const links = root.querySelectorAll(".nav-link");
  if (!links.length) return;

  const currentFile = getCurrentPageFileName();

  links.forEach((link) => {
    let hrefFile = "";
    try {
      const url = new URL(
        link.getAttribute("href") || "",
        window.location.href,
      );
      hrefFile = normalizeToHtmlFileName(url.pathname);
    } catch {
      hrefFile = "";
    }

    link.classList.toggle("active", hrefFile === currentFile);

    if (!link.dataset.navActiveBound) {
      link.addEventListener("click", () => {
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      });
      link.dataset.navActiveBound = "1";
    }
  });
}

// --- fetching & injection of Navbar Components ---------
async function loadNavbar() {
  const placeholder = document.getElementById("navbar-placeholder");
  if (!placeholder) {
    setActiveNavbarLink(document);
    return;
  }

  const response = await fetch("/components/navbar.html");
  const html = await response.text();
  placeholder.innerHTML = html;
  setActiveNavbarLink(placeholder);
}

// --- fetching & injection of Footer Components ---------
async function loadFooter() {
  const placeholder = document.getElementById("footer-placeholder");
  const response = await fetch("/components/footer.html");
  const html = await response.text();
  placeholder.innerHTML = html;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    loadFooter();
  });
} else {
  loadNavbar();
  loadFooter();
}
