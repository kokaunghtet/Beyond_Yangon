const tourismSlides = [
  {
    title: "Bago Overview",
    image: "./assets/images/torisum/Bago/overview.jpg",
    alt: "Overview of Bago",
    description:
      "Ancient pagodas, royal history, and flavorful local dishes come together in a polished destination story.",
    season: "October to February",
    mood: "Sacred + Scenic",
    tagline:
      "A soft arrival into temple silhouettes, old capitals, and calm roadside textures.",
    location: "Bago Region",
    fact: "Layered with Mon heritage, royal history, and pilgrimage routes.",
  },
  {
    title: "Shwemawdaw Pagoda",
    image: "./assets/images/torisum/Bago/shwe%20mawdaw.jpg",
    alt: "Shwemawdaw Pagoda in Bago",
    description:
      "Use this moment as the gold-toned centerpiece of the page, with scale, pilgrimage, and skyline energy.",
    season: "Sunrise to late afternoon",
    mood: "Monumental + Spiritual",
    tagline:
      "One of Bago's most iconic sights, framed like a destination campaign hero shot.",
    location: "Central Bago",
    fact: "Its towering stupa gives the gallery a strong vertical landmark.",
  },
  {
    title: "Kanbawzathadi Palace",
    image: "./assets/images/torisum/Bago/Kanbawzathadi%20Palace.jpg",
    alt: "Kanbawzathadi Palace in Bago",
    description:
      "A royal-history slide that balances sacred architecture with the memory of an older capital city.",
    season: "Morning visit",
    mood: "Historic + Reflective",
    tagline:
      "Wood, symmetry, and royal echoes make this stop feel curated instead of generic.",
    location: "Historic Bago",
    fact: "Perfect for a timeline-style travel plan or heritage spotlight.",
  },
  {
    title: "Kyaik Pun Pagoda",
    image: "./assets/images/torisum/Bago/Kyaik%20Pun%20Pagoda.jpg",
    alt: "Kyaik Pun Pagoda in Bago",
    description:
      "This scene adds scale and identity, with seated Buddhas creating a memorable silhouette for the UI.",
    season: "Late morning",
    mood: "Calm + Iconic",
    tagline:
      "A destination frame with strong symmetry and immediate recognition.",
    location: "Outer Bago",
    fact: "Its four giant Buddha images make the page feel unmistakably local.",
  },
  {
    title: "Mon-style Mohinga",
    image: "./assets/images/torisum/Bago/Mon-style%20Mohinga.jpg",
    alt: "Mon-style Mohinga dish",
    description:
      "Tourism feels more complete when food is treated like a visual stop, not a footnote.",
    season: "Lunch stop",
    mood: "Warm + Local",
    tagline:
      "Round out the gallery with texture, flavor, and a clear invitation to explore Bago through food.",
    location: "Taste Trail",
    fact: "This slide gives the page a human-scale break from architecture-heavy visuals.",
  },
];

const tourismSpots = [
  {
    eyebrow: "Historic Landmark",
    title: "Kanbawzathadi Palace",
    image: "./assets/images/torisum/Bago/Kanbawzathadi%20Palace.jpg",
    alt: "Kanbawzathadi Palace",
    description:
      "Start with architecture and memory. This stop gives the tourism page a strong visual anchor and a sense of Bago's royal past.",
    bullets: [
      "Best for early light photography",
      "Strong first stop for a one-day route",
      "Pairs well with nearby pagoda visits",
    ],
  },
  {
    eyebrow: "Golden Monument",
    title: "Shwemawdaw Pagoda",
    image: "./assets/images/torisum/Bago/Shwemawdaw%20Pagoda%20Festival.jpg",
    alt: "Shwemawdaw Pagoda Festival",
    description:
      "This is the big visual crescendo. It gives the interface height, glow, and a sense of active devotion in the city.",
    bullets: [
      "Best scene for sunset-toned visuals",
      "Works as the emotional peak of the route",
      "Connects heritage with festival energy",
    ],
  },
  {
    eyebrow: "Local Flavors",
    title: "Local Taste Trail",
    image: "./assets/images/torisum/Bago/Traditional%20Snacks%20(Mont).jpg",
    alt: "Traditional Snacks in Bago",
    description:
      "Food adds everyday life to the page. Use Bago snacks and Mon-style mohinga to turn the design into a full tourism story.",
    bullets: [
      "Great midday stop between landmarks",
      "Balances sacred sites with lived culture",
      "Adds texture and local personality to the UI",
    ],
  },
];

const heroImage = document.getElementById("heroImage");
const heroTitle = document.getElementById("heroTitle");
const heroDescription = document.getElementById("heroDescription");
const heroSeason = document.getElementById("heroSeason");
const heroMood = document.getElementById("heroMood");
const heroTagline = document.getElementById("heroTagline");
const heroLocation = document.getElementById("heroLocation");
const heroFact = document.getElementById("heroFact");
const thumbsContainer = document.getElementById("tourismThumbs");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
const tourismVisual = document.getElementById("tourismVisual");
const slideFrame = document.querySelector(".tourism-slide-frame");

const experienceButtons = Array.from(
  document.querySelectorAll(".tourism-info-card"),
);
const spotImage = document.getElementById("spotImage");
const spotEyebrow = document.getElementById("spotEyebrow");
const spotTitle = document.getElementById("spotTitle");
const spotDescription = document.getElementById("spotDescription");
const spotBullets = document.getElementById("spotBullets");

let activeSlideIndex = 0;
let autoplayId = null;

function renderThumbs() {
  if (!thumbsContainer) return;

  tourismSlides.forEach((slide, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = "tourism-thumb";
    thumb.setAttribute("aria-label", `Show ${slide.title}`);
    thumb.innerHTML = `<img src="${slide.image}" alt="${slide.alt}">`;
    thumb.addEventListener("click", () => {
      setSlide(index);
      restartAutoplay();
    });
    thumbsContainer.appendChild(thumb);
  });
}

function syncThumbState() {
  const thumbs = thumbsContainer?.querySelectorAll(".tourism-thumb") || [];
  thumbs.forEach((thumb, index) => {
    thumb.classList.toggle("is-active", index === activeSlideIndex);
  });
}

function setSlide(index) {
  const slide = tourismSlides[index];
  if (!slide || !heroImage) return;

  activeSlideIndex = index;
  slideFrame?.classList.add("is-changing");

  window.setTimeout(() => {
    heroImage.src = slide.image;
    heroImage.alt = slide.alt;
    heroTitle.textContent = slide.title;
    heroDescription.textContent = slide.description;
    heroSeason.textContent = slide.season;
    heroMood.textContent = slide.mood;
    heroTagline.textContent = slide.tagline;
    heroLocation.textContent = slide.location;
    heroFact.textContent = slide.fact;
    syncThumbState();
    slideFrame?.classList.remove("is-changing");
  }, 180);
}

function stepSlide(direction) {
  const nextIndex =
    (activeSlideIndex + direction + tourismSlides.length) % tourismSlides.length;
  setSlide(nextIndex);
  restartAutoplay();
}

function startAutoplay() {
  autoplayId = window.setInterval(() => {
    stepSlide(1);
  }, 4200);
}

function restartAutoplay() {
  if (autoplayId) window.clearInterval(autoplayId);
  startAutoplay();
}

function setSpot(index) {
  const spot = tourismSpots[index];
  if (!spot || !spotImage) return;

  experienceButtons.forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === index);
  });

  spotImage.src = spot.image;
  spotImage.alt = spot.alt;
  spotEyebrow.textContent = spot.eyebrow;
  spotTitle.textContent = spot.title;
  spotDescription.textContent = spot.description;
  spotBullets.innerHTML = spot.bullets.map((item) => `<li>${item}</li>`).join("");
}

function bindSpotButtons() {
  experienceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.spot);
      setSpot(index);
    });
  });
}

function bindScrollButtons() {
  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scrollTarget);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function bindHeroMotion() {
  if (!tourismVisual || !slideFrame) return;

  tourismVisual.addEventListener("mousemove", (event) => {
    const rect = tourismVisual.getBoundingClientRect();
    const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
    const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 11;

    slideFrame.style.transform =
      `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  tourismVisual.addEventListener("mouseleave", () => {
    slideFrame.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

function bindRevealAnimation() {
  const revealItems = document.querySelectorAll("[data-tour-reveal], .tourism-timeline-item");
  if (!revealItems.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 },
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initializeTourismPage() {
  if (!heroImage) return;

  renderThumbs();
  syncThumbState();
  bindSpotButtons();
  bindScrollButtons();
  bindHeroMotion();
  bindRevealAnimation();

  prevSlideBtn?.addEventListener("click", () => stepSlide(-1));
  nextSlideBtn?.addEventListener("click", () => stepSlide(1));

  setSlide(0);
  setSpot(0);
  startAutoplay();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeTourismPage);
} else {
  initializeTourismPage();
}
