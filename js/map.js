import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer.js";

// ─── Scene setup ─────────────────────────────────────────────────────────────
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const map = document.getElementById("map");
map.appendChild(renderer.domElement);

// CSS2D renderer for labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.top = "50px";
labelRenderer.domElement.style.pointerEvents = "none"; // labels don't block clicks
map.appendChild(labelRenderer.domElement);

// ─── Lighting ─────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(0xffffff, 2.0));
const pointLight = new THREE.PointLight(0xffffff, 1.2);
pointLight.position.set(20, 50, 20);
scene.add(pointLight);

// ─── Main group ───────────────────────────────────────────────────────────────
const mainGroup = new THREE.Group();
scene.add(mainGroup);

// ─── Famous places data ───────────────────────────────────────────────────────
const famousPlaces = {
  Yangon: [
    {
      name: "Shwedagon Pagoda",
      lon: 96.1497,
      lat: 16.8624,
      type: "religious",
      image: "./assets/images/famous_places/yangon/shwedagonpagoda.jpg",
    },
    {
      name: "Kandawgyi Lake",
      lon: 96.1656,
      lat: 16.792,
      type: "nature",
      image: "./assets/images/famous_places/yangon/kandawgyilake.jpg",
    },
    {
      name: "Bogyoke Aung San Market",
      lon: 96.1583,
      lat: 16.777,
      type: "cultural",
      image: "./assets/images/famous_places/yangon/bogyokemarket.JPG",
    },
  ],

  Mandalay: [
    {
      name: "Mahamuni Pagoda",
      lon: 96.0789,
      lat: 21.9554,
      type: "religious",
      image: "./assets/images/famous_places/mandalay/mahamunipagoda.jpg",
    },
    {
      name: "U Bein Bridge",
      lon: 96.049,
      lat: 21.8895,
      type: "nature",
      image: "./assets/images/famous_places/mandalay/ubeinbridge.jpg",
    },
    {
      name: "Mandalay Palace",
      lon: 96.1891,
      lat: 21.9831,
      type: "cultural",
      image: "./assets/images/famous_places/mandalay/mandalaypalace.jpeg",
    },
  ],

  Bago: [
    {
      name: "Shwemawdaw Pagoda",
      lon: 96.4787,
      lat: 17.3358,
      type: "religious",
      image: "./assets/images/famous_places/bago/shwemawdawpagoda.jpg",
    },
    {
      name: "Kyaikpun Pagoda Garden",
      lon: 96.4822,
      lat: 17.3181,
      type: "nature",
      image: "./assets/images/famous_places/bago/kyaikpunpagodagarden.jpg",
    },
    {
      name: "Kanbawzathadi Palace",
      lon: 96.489,
      lat: 17.3353,
      type: "cultural",
      image: "./assets/images/famous_places/bago/kanbawzathadipalace.JPG",
    },
  ],

  Ayeyarwady: [
    {
      name: "Shwemokhtaw Pagoda",
      lon: 94.732,
      lat: 16.7792,
      type: "religious",
      image: "./assets/images/famous_places/ayeyarwady/shwemokhtawpagoda.jpg",
    },
    {
      name: "Ngwe Saung Beach",
      lon: 94.3775,
      lat: 16.878,
      type: "nature",
      image: "./assets/images/famous_places/ayeyarwady/ngwesaungbeach.jpg",
    },
    {
      name: "Pathein Umbrella Workshops",
      lon: 94.7325,
      lat: 16.779,
      type: "cultural",
      image:
        "./assets/images/famous_places/ayeyarwady/patheinumbrellaworkshops.jpg",
    },
  ],

  Magway: [
    {
      name: "Myat Tha Lun Pagoda",
      lon: 94.9325,
      lat: 20.1507,
      type: "religious",
      image: "./assets/images/famous_places/magway/myatthalunpagoda.jpg",
    },
    {
      name: "Minbu Mud Volcanoes",
      lon: 94.875,
      lat: 20.18,
      type: "nature",
      image: "./assets/images/famous_places/magway/minbumudvolcanoes.webp",
    },
    {
      name: "Magway Riverfront",
      lon: 94.93,
      lat: 20.15,
      type: "cultural",
      image: "./assets/images/famous_places/magway/magwayriverfront.jpg",
    },
  ],

  Sagaing: [
    {
      name: "Soon U Ponya Shin Pagoda",
      lon: 95.9423,
      lat: 21.9017,
      type: "religious",
      image: "./assets/images/famous_places/sagaing/SoonUPonyaShinPagoda.jpg",
    },
    {
      name: "Sagaing Hills",
      lon: 95.8629,
      lat: 21.8787,
      type: "nature",
      image: "./assets/images/famous_places/sagaing/SagaingHills.jpg",
    },
    {
      name: "Monywa Thanboddhay Pagoda Complex",
      lon: 95.1367,
      lat: 22.1083,
      type: "cultural",
      image:
        "./assets/images/famous_places/sagaing/MonywaThanboddhayPagoda.jpg",
    },
  ],

  Tanintharyi: [
    {
      name: "Shin Koe Shin Pagoda",
      lon: 98.6,
      lat: 12.45,
      type: "religious",
      image: "./assets/images/famous_places/tanintharyi/ShinKoeShinPagoda.jpg",
    },
    {
      name: "Myeik Archipelago",
      lon: 98.6,
      lat: 12.45,
      type: "nature",
      image: "./assets/images/famous_places/tanintharyi/MyeikArchipelago.jpg",
    },
    {
      name: "Dawei Old Town",
      lon: 98.2,
      lat: 14.0833,
      type: "cultural",
      image: "./assets/images/famous_places/tanintharyi/DaweiOldTown.jpg",
    },
  ],

  Mon: [
    {
      name: "Kyaiktiyo Pagoda",
      lon: 97.479,
      lat: 17.4816,
      type: "religious",
      image: "./assets/images/famous_places/mon/KyaiktiyoPagoda.jpg",
    },
    {
      name: "Bilu Island",
      lon: 97.65,
      lat: 16.5,
      type: "nature",
      image: "./assets/images/famous_places/mon/BiluIsland.jpeg",
    },
    {
      name: "Mawlamyine Strand Road",
      lon: 97.625,
      lat: 16.49,
      type: "cultural",
      image: "./assets/images/famous_places/mon/MawlamyineStrandRoad.JPG",
    },
  ],

  Kayin: [
    {
      name: "Kyauk Kalap Pagoda",
      lon: 97.716,
      lat: 16.75,
      type: "religious",
      image: "./assets/images/famous_places/kayin/Kyauk-Kalap-Monastery.jpg",
    },
    {
      name: "Mount Zwegabin",
      lon: 97.7167,
      lat: 16.7333,
      type: "nature",
      image: "./assets/images/famous_places/kayin/Hpa-An-Myanmar.webp",
    },
    {
      name: "Hpa-An Town",
      lon: 97.6333,
      lat: 16.8833,
      type: "cultural",
      image: "./assets/images/famous_places/kayin/Hpa-An Town.jpg",
    },
  ],

  Kayah: [
    {
      name: "Taung Kwe Pagoda",
      lon: 97.208,
      lat: 19.677,
      type: "religious",
      image: "./assets/images/famous_places/kayah/taung-kwe-pagoda-loikaw.jpg",
    },
    {
      name: "Seven Steps Lake",
      lon: 97.275,
      lat: 19.683,
      type: "nature",
      image: "./assets/images/famous_places/kayah/sevenstepslake.webp",
    },
    {
      name: "Loikaw Cultural Museum",
      lon: 97.206,
      lat: 19.675,
      type: "cultural",
      image: "./assets/images/famous_places/kayah/LoikawCulturalMuseum.png",
    },
  ],

  Shan: [
    {
      name: "Phaung Daw Oo Pagoda",
      lon: 96.93,
      lat: 20.586,
      type: "religious",
      image: "./assets/images/famous_places/shan/PhaungDawOoPagoda.jpg",
    },
    {
      name: "Inle Lake",
      lon: 96.93,
      lat: 20.586,
      type: "nature",
      image: "./assets/images/famous_places/shan/Inle_Lake_Header.jpg",
    },
    {
      name: "Taunggyi",
      lon: 97.033,
      lat: 20.789,
      type: "cultural",
      image: "./assets/images/famous_places/shan/Taunggyi.jpg",
    },
  ],

  Kachin: [
    {
      name: "Shwe Myintzu Pagoda",
      lon: 97.3964,
      lat: 25.3833,
      type: "religious",
      image: "./assets/images/famous_places/kachin/ShweMyintzuPagoda.jpg",
    },
    {
      name: "Indawgyi Lake",
      lon: 97.3965,
      lat: 25.1,
      type: "nature",
      image: "./assets/images/famous_places/kachin/IndawgyiLake.jpg",
    },
    {
      name: "Myitkyina Town",
      lon: 97.3964,
      lat: 25.3833,
      type: "cultural",
      image: "./assets/images/famous_places/kachin/MyitkyinaTown.jpg",
    },
  ],

  Chin: [
    {
      name: "Rih Lake Pagoda",
      lon: 93.3833,
      lat: 23.25,
      type: "religious",
      image: "./assets/images/famous_places/chin/RihLake.jpg",
    },
    {
      name: "Mount Victoria",
      lon: 93.7,
      lat: 21.2167,
      type: "nature",
      image: "./assets/images/famous_places/chin/MountVictoria.jpg",
    },
    {
      name: "Hakha Town",
      lon: 93.6167,
      lat: 22.65,
      type: "cultural",
      image: "./assets/images/famous_places/chin/HakhaTown.webp",
    },
  ],

  Rakhine: [
    {
      name: "Shittaung Pagoda",
      lon: 93.7167,
      lat: 20.5833,
      type: "religious",
      image: "./assets/images/famous_places/rakhine/ShittaungPagoda.jpg",
    },
    {
      name: "Ngapali Beach",
      lon: 94.4167,
      lat: 18.4333,
      type: "nature",
      image: "./assets/images/famous_places/rakhine/NgapaliBeach.jpg",
    },
    {
      name: "Mrauk U",
      lon: 93.7167,
      lat: 20.5833,
      type: "cultural",
      image: "./assets/images/famous_places/rakhine/MraukU.jpg",
    },
  ],
};

// ─── GeoJSON fetch ────────────────────────────────────────────────────────────
const STATE_COLOR = new THREE.Color(0xffd166);
const STATE_HOVER_COLOR = new THREE.Color(0xe6b84d);

fetch("./myanmar.json")
  .then((res) => res.json())
  .then((data) => {
    data.features.forEach((feature) => {
      const { geometry, properties } = feature;
      const stateName = properties.ST;
      const stateGroup = new THREE.Group();
      stateGroup.userData = { name: stateName };

      if (geometry.type === "Polygon") {
        stateGroup.add(createMesh(geometry.coordinates, STATE_COLOR));
      } else if (geometry.type === "MultiPolygon") {
        geometry.coordinates.forEach((polygon) => {
          stateGroup.add(createMesh(polygon, STATE_COLOR));
        });
      }

      // Attach famous place markers, hidden by default
      const places = famousPlaces[stateName] || [];
      const addedMarkers = [];

      places.forEach((place) => {
        const marker = createPlaceMarker(place);
        marker.visible = false;
        stateGroup.add(marker);
        addedMarkers.push(marker);
      });

      // Spread after all markers are added
      if (addedMarkers.length > 1) spreadMarkers(addedMarkers);

      mainGroup.add(stateGroup);
    });

    mainGroup.rotation.x = -Math.PI / 2;
  })
  .catch((err) => console.error("Error loading GeoJSON:", err));

// ─── Mesh factory ─────────────────────────────────────────────────────────────
function createMesh(shapes, color) {
  const threeShape = new THREE.Shape();
  const borderPoints = [];

  shapes.forEach((points, i) => {
    if (i === 0) {
      points.forEach((coord, index) => {
        const x = (coord[0] - 96) * 2;
        const y = (coord[1] - 20) * 2;
        if (index === 0) threeShape.moveTo(x, y);
        else threeShape.lineTo(x, y);
        borderPoints.push(new THREE.Vector3(x, y, 0.31));
      });
    } else {
      const holePath = new THREE.Path();
      points.forEach((coord, index) => {
        const x = (coord[0] - 96) * 2;
        const y = (coord[1] - 20) * 2;
        if (index === 0) holePath.moveTo(x, y);
        else holePath.lineTo(x, y);
      });
      threeShape.holes.push(holePath);
    }
  });

  const extrudeSettings = { depth: 0.3, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(threeShape, extrudeSettings);
  const material = new THREE.MeshPhongMaterial({ color, flatShading: false });
  const mesh = new THREE.Mesh(geometry, material);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(borderPoints);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
  const outline = new THREE.Line(lineGeometry, lineMaterial);

  const container = new THREE.Group();
  container.add(mesh);
  container.add(outline);
  return container;
}

// ─── Marker factory ───────────────────────────────────────────────────────────
function createPlaceMarker(place) {
  const x = (place.lon - 96) * 2;
  const y = (place.lat - 20) * 2;

  const typeColors = {
    religious: "#ff653f",
    nature: "#00cc88",
    cultural: "#3399ff",
  };
  const colorHex = typeColors[place.type] || "#ffffff";
  const color = new THREE.Color(colorHex);

  const container = new THREE.Group();

  // Pin head (sphere on top)
  const headGeo = new THREE.SphereGeometry(0.09, 12, 12);
  const mat = new THREE.MeshPhongMaterial({ color });
  const head = new THREE.Mesh(headGeo, mat);
  head.position.set(0, 0, 0.9);

  // Pin body (cone pointing down)
  const coneGeo = new THREE.ConeGeometry(0.08, 0.5, 8);
  const cone = new THREE.Mesh(coneGeo, mat);
  cone.rotation.x = Math.PI / 2;
  cone.rotation.z = Math.PI;
  cone.position.set(0, 0, 0.65);

  container.add(head);
  container.add(cone);

  // ──── Label ────
  const labelDiv = document.createElement("div");
  labelDiv.className = "place-label";
  labelDiv.textContent = place.name;
  labelDiv.style.cssText = `
    background: ${colorHex};
    color: #fff;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    pointer-events: none;
  `;

  const label = new CSS2DObject(labelDiv);
  label.position.set(0, 0, 1.2); // just above the pin head
  container.add(label);
  // ───────────────

  container.position.set(x, y, 0);
  container.userData = { isMarker: true, ...place };
  return container;
}

// ─── Spread overlapping markers ───────────────────────────────────────────────
function spreadMarkers(markers, minDist = 0.6) {
  const iterations = 5;

  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < markers.length; i++) {
      for (let j = i + 1; j < markers.length; j++) {
        const a = markers[i];
        const b = markers[j];

        const dx = b.position.x - a.position.x;
        const dy = b.position.y - a.position.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < minDist && dist > 0.001) {
          const push = (minDist - dist) / 2;
          const angle = Math.atan2(dy, dx);
          a.position.x -= Math.cos(angle) * push;
          a.position.y -= Math.sin(angle) * push;
          b.position.x += Math.cos(angle) * push;
          b.position.y += Math.sin(angle) * push;
        } else if (dist <= 0.001) {
          // Identical coords — spread evenly in a circle
          const angle = (2 * Math.PI * j) / markers.length;
          b.position.x += Math.cos(angle) * minDist;
          b.position.y += Math.sin(angle) * minDist;
        }
      }
    }
  }
}

// ─── Camera + controls ────────────────────────────────────────────────────────
camera.position.set(0, 25, 0);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableDamping = true;
const originCamPos = camera.position.clone();
const originTargetPos = controls.target.clone();

// ─── Fly-to state ─────────────────────────────────────────────────────────────
let flyTarget = null;

function flyToState(stateGroup) {
  const box = new THREE.Box3().setFromObject(stateGroup);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const dist = (maxDim / 2 / Math.tan(fov / 2)) * 1.6;

  flyTarget = {
    camPos: new THREE.Vector3(center.x, center.y + dist, center.z),
    targetPos: center.clone(),
    progress: 0,
    fromCam: camera.position.clone(),
    fromTarget: controls.target.clone(),
  };
}

function flyToOrigin() {
  flyTarget = {
    camPos: originCamPos.clone(),
    targetPos: originTargetPos.clone(),
    progress: 0,
    fromCam: camera.position.clone(),
    fromTarget: controls.target.clone(),
  };
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// ─── Highlight helpers ────────────────────────────────────────────────────────
function highlightState(stateGroup) {
  stateGroup.children.forEach((child) => {
    if (child.userData?.isMarker) return;
    child.traverse((node) => {
      if (node.isMesh) {
        node.userData.originalColor =
          node.userData.originalColor || node.material.color.clone();
        node.material.color.set(STATE_HOVER_COLOR);
        node.material.emissive.set(0x332200);
      }
    });
  });
}

function resetStateColor(stateGroup) {
  stateGroup.children.forEach((child) => {
    if (child.userData?.isMarker) return;
    child.traverse((node) => {
      if (node.isMesh && node.userData.originalColor) {
        node.material.color.copy(node.userData.originalColor);
        node.material.emissive.set(0x000000);
      }
    });
  });
}

function toggleStateMarkers(stateGroup, visible) {
  stateGroup.children.forEach((child) => {
    if (child.userData?.isMarker) child.visible = visible;
  });
}

// ─── Click handler ────────────────────────────────────────────────────────────
let activeStateGroup = null;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener("click", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(mainGroup.children, true);

  if (!intersects.length) return;

  // Check if we clicked a marker FIRST (priority over region clicks)
  for (const hit of intersects) {
    if (hit.object.parent?.userData?.isMarker) {
      showPlaceInfo(hit.object.parent.userData);
      return; // exit early, don't trigger region zoom
    }
  }

  // If not a marker, handle region click as before
  let obj = intersects[0].object;
  while (obj.parent && obj.parent !== mainGroup) {
    obj = obj.parent;
  }
  if (obj.parent !== mainGroup) return;

  if (activeStateGroup === obj) return;

  if (activeStateGroup) {
    toggleStateMarkers(activeStateGroup, false);
    resetStateColor(activeStateGroup);
  }

  activeStateGroup = obj;
  toggleStateMarkers(obj, true);
  highlightState(obj);
  flyToState(obj);
  backBtn.style.display = "block";
});

// ─── Render loop ──────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  if (flyTarget) {
    flyTarget.progress = Math.min(flyTarget.progress + 0.04, 1);
    const t = easeInOut(flyTarget.progress);
    camera.position.lerpVectors(flyTarget.fromCam, flyTarget.camPos, t);
    controls.target.lerpVectors(flyTarget.fromTarget, flyTarget.targetPos, t);
    if (flyTarget.progress >= 1) flyTarget = null;
  }

  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera); // render labels
}
animate();

// ─── Resize handler ───────────────────────────────────────────────────────────
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// ─── Back Button event ────────────────────────────────────────────────────────
const backBtn = document.getElementById("back-btn");

backBtn.addEventListener("click", () => {
  if (activeStateGroup) {
    toggleStateMarkers(activeStateGroup, false);
    resetStateColor(activeStateGroup);
    activeStateGroup = null;
  }
  backBtn.style.display = "none";
  placeInfo.style.display = "none";
  flyToOrigin();
});

// ─── Info card ────────────────────────────────────────────────────────────────
const placeInfo = document.getElementById("place-info");
const placeName = document.getElementById("place-name");
const placeType = document.getElementById("place-type");
const placeCoords = document.getElementById("place-coords");
const closeInfo = document.getElementById("close-info");
const placeImg = document.getElementById("place-img");

function showPlaceInfo(data) {
  placeName.textContent = data.name;
  placeType.textContent = data.type.toUpperCase();
  placeImg.src = data.image || "./assets/images/placeholder.jpg";
  placeCoords.textContent = `${data.lat.toFixed(4)}°N, ${data.lon.toFixed(4)}°E`;

  const typeColors = {
    religious: "#ff653f",
    nature: "#00cc88",
    cultural: "#3399ff",
  };
  placeType.style.backgroundColor = typeColors[data.type] || "#ccc";
  placeType.style.color = "#fff";

  placeInfo.style.display = "block";
}

closeInfo.addEventListener("click", () => {
  placeInfo.style.display = "none";
});

let isDragging = false;
let offsetX = 0;
let offsetY = 0;

placeInfo.addEventListener("mousedown", (e) => {
  isDragging = true;
  placeInfo.classList.add("dragging");

  offsetX = e.clientX - placeInfo.offsetLeft;
  offsetY = e.clientY - placeInfo.offsetTop;
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  placeInfo.style.left = `${e.clientX - offsetX}px`;
  placeInfo.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  placeInfo.classList.remove("dragging");
});

// ─── State/Region Placeholder ─────────────────────────────────────────────────
const srPlaceholder = document.getElementById("state-region-placeholder");

// Keep track of the currently hovered group to avoid redundant updates
let hoveredStateGroup = null;

renderer.domElement.addEventListener("mousemove", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  // We only want to check the top-level groups (the states)
  const intersects = raycaster.intersectObjects(mainGroup.children, true);

  if (intersects.length > 0) {
    // Find the parent group that contains the userData
    let obj = intersects[0].object;
    while (obj.parent && obj.parent !== mainGroup) {
      obj = obj.parent;
    }

    if (obj.userData && obj.userData.name) {
      // Only update if we moved from one state to another
      if (hoveredStateGroup !== obj) {
        hoveredStateGroup = obj;

        // Update the text in your HTML element
        srPlaceholder.textContent = obj.userData.name;

        // Optional: Change cursor to pointer to show it's clickable
        renderer.domElement.style.cursor = "pointer";
      }
    }
  } else {
    // If we are not hovering over any state
    if (hoveredStateGroup !== null) {
      hoveredStateGroup = null;
      srPlaceholder.textContent = "";
      renderer.domElement.style.cursor = "default";
    }
  }
});
