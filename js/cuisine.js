const cards = document.querySelectorAll(".upfood-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "fadeUp 0.8s ease forwards";
      }
    });
  },
  {
    threshold: 0.2,
  },
);

cards.forEach((card) => {
  observer.observe(card);
});

let activeFood = null;

const foods = [
  {
    name: "Mohinga",
    desc: "Fish noodle soup",
    ingredients: "Fish, lemongrass, banana stem, rice noodles, garlic, onion",
    howTo:
      "Boil fish with spices →mash → cook broth → add noodles → serve hot.",
    img: "./assets/images/cuisines/mohinga.jpg",
  },
  {
    name: "KaYayKaYar",
    desc: "Snack",
    ingredients:
      "Rice flour,Gram flour (or chickpea flour),Water,Salt,Turmeric (for color, optional),Filling (commonly):",
    howTo:
      "Mix rice flour + gram flour + water into a thick but pourable batter. Add salt and a pinch of turmeric.",
    img: "./assets/images/cuisines/kayaykayar.jpg",
  },
  {
    name: "Ah Kyaw Sone",
    desc: "Snack",
    ingredients:
      "Mixed vegetables, (banana, gourd, onion, potato, eggplant, etc.),Tofu (optional),Shrimp (optional),Rice, flourGram, flourBaking soda, (a pinch)Salt,Turmeric,Water,Oil (for frying)",
    howTo:
      "Mix rice flour + gram flour + water + salt + turmeric + a pinch of baking soda. Batter should coat ingredients well..",
    img: "./assets/images/cuisines/ahkyawsone.jpg",
  },
  {
    name: "Shan Noodles",
    desc: "Rice noodles",
    ingredients: "Rice noodles, chicken, garlic oil, soy sauce, peanuts",
    howTo: "Cook noodles → prepare chicken sauce → mix → top with peanuts.",
    img: "./assets/images/cuisines/shannoodle.jpg",
  },

  {
    name: "Laphet Thoke",
    desc: "Tea salad",
    ingredients:
      "Fermented tea leaves, cabbage, tomato, garlic oil, fried beans, peanuts, sesame seeds, lime, chili",
    howTo:
      "Mix fermented tea leaves with oil → add chopped cabbage & tomato → top with fried beans, peanuts & seeds → squeeze lime → mix before eating ",
    img: "./assets/images/cuisines/lahpetthoke.jpg",
  },

  {
    name: "Ohn No Khao Swe",
    desc: "Coconut noodles",
    ingredients:
      "Wheat noodles, chicken, coconut milk, onion, garlic, turmeric, fish sauce",
    howTo:
      "Cook chicken with spices → add coconut milk → simmer → boil noodles → pour curry over noodles → garnish",
    img: "./assets/images/cuisines/ohnonoodle.jpg",
  },
  {
    name: "Nan Gyi Thoke",
    desc: "Noodle salad",
    ingredients:
      "Thick rice noodles, chicken curry, boiled egg, chickpea powder, chili oil",
    howTo:
      "Cook noodles → mix with chicken curry → add chickpea powder → top with egg & chili oil → mix well",
    img: "./assets/images/cuisines/mandalay_montti.jpg",
  },

  {
    name: "Mont Lin Ma Yar",
    desc: "Snack",
    ingredients: "Rice flour batter, quail eggs, spring onion, chickpeas",
    howTo:
      "Pour batter into round pan → add fillings → cook until crispy → join two halves together",
    img: "./assets/images/cuisines/montlinmayar.jpg",
  },

  {
    name: "Tofu Nway",
    desc: "Tofu",
    ingredients: "Chickpea flour, water, garlic oil, soy sauce",
    howTo:
      "Cook chickpea mixture until thick → pour into bowl → add sauce & oil → serve warm",
    img: "./assets/images/cuisines/tofu.jpg",
  },

  {
    name: "Kyar San Hin Kar",
    desc: "Noodles",
    ingredients: "Glass noodles, chicken/pork, mushroom, garlic, pepper",
    howTo:
      "Boil broth → add meat & mushrooms → add noodles → cook briefly → season and serve",
    img: "./assets/images/cuisines/kyarzanhin.jpg",
  },

  {
    name: "Nga Htamin",
    desc: "Fish rice",
    ingredients: "Rice, fish, turmeric, garlic oil, crispy toppings",
    howTo:
      "Cook fish with spices → mix with rice → top with fried garlic & crispy bits",
    img: "./assets/images/cuisines/fishrice.jpg",
  },

  {
    name: "Mont Ti",
    desc: "Noodles",
    ingredients: "Rice noodles, fish broth, chili, garlic, lemongrass",
    howTo: "Prepare spicy fish broth → add noodles → top with herbs & chili",
    img: "./assets/images/cuisines/arpu.jpg",
  },

  {
    name: "Htamin Chin",
    desc: "Rice",
    ingredients: "Rice, turmeric, oil, salt",
    howTo:
      "Cook rice → mix with turmeric & oil → let ferment slightly → serve with fried fish",
    img: "./assets/images/cuisines/htaminchin.jpg",
  },

  {
    name: "Mont Lone Yay Paw",
    desc: "Snack",
    ingredients: "Sticky rice flour, palm sugar, coconut",
    howTo:
      "Wrap palm sugar with dough → boil until floating → coat with coconut",
    img: "./assets/images/cuisines/montloneyaypaw.jpg",
  },
];

const container = document.getElementById("foods");
const plate = document.getElementById("centerPlate");
const notebook = document.getElementById("notebook");
const circleWrap = document.getElementById("circleWrap");

//  CREATE FOODS
function createFoods() {
  const size = 600;
  const center = size / 2;
  const radius = 250;
  const foodSize = 110;

  foods.forEach((food, i) => {
    const div = document.createElement("div");
    div.className = "food";

    const angle = (i / foods.length) * 2 * Math.PI;

    const x = center + radius * Math.cos(angle) - foodSize / 2;
    const y = center + radius * Math.sin(angle) - foodSize / 2;

    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.dataset.index = i;
    div.dataset.x = x;
    div.dataset.y = y;

    div.innerHTML = `
      <div class="shadow"></div>
      <img src="${food.img}" />
    `;

    div.addEventListener("click", () => focusFood(i, div));

    container.appendChild(div);
  });
}

//  FOCUS FOOD
function focusFood(index, el) {
  // reset previous
  if (activeFood && activeFood !== el) {
    resetFood(activeFood);
  }

  // move into plate
  moveIntoPlate(el);

  activeFood = el;

  notebook.classList.add("active");
  circleWrap.classList.add("move-left");

  showFood(index);
}

//  MOVE TO CENTER
function moveToCenter(el) {
  const scale = 1.4;

  const plateRect = plate.getBoundingClientRect();
  const foodRect = el.getBoundingClientRect();

  // centers
  const plateCX = plateRect.left + plateRect.width / 2;
  const plateCY = plateRect.top + plateRect.height / 2;

  const foodCX = foodRect.left + foodRect.width / 2;
  const foodCY = foodRect.top + foodRect.height / 2;

  let dx = plateCX - foodCX;
  let dy = plateCY - foodCY;

  //  adjust for scaling (VERY IMPORTANT)
  const offsetX = (foodRect.width * (scale - 1)) / 2;
  const offsetY = (foodRect.height * (scale - 1)) / 2;

  dx -= offsetX;
  dy -= offsetY;

  //  tiny visual tweak (optional, makes it feel perfect)
  dy -= 4; // lift slightly (looks more centered on plate)

  el.style.transition = "transform 0.6s cubic-bezier(0.25, 1, 0.3, 1)";
  el.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
  el.style.zIndex = "30";
}

//  RESET FOOD
function resetFood(el) {
  el.style.transition = "all 0.6s ease";

  // put back in correct order
  const index = parseInt(el.dataset.index);
  const children = container.children;

  if (index >= children.length) {
    container.appendChild(el);
  } else {
    container.insertBefore(el, children[index]);
  }

  // restore original layout
  el.style.position = "absolute";
  el.style.left = el.dataset.x + "px";
  el.style.top = el.dataset.y + "px";

  el.style.transform = "scale(1)";
  el.style.zIndex = "1";
}

function moveIntoPlate(el) {
  el.style.transition = "all 0.6s ease";

  // move into plate
  plate.appendChild(el);

  // reset layout for center
  el.style.position = "relative";
  el.style.left = "0px";
  el.style.top = "0px";

  el.style.transform = "scale(1.4)";
  el.style.zIndex = "50";
}

//  CLICK CENTER TO RESET
plate.addEventListener("click", () => {
  if (activeFood) {
    resetFood(activeFood);
    activeFood = null;

    notebook.classList.remove("active");
    circleWrap.classList.remove("move-left");
  }
});

//  TEXT
function typeWriter(id, text, speed = 20) {
  const el = document.getElementById(id);
  if (!el) return;

  el.innerHTML = ""; // clear first
  let i = 0;

  function typing() {
    if (i < text.length) {
      el.innerHTML += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }

  typing();
}
function showFood(i) {
  const food = foods[i];

  flipPage();

  setTimeout(() => {
    document.getElementById("foodTitle").innerText = food.name;

    typeWriter("desc", food.desc);
    setTimeout(() => typeWriter("ingredients", food.ingredients), 300);
    setTimeout(() => typeWriter("howTo", food.howTo), 600);
  }, 400); // wait mid-flip
}

function flipPage() {
  const page = document.getElementById("page");

  page.classList.add("flip");

  setTimeout(() => {
    page.classList.remove("flip");
  }, 800);
}

// SVG HANDWRITING
function drawTextSVG(text) {
  const path = document.getElementById("textPath");
  if (!path) return;

  const svg = path.ownerSVGElement;
  const svgNS = "http://www.w3.org/2000/svg";

  const temp = document.createElementNS(svgNS, "text");
  temp.setAttribute("x", 10);
  temp.setAttribute("y", 50);
  temp.setAttribute("font-size", "40");
  temp.setAttribute("font-family", "Patrick Hand");
  temp.textContent = text;

  svg.appendChild(temp);

  const length = temp.getComputedTextLength();

  path.setAttribute("d", `M10 50 H${10 + length}`);

  svg.removeChild(temp);

  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  path.style.animation = "none";
  void path.offsetWidth;
  path.style.animation = "draw 2s ease forwards";
}

createFoods();

// optional mouse tilt effect
const circle = document.querySelector(".circle");

document.addEventListener("mousemove", (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  circle.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
});
const spiral = document.querySelector(".spiral");

for (let i = 0; i < 10; i++) {
  const ring = document.createElement("div");
  spiral.appendChild(ring);
}
