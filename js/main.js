// import { initializeFestivalSpiral } from "./event.js";

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
    initializeFestivalSpiral();
  });
} else {
  loadNavbar();
  loadFooter();
  initializeFestivalSpiral();
}

// --- observer for text slideIn animation ------
(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        } else {
          entry.target.classList.remove("show");
        }
      });
    },
    {
      threshold: 0.3,
    },
  );

  const eraTexts = document.querySelectorAll(".era-text");
  eraTexts.forEach((e) => {
    observer.observe(e);
  });

  const facts = document.querySelectorAll(".fact");
  facts.forEach((f) => {
    observer.observe(f);
  });
})();

// --- Event JS -----------------------------------------------------------------
function initializeFestivalSpiral() {
  const scene = document.querySelector("[data-spiral-scene]");
  if (!scene) return;

  const cards = Array.from(scene.querySelectorAll("[data-spiral-card]"));
  if (!cards.length) return;
  const detailTitle = document.querySelector("[data-detail-target-title]");
  const detailSubtitle = document.querySelector(
    "[data-detail-target-subtitle]",
  );
  const detailSeason = document.querySelector("[data-detail-target-season]");
  const detailMonth = document.querySelector("[data-detail-target-month]");
  const detailDescription = document.querySelector(
    "[data-detail-target-description]",
  );
  const detailPreview = document.querySelector("[data-detail-preview]");
  const detailPanel = document.getElementById("festival-detail-panel");

  // Sidebar summary references
  const summaryTitle = document.getElementById("summary-title");
  const summaryText = document.getElementById("summary-text-container");
  const seeMoreBtn = document.getElementById("summary-see-more-btn");

  let selectedCard = cards[0] || null;
  let isDetailOpen = false;
  let lastIndex = -1;

  const syncSummaryPanel = (card) => {
    if (!card || isDetailOpen) return;

    if (summaryTitle) summaryTitle.textContent = card.dataset.detailTitle;
    if (summaryText) {
      summaryText.innerHTML = `<p>${card.dataset.detailSubtitle}</p>`;
      // Simple animation for summary change
      summaryText.style.opacity = "0";
      summaryText.style.transition = "none";
      summaryText.offsetHeight; // trigger reflow
      summaryText.style.transition = "opacity 0.5s ease";
      summaryText.style.opacity = "0.9"; // Muted effect per root definition
    }
    if (seeMoreBtn) {
      seeMoreBtn.style.display = "inline-block";
      seeMoreBtn.onclick = () => {
        openDetail(card);
      };
    }
  };

  const renderSelectionState = () => {
    cards.forEach((item) => {
      const selected = isDetailOpen && item === selectedCard;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", selected ? "true" : "false");
      item.style.setProperty("--card-selected-offset", "0px");
    });

    scene.classList.toggle("is-detail-open", isDetailOpen);
    detailPanel?.classList.toggle("active", isDetailOpen);

    // Hide summary sidebar when detail is open to focus on detail panel
    const sidebar = document.querySelector(".festival-history-sidebar");
    if (sidebar) {
      sidebar.style.opacity = isDetailOpen ? "0" : "1";
    }
  };

  const syncDetailPanel = (card) => {
    if (!card) return;

    selectedCard = card;

    if (detailTitle) detailTitle.textContent = card.dataset.detailTitle || "";
    if (detailSubtitle)
      detailSubtitle.textContent = card.dataset.detailSubtitle || "";
    if (detailSeason)
      detailSeason.textContent = card.dataset.detailSeason || "";
    if (detailMonth) detailMonth.textContent = card.dataset.detailMonth || "";
    if (detailDescription)
      detailDescription.textContent = card.dataset.detailDescription || "";

    if (detailPreview) {
      const cardMedia = card.querySelector(".festival-card-media");
      const cardBackground = cardMedia
        ? window.getComputedStyle(cardMedia).backgroundImage
        : "none";
      const hasImage =
        cardMedia &&
        !cardMedia.classList.contains("is-empty") &&
        cardBackground &&
        cardBackground !== "none";

      detailPreview.style.backgroundImage = hasImage ? cardBackground : "";
      detailPreview.classList.toggle("is-empty", !hasImage);
    }
  };

  const openDetail = (card) => {
    syncDetailPanel(card);
    isDetailOpen = true;
    renderSelectionState();

    // All text animation: Staggered reveal for detail panel content
    const detailCopy = document.querySelector(".festival-detail-copy");
    if (detailCopy) {
      const elements = detailCopy.children;
      Array.from(elements).forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "none";

        setTimeout(() => {
          el.style.transition =
            "opacity 0.6s ease-out, transform 0.6s ease-out";
          el.style.transitionDelay = `${i * 0.1}s`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, 50);
      });
    }
  };

  const closeDetail = () => {
    isDetailOpen = false;
    renderSelectionState();
  };

  const totalCards = cards.length;
  const updateSpiral = () => {
    const rect = scene.getBoundingClientRect();
    const travelDistance = Math.max(rect.height - window.innerHeight, 1);
    const rawProgress = -rect.top / travelDistance;
    const progress = Math.max(0, Math.min(1, rawProgress));
    const viewportWidth = window.innerWidth;
    const compact = viewportWidth <= 700;
    const medium = viewportWidth <= 1024;
    const timeline = progress * (totalCards - 1);

    // --- Scroll Sync Logic for Sidebar Summary ---
    const currentIndex = Math.round(timeline);
    if (currentIndex !== lastIndex && !isDetailOpen) {
      lastIndex = currentIndex;
      const focusedCard = cards[currentIndex];
      if (focusedCard) syncSummaryPanel(focusedCard);
    }

    cards.forEach((card, index) => {
      const distance = index - timeline;
      const absDistance = Math.abs(distance);
      const radius = compact ? 104 : medium ? 154 : 225;
      const verticalStep = compact ? 126 : medium ? 154 : 176;
      const turnsPerCard = compact ? 0.38 : 0.44;
      const helixAngle =
        -Math.PI / 2 +
        (index * turnsPerCard - progress * (totalCards - 1) * turnsPerCard) *
          Math.PI *
          2;

      const frontness = (-Math.sin(helixAngle) + 1) / 2;
      const side = Math.cos(helixAngle);
      const depth = Math.sin(helixAngle);

      const x = side * radius;
      const y = distance * verticalStep + depth * (compact ? 16 : 22);
      const zDepth =
        frontness * (compact ? 104 : medium ? 162 : 230) -
        (1 - frontness) * 132;
      const rotate = side * (compact ? 5 : 8);
      const rotateY = side * (compact ? -18 : -28);

      const focus =
        Math.max(0, 1 - absDistance / 1.55) * (0.45 + frontness * 0.55);
      const scale = 0.68 + frontness * 0.24 + focus * 0.14;
      const opacity = 0.08 + frontness * 0.34 + focus * 0.58;
      const saturation = 0.52 + frontness * 0.22 + focus * 0.34;
      const blur = Math.max(
        0,
        (1 - frontness) * (compact ? 1.8 : 2.6) +
          Math.max(0, absDistance - 0.15) * 1.2,
      );
      const shadowOpacity = 0.08 + frontness * 0.34;
      const zIndex = Math.max(
        1,
        Math.round(frontness * 90 + (1 - absDistance) * 18),
      );

      card.style.setProperty("--card-rotate", `${rotate}deg`);
      card.style.setProperty("--card-rotate-y", `${rotateY}deg`);
      card.style.setProperty("--card-x", `${x}px`);
      card.style.setProperty("--card-y", `${y}px`);
      card.style.setProperty("--card-z-depth", `${zDepth}px`);
      card.style.setProperty("--card-scale", scale.toFixed(3));
      card.style.setProperty("--card-opacity", opacity.toFixed(3));
      card.style.setProperty("--card-saturation", saturation.toFixed(3));
      card.style.setProperty("--card-blur", `${blur.toFixed(2)}px`);
      card.style.setProperty("--card-shadow-opacity", shadowOpacity.toFixed(3));
      card.style.setProperty("--card-z", zIndex);
      card.classList.toggle(
        "is-active",
        absDistance < 0.85 && frontness > 0.58,
      );
      card.classList.toggle("is-near-front", frontness > 0.72);
    });
  };

  cards.forEach((card) => {
    const activate = () => {
      if (isDetailOpen && selectedCard === card) {
        closeDetail();
        return;
      }

      openDetail(card);
    };

    card.addEventListener("click", activate);

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });

  syncDetailPanel(selectedCard);
  renderSelectionState();
  updateSpiral();

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      updateSpiral();
      ticking = false;
    });
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);

  // --- History 3D Slider Logic ---
  const historyData = [
    {
      title: "မူလအစ (ပုဂံမတိုင်မီ)",
      desc: "မြန်မာပြည်တွင် အစောဆုံးက သဘာဝကိုအခြေခံသည့် လူမှုဘဝဖြစ်ပြီး မိုး၊ နေရောင်၊ စိုက်ပျိုးရေး cycle အတိုင်း ဘဝကို တည်ဆောက်ခဲ့ကြသည်။ နတ်ယုံကြည်မှု (animism) အရ သစ်ပင်၊ မြစ်၊ တောင်များကို နတ်ရှိသည်ဟု ယုံကြည်ကာ နတ်တော်လကဲ့သို့သော နတ်ပွဲများမှာ အလွန်ရှေးကျသော ပွဲတော်များဖြစ်ကြသည်။",
      img: "./assets/images/events/13.jpg",
    },
    {
      title: "ပုဂံခေတ် (11–13 ရာစု)",
      desc: "အနော်ရထာမင်းကြီးက ထေရဝါဒဗုဒ္ဓဘာသာကို တည်ထောင်ပြီးနောက် ပွဲတော်များကို “ဘာသာရေးအခြေခံ” ဖြစ်လာစေခဲ့သည်။ ဝါဆို၊ ကထိန်၊ သီတင်းကျွတ်နှင့် ကဆုန်ညောင်ရေသွန်းပွဲများ ပေါ်ထွန်းလာပြီး နတ်ယုံကြည်မှုမှ ဗုဒ္ဓဘာသာနှင့် နတ်ပေါင်းစပ်သော ယဉ်ကျေးမှုသို့ ကူးပြောင်းခဲ့သည်။",
      img: "./assets/images/events/14.jpg",
    },
    {
      title: "တောင်ငူ / ကုန်းဘောင်ခေတ်",
      desc: "ပွဲတော်များသည် တော်ဝင်ပွဲတော်နှင့် ပြည်သူပွဲတော်များအဖြစ် ခွဲခြားလာသည်။ သင်္ကြန်၊ တော်သလင်းလှေလှော်ပွဲ (စစ်ရေး + အားကစား) နှင့် ပြာသိုမြင်းပြိုင်ပွဲ (တော်ဝင်အင်အားပြ) တို့မှာ ထင်ရှားသည်။ ပွဲတော်များသည် ဘာသာရေး၊ နိုင်ငံရေးနှင့် အင်အားပြပွဲများအဖြစ် အချက်အချာကျခဲ့သည်။",
      img: "./assets/images/events/15.jpg",
    },
    {
      title: "ကိုလိုနီခေတ် (1824–1948)",
      desc: "အင်္ဂလိပ်တို့ ဝင်လာပြီးနောက် တော်ဝင်ပွဲတော်များ ပျက်သွားသော်လည်း လူထုရိုးရာပွဲများ မပျက်ခဲ့ပါ။ သင်္ကြန်သည် လူထုအပျော်ပွဲပိုဖြစ်လာပြီး ဘုရားပွဲများတွင် စျေးတန်းနှင့် ရောင်းဝယ်ရေးများ ပါဝင်လာသည်။ ဘာသာရေးနှင့် လူထုယဉ်ကျေးမှုကြောင့် ပွဲတော်များ ဆက်လက်ရှင်သန်နိုင်ခဲ့သည်။",
      img: "./assets/images/events/16.jpg",
    },
    {
      title: "လွတ်လပ်ရေးခေတ် (1948–1988)",
      desc: "နိုင်ငံတည်ဆောက်ရေးကာလတွင် ပွဲတော်များကို ယဉ်ကျေးမှုအမွေအနှစ်အဖြစ် တန်ဖိုးထား ထိန်းသိမ်းခဲ့သည်။ ကျောင်းစာများတွင် “တန်ခူးလ သင်္ကြန်ပွဲ…” စသည့် mnemonic များဖြင့် စတင်သင်ကြားခဲ့ပြီး ရိုးရာပုံစံကို မပျောက်ပျက်အောင် စနစ်တကျ ကြိုးပမ်းခဲ့ကြသည်။",
      img: "./assets/images/events/17.jpg",
    },
    {
      title: "အခုခေတ် (2000s → Present)",
      desc: "Globalization နှင့် နည်းပညာကြောင့် ပွဲတော်များစွာ ပြောင်းလဲလာသည်။ သင်္ကြန်တွင် DJ နှင့် စင်တင်တေးဂီတများ၊ သီတင်းကျွတ်တွင် LED မီးအလှပွဲတော်များ၊ တန်ဆောင်မုန်း တောင်ကြီးမီးပုံးပျံပွဲတော်ကဲ့သို့သော ခရီးသွားဆွဲဆောင်မှု Tourism Event ကြီးများအဖြစ် တိုးတက်လာခဲ့သည်။",
      img: "./assets/images/events/18.jpg",
    },
  ];

  const historyHeader = document.getElementById("history-header-trigger");
  const carouselContainer = document.getElementById(
    "history-carousel-container",
  );
  const track = document.getElementById("carousel-track");
  const detailView = document.getElementById("history-detail-view");
  let currentIndex = 0;
  let isHistoryOpen = false;

  const initHistoryCarousel = () => {
    track.innerHTML = "";
    historyData.forEach((data, i) => {
      const card = document.createElement("div");
      card.className = "history-card-3d";
      card.style.backgroundImage = `url(${data.img})`;
      card.innerHTML = `
        <div class="card-content-3d">
          <h3 style="opacity: 0; transform: translateY(15px); transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); color: #c49a2a; font-family: 'Playfair Display', serif;">${data.title}</h3>
        </div>
      `;

      // Hover listeners to reveal title
      card.onmouseenter = () => {
        const title = card.querySelector("h3");
        if (title) {
          title.style.opacity = "1";
          title.style.transform = "translateY(0)";
        }
      };
      card.onmouseleave = () => {
        const title = card.querySelector("h3");
        if (title) {
          title.style.opacity = "0";
          title.style.transform = "translateY(15px)";
        }
      };

      card.onclick = () => toggleDetailMode(i, card);
      track.appendChild(card);
    });
    updateCarouselLayout();
  };

  const updateCarouselLayout = () => {
    const cards = document.querySelectorAll(".history-card-3d");
    cards.forEach((card, i) => {
      card.classList.remove("active");
      let offset = i - currentIndex;

      // Loop index logic
      if (offset > 3) offset -= historyData.length;
      if (offset < -3) offset += historyData.length;

      let transform = "";
      let opacity = 0;
      let zIndex = 0;
      let filter = "none";

      if (offset === 0) {
        // Center
        transform = "translateZ(0) scale(1.2)";
        opacity = 1;
        zIndex = 10;
        card.classList.add("active");
      } else if (Math.abs(offset) === 1) {
        // Sides
        transform = `translateX(${offset * 180}px) translateZ(-200px) rotateY(${offset * -35}deg) scale(0.9)`;
        opacity = 0.6;
        zIndex = 5;
        filter = "blur(4px)";
      } else {
        transform = `translateX(${offset * 250}px) translateZ(-400px) opacity(0)`;
        opacity = 0;
      }

      card.style.transform = transform;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.style.filter = filter;
    });
  };

  const toggleDetailMode = (index, card) => {
    const isDetailing = detailView.style.display === "flex";
    if (!isDetailing) {
      // Enter Detail
      carouselContainer.style.display = "none";
      detailView.style.display = "flex";

      const title3d = document.getElementById("detail-title-3d");
      const desc3d = document.getElementById("detail-desc-3d");

      title3d.innerText = historyData[index].title;
      desc3d.innerText = historyData[index].desc;

      [title3d, desc3d].forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "none";
        el.style.color = i === 0 ? "#c49a2a" : "";
        setTimeout(() => {
          el.style.transition =
            "opacity 0.8s ease-out, transform 0.8s ease-out";
          el.style.transitionDelay = `${i * 0.2}s`;
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
        }, 50);
      });

      const clonedCard = card.cloneNode(true);
      clonedCard.style.transform = "none";
      clonedCard.style.position = "relative";
      clonedCard.onclick = () => toggleDetailMode(index, card); // Click to go back

      // Ensure title is visible in detail view
      const clonedTitle = clonedCard.querySelector("h3");
      if (clonedTitle) {
        clonedTitle.style.opacity = "1";
        clonedTitle.style.transform = "translateY(0)";
      }

      document.getElementById("detail-card-placeholder").innerHTML = "";
      document
        .getElementById("detail-card-placeholder")
        .appendChild(clonedCard);
    } else {
      // Exit Detail
      detailView.style.display = "none";
      carouselContainer.style.display = "flex";
    }
  };

  function resetHistoryView() {
    const historySection = document.getElementById("history-section");
    if (!historySection || !isHistoryOpen) return;

    historySection.classList.remove("active");
    historyHeader.classList.remove("active");
    carouselContainer.style.display = "none";
    detailView.style.display = "none";
    isHistoryOpen = false;
  }

  historyHeader.addEventListener("click", () => {
    if (!isHistoryOpen) {
      const historySection = document.getElementById("history-section");
      historySection.classList.add("active");
      historyHeader.classList.add("active");
      carouselContainer.style.display = "flex";
      initHistoryCarousel();
      isHistoryOpen = true;
      // Scroll to history smooth
      historyHeader.scrollIntoView({ behavior: "smooth" });
    }
  });

  document.getElementById("prev-history").onclick = () => {
    currentIndex = (currentIndex - 1 + historyData.length) % historyData.length;
    updateCarouselLayout();
  };

  document.getElementById("next-history").onclick = () => {
    currentIndex = (currentIndex + 1) % historyData.length;
    updateCarouselLayout();
  };

  window.addEventListener("scroll", () => {
    const historySection = document.getElementById("history-section");
    if (!historySection) return;

    const rect = historySection.getBoundingClientRect();

    if (rect.top > 650 && isHistoryOpen) {
      resetHistoryView();
    }
  });
}
