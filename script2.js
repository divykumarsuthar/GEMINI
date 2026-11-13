// ==========================================
// AETHERIA MUSEUM
// Main JavaScript file
// ==========================================


// Sample exhibits shown when the website opens.

const defaultExhibits = [

  {
    id: "e1",
    title: "The Pharaoh's Compass",
    category: "Ancient Relics",
    wing: "North Wing",
    symbol: "𓂀",
    description: "A mysterious instrument said to have guided its owner through the shifting sands of an ancient kingdom.",
    origin: "Ancient Egypt",
    period: "c. 1300 BCE",
    image: ""
  },

  {
    id: "e2",
    title: "Echoes of Tomorrow",
    category: "Quantum Art",
    wing: "South Wing",
    symbol: "◉",
    description: "A light installation that turns invisible patterns into a living landscape of colour and movement.",
    origin: "Aetheria Studio",
    period: "2026",
    image: ""
  },

  {
    id: "e3",
    title: "The Memory Engine",
    category: "Cyber-Sculptures",
    wing: "East Wing",
    symbol: "⌘",
    description: "A sculptural study of memory, built from layered forms that respond to the idea of human connection.",
    origin: "Digital Atelier",
    period: "2025",
    image: ""
  },

  {
    id: "e4",
    title: "Voyager's Last Signal",
    category: "Space Artifacts",
    wing: "West Wing",
    symbol: "✧",
    description: "An imagined record of a signal travelling through the quiet edges of deep space.",
    origin: "Outer Cosmos",
    period: "Future archive",
    image: ""
  },

  {
    id: "e5",
    title: "The Sunstone Tablet",
    category: "Ancient Relics",
    wing: "North Wing",
    symbol: "☼",
    description: "A ceremonial tablet whose carved patterns celebrate the changing seasons and the passage of time.",
    origin: "Mesoamerica",
    period: "c. 900 CE",
    image: ""
  },

  {
    id: "e6",
    title: "Fractal Garden",
    category: "Quantum Art",
    wing: "South Wing",
    symbol: "❋",
    description: "An ever-changing digital garden inspired by the beautiful mathematics found in nature.",
    origin: "Aetheria Studio",
    period: "2026",
    image: ""
  },

  {
    id: "e7",
    title: "The Glass Thinker",
    category: "Cyber-Sculptures",
    wing: "East Wing",
    symbol: "◇",
    description: "A transparent figure that explores the relationship between technology, identity and imagination.",
    origin: "Digital Atelier",
    period: "2024",
    image: ""
  },

  {
    id: "e8",
    title: "Lunar Archive No. 7",
    category: "Space Artifacts",
    wing: "West Wing",
    symbol: "☾",
    description: "A fictional archive of lunar observations, imagined as a keepsake from humanity's distant future.",
    origin: "Lunar Station",
    period: "2091",
    image: ""
  }

];


// Admin login details.

const ADMIN_ID = "300411";
const ADMIN_PASSWORD = "GeMiNi";


// Variables used by different website features.

let exhibits = loadExhibits();

let savedIds = JSON.parse(
  localStorage.getItem("aetheriaSaved") || "[]"
);

let activeCategory = "All";
let currentExhibit = null;
let currentRating = 0;
let toastTimer;


// ==========================================
// SAVING AND LOADING WEBSITE DATA
// ==========================================

// Load exhibits saved in this browser.
// If nothing has been saved yet, use the sample exhibits.

function loadExhibits() {

  try {

    const saved = localStorage.getItem("aetheriaExhibits");

    return saved ? JSON.parse(saved) : [...defaultExhibits];

  } catch (error) {

    return [...defaultExhibits];

  }

}


// Save the current collection in the browser.

function saveExhibits() {

  localStorage.setItem(
    "aetheriaExhibits",
    JSON.stringify(exhibits)
  );

}


// Show a small message after an action.

function showToast(message) {

  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 2600);

}


// Keep text entered by visitors safe when adding it to HTML.

function escapeHTML(value) {

  return String(value).replace(/[&<>"']/g, character => ({

    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"

  })[character]);

}


// Create the artwork shown on an exhibit card.

function getArtMarkup(exhibit) {

  if (exhibit.image) {

    return `
      <img
        src="${exhibit.image}"
        alt="${escapeHTML(exhibit.title)}"
      >
    `;

  }

  return `
    <span class="art-symbol">
      ${escapeHTML(exhibit.symbol || "✦")}
    </span>
  `;

}



// ==========================================
// EXHIBITION COLLECTION
// ==========================================

// Display the exhibits on the main page.

function renderExhibits() {

  const grid = document.getElementById("exhibitGrid");

  const search = document
    .getElementById("searchInput")
    .value
    .trim()
    .toLowerCase();


  // Apply the selected category and search text.

  const visibleExhibits = exhibits.filter(exhibit => {

    const matchesCategory =
      activeCategory === "All" ||
      exhibit.category === activeCategory;

    const searchableText = `
      ${exhibit.title}
      ${exhibit.category}
      ${exhibit.description}
      ${exhibit.wing}
    `.toLowerCase();

    return matchesCategory && searchableText.includes(search);

  });


  // Build the cards.

  grid.innerHTML = visibleExhibits.map(exhibit => `

    <article class="exhibit-card">

      <div
        class="exhibit-art"
        data-open-exhibit="${escapeHTML(exhibit.id)}"
      >

        ${getArtMarkup(exhibit)}

        <button
          class="save-button ${savedIds.includes(exhibit.id) ? "saved" : ""}"
          data-save="${escapeHTML(exhibit.id)}"
          aria-label="Save exhibit"
        >
          ${savedIds.includes(exhibit.id) ? "♥" : "♡"}
        </button>

      </div>


      <div class="exhibit-info">

        <span class="exhibit-category">
          ${escapeHTML(exhibit.category)}
        </span>

        <h3>
          ${escapeHTML(exhibit.title)}
        </h3>

        <p>
          ${escapeHTML(exhibit.description)}
        </p>

        <button
          class="card-link"
          data-open-exhibit="${escapeHTML(exhibit.id)}"
        >
          Discover this exhibit ↗
        </button>

      </div>

    </article>

  `).join("");


  // Show a message if the search has no results.

  document.getElementById("emptyMessage").hidden =
    visibleExhibits.length !== 0;

  updateFavoriteCount();

}



// ==========================================
// FAVORITES AND PERSONAL ITINERARY
// ==========================================

// Update the small number beside My Itinerary.

function updateFavoriteCount() {

  document.getElementById("favoriteCount").textContent =
    savedIds.length;

}


// Add or remove an exhibit from the saved list.

function toggleSaved(id) {

  if (savedIds.includes(id)) {

    savedIds = savedIds.filter(savedId => savedId !== id);

    showToast("Removed from your itinerary.");

  } else {

    savedIds.push(id);

    showToast("Added to your itinerary.");

  }


  localStorage.setItem(
    "aetheriaSaved",
    JSON.stringify(savedIds)
  );

  renderExhibits();
  renderItinerary();

}


// Display the visitor's saved exhibits.

function renderItinerary() {

  const list = document.getElementById("itineraryItems");

  const savedExhibits = exhibits.filter(exhibit =>
    savedIds.includes(exhibit.id)
  );


  if (!savedExhibits.length) {

    list.innerHTML = `
      <p class="admin-help">
        Your itinerary is empty.
        Save an exhibit to keep it here.
      </p>
    `;

  } else {

    list.innerHTML = savedExhibits.map(exhibit => `

      <div class="itinerary-item">

        <div>

          <strong>
            ${escapeHTML(exhibit.title)}
          </strong>

          <small>
            ${escapeHTML(exhibit.wing || "Museum gallery")}
          </small>

        </div>

        <button
          data-remove-saved="${escapeHTML(exhibit.id)}"
          aria-label="Remove exhibit"
        >
          ×
        </button>

      </div>

    `).join("");

  }


  // A simple walking-time estimate.

  document.getElementById("walkingTime").textContent =
    `Estimated walking time: ${savedExhibits.length * 4} minutes`;

}


// Open the itinerary drawer.

function openItinerary() {

  renderItinerary();

  document.getElementById("itineraryDrawer")
    .classList.add("open");

  document.getElementById("drawerBackdrop")
    .classList.add("open");

}


// Close the drawer.

function closeItinerary() {

  document.getElementById("itineraryDrawer")
    .classList.remove("open");

  document.getElementById("drawerBackdrop")
    .classList.remove("open");

}



// ==========================================
// EXHIBIT DETAILS
// ==========================================

// Open the details popup for a selected exhibit.

function openArtifact(id) {

  const exhibit = exhibits.find(item => item.id === id);

  if (!exhibit) return;

  currentExhibit = exhibit;
  currentRating = 0;


  document.getElementById("modalArt").innerHTML =
    getArtMarkup(exhibit);

  document.getElementById("modalCategory").textContent =
    exhibit.category;

  document.getElementById("modalTitle").textContent =
    exhibit.title;

  document.getElementById("modalDescription").textContent =
    exhibit.description;


  document.getElementById("modalFacts").innerHTML = `

    <span>
      <strong>ORIGIN</strong>
      ${escapeHTML(exhibit.origin || "Aetheria Collection")}
    </span>

    <span>
      <strong>PERIOD</strong>
      ${escapeHTML(exhibit.period || "Not specified")}
    </span>

    <span>
      <strong>WING</strong>
      ${escapeHTML(exhibit.wing || "Central Atrium")}
    </span>

  `;


  document.getElementById("modalSaveButton").textContent =
    savedIds.includes(id)
      ? "♥ Saved to itinerary"
      : "♡ Save to itinerary";


  document.getElementById("ratingStars").textContent =
    "☆ ☆ ☆ ☆ ☆";

  document.getElementById("ratingMessage").textContent =
    "Your rating helps other visitors.";


  document.getElementById("artifactModal")
    .classList.add("open");

}


// Close a popup.

function closeModal(id) {

  document.getElementById(id).classList.remove("open");

  if (
    id === "artifactModal" &&
    "speechSynthesis" in window
  ) {

    speechSynthesis.cancel();

  }

}



// ==========================================
// MUSEUM FLOOR MAP
// ==========================================

// Change the information when someone selects a museum wing.

function showWing(wing) {

  document.querySelectorAll(".wing-shape").forEach(shape => {

    shape.classList.toggle(
      "selected",
      shape.dataset.wing === wing
    );

  });


  const wingDetails = {

    "North Wing": [
      "ANTIQUITY",
      "Stories written in stone",
      "Explore relics, symbols and objects from ancient civilisations."
    ],

    "East Wing": [
      "CYBERNETICS",
      "Where ideas take shape",
      "Meet digital sculptures and creative experiments with technology."
    ],

    "West Wing": [
      "COSMOS",
      "A window into the unknown",
      "Discover imagined space archives and stories beyond our world."
    ],

    "South Wing": [
      "QUANTUM ART",
      "Art in another dimension",
      "Experience colour, patterns and installations inspired by science."
    ],

    "Central Atrium": [
      "CENTRAL ATRIUM",
      "The heart of Aetheria",
      "Begin your visit here, where every world meets."
    ]

  };


  const details = wingDetails[wing] ||
    wingDetails["Central Atrium"];


  const wingInfo = document.getElementById("wingInfo");

  wingInfo.innerHTML = `

    <span class="wing-kicker">
      ${details[0]}
    </span>

    <h3>
      ${details[1]}
    </h3>

    <p>
      ${details[2]}
    </p>

    <span class="foot-traffic">
      <i></i> Foot traffic: Light
    </span>

  `;

}



// ==========================================
// VISITOR PASS GENERATOR
// ==========================================

// Open the pass form with the selected pass type.

function openPassForm(tier = "Visitor") {

  document.getElementById("passTier").value = tier;

  document.getElementById("generatedPass").hidden = true;

  document.getElementById("passForm").hidden = false;

  document.getElementById("passModal")
    .classList.add("open");

}


// Generate a digital visitor pass.

function makePass(event) {

  event.preventDefault();


  const name = document
    .getElementById("visitorName")
    .value
    .trim();

  const email = document
    .getElementById("visitorEmail")
    .value
    .trim();

  const tier = document.getElementById("passTier").value;


  if (!name || !email) return;


  // Pass prices are only displayed here.
  // No payment is collected.

  const prices = {

    Visitor: "₹149",
    VIP: "₹349",
    Luxury: "₹549"

  };


  // Give every generated pass a simple reference number.

  const passNumber =
    "AET-" + Math.floor(100000 + Math.random() * 900000);


  document.getElementById("badgeName").textContent = name;

  document.getElementById("badgeTier").textContent =
    `${tier} Pass · ${passNumber}`;

  document.getElementById("badgeCode").textContent =
    passNumber;

  document.getElementById("badgeDate").textContent =
    new Date().toLocaleDateString("en-IN");

  document.getElementById("badgePrice").textContent =
    prices[tier];


  // Show the generated pass.

  document.getElementById("passForm").hidden = true;

  document.getElementById("generatedPass").hidden = false;

  showToast("Your demo visitor pass is ready.");

}



// ==========================================
// AUDIO GUIDE
// ==========================================

// Use the browser's built-in speech feature to read exhibit details.

function playAudioGuide() {

  if (!currentExhibit) return;


  if (!("speechSynthesis" in window)) {

    showToast("Audio guides are not supported by this browser.");

    return;

  }


  speechSynthesis.cancel();


  const guideText =
    `${currentExhibit.title}. ${currentExhibit.description}`;

  const guide = new SpeechSynthesisUtterance(guideText);

  guide.rate = 0.9;
  guide.pitch = 1;

  speechSynthesis.speak(guide);

  showToast("Audio guide started.");

}



// ==========================================
// VISITOR RATINGS
// ==========================================

// Save the rating selected by a visitor.

function setRating(rating) {

  currentRating = rating;

  document.getElementById("ratingStars").textContent =

    [1, 2, 3, 4, 5]
      .map(number => number <= rating ? "★" : "☆")
      .join(" ");


  document.getElementById("ratingMessage").textContent =
    `Thanks for giving this exhibit ${rating} out of 5 stars.`;

}



// ==========================================
// ADMIN PANEL
// ==========================================

// Open the admin login popup.

function openAdmin() {

  document.getElementById("adminModal")
    .classList.add("open");

}


// Clear the admin form.

function resetAdminForm() {

  document.getElementById("artifactForm").reset();

  document.getElementById("editArtifactId").value = "";

  document.getElementById("saveArtifactButton").textContent =
    "Save exhibit";

}


// Display all exhibits in the admin dashboard.

function renderAdminList() {

  const list = document.getElementById("adminArtifactList");


  list.innerHTML = exhibits.map(exhibit => `

    <div class="admin-artifact-row">

      <div>

        <strong>
          ${escapeHTML(exhibit.title)}
        </strong>

        <small>
          ${escapeHTML(exhibit.category)}
          ·
          ${escapeHTML(exhibit.wing || "No wing")}
        </small>

      </div>


      <div class="admin-row-actions">

        <button data-edit="${escapeHTML(exhibit.id)}">
          Edit
        </button>

        <button
          class="delete-button"
          data-delete="${escapeHTML(exhibit.id)}"
        >
          Delete
        </button>

      </div>

    </div>

  `).join("");

}


// Put an existing exhibit's information into the admin form.

function editArtifact(id) {

  const exhibit = exhibits.find(item => item.id === id);

  if (!exhibit) return;


  document.getElementById("editArtifactId").value =
    exhibit.id;

  document.getElementById("adminArtifactTitle").value =
    exhibit.title;

  document.getElementById("adminArtifactCategory").value =
    exhibit.category;

  document.getElementById("adminArtifactDescription").value =
    exhibit.description;

  document.getElementById("adminArtifactWing").value =
    exhibit.wing || "North Wing";


  document.getElementById("saveArtifactButton").textContent =
    "Update exhibit";


  document.getElementById("adminArtifactTitle").focus();

}


// Delete an exhibit from the collection.

function deleteArtifact(id) {

  const exhibit = exhibits.find(item => item.id === id);

  if (!exhibit) return;


  const shouldDelete = confirm(
    `Delete "${exhibit.title}" from the collection?`
  );

  if (!shouldDelete) return;


  exhibits = exhibits.filter(item => item.id !== id);

  savedIds = savedIds.filter(savedId => savedId !== id);


  saveExhibits();

  localStorage.setItem(
    "aetheriaSaved",
    JSON.stringify(savedIds)
  );


  renderExhibits();
  renderAdminList();
  renderItinerary();

  showToast("Exhibit deleted.");

}


// Add a new exhibit or update an existing one.

function saveArtifact(event) {

  event.preventDefault();


  const id = document.getElementById("editArtifactId").value;

  const title = document
    .getElementById("adminArtifactTitle")
    .value
    .trim();

  const category =
    document.getElementById("adminArtifactCategory").value;

  const description = document
    .getElementById("adminArtifactDescription")
    .value
    .trim();

  const wing =
    document.getElementById("adminArtifactWing").value;

  const imageFile =
    document.getElementById("adminArtifactImage").files[0];


  if (!title || !description) return;


  const existing = exhibits.find(item => item.id === id);


  const newExhibit = {

    id: id || "e" + Date.now(),

    title,
    category,
    description,
    wing,

    symbol: existing?.symbol || "✦",

    origin: existing?.origin || "Aetheria Collection",

    period: existing?.period || "Not specified",

    image: existing?.image || ""

  };


  // Save the exhibit after its image has been read.

  function finishSaving(imageData) {

    if (imageData) {
      newExhibit.image = imageData;
    }


    if (id) {

      exhibits = exhibits.map(item =>
        item.id === id ? newExhibit : item
      );

    } else {

      exhibits.push(newExhibit);

    }


    saveExhibits();

    renderExhibits();
    renderAdminList();

    resetAdminForm();

    showToast(
      id ? "Exhibit updated." : "New exhibit added."
    );

  }


  // Read the selected image, if one was uploaded.

  if (imageFile) {

    const reader = new FileReader();

    reader.onload = () => {
      finishSaving(reader.result);
    };

    reader.onerror = () => {
      showToast("Sorry, the image could not be uploaded.");
    };

    reader.readAsDataURL(imageFile);

  } else {

    finishSaving("");

  }

}


// Check the admin ID and password.

function loginAdmin(event) {

  event.preventDefault();


  const enteredId =
    document.getElementById("adminId").value;

  const enteredPassword =
    document.getElementById("adminPassword").value;


  if (
    enteredId === ADMIN_ID &&
    enteredPassword === ADMIN_PASSWORD
  ) {

    document.getElementById("adminLoginView").hidden = true;

    document.getElementById("adminDashboard").hidden = false;

    document.getElementById("loginError").textContent = "";

    renderAdminList();

  } else {

    document.getElementById("loginError").textContent =
      "That ID or password is not correct. Please try again.";

  }

}


// Log out of the admin panel.

function logoutAdmin() {

  document.getElementById("adminLoginView").hidden = false;

  document.getElementById("adminDashboard").hidden = true;

  document.getElementById("adminLoginForm").reset();

  resetAdminForm();

}



// ==========================================
// ANIMATED BACKGROUND
// ==========================================

// Draw small moving stars on the hero section.

function startCanvas() {

  const canvas = document.getElementById("starCanvas");

  const context = canvas.getContext("2d");

  let stars = [];


  // Adjust the canvas size to the screen.

  function resizeCanvas() {

    const scale = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * scale;

    canvas.height = canvas.clientHeight * scale;

    context.setTransform(scale, 0, 0, scale, 0, 0);


    // Create a fresh set of stars.

    stars = Array.from(
      { length: Math.floor(canvas.clientWidth / 8) },
      () => ({

        x: Math.random() * canvas.clientWidth,

        y: Math.random() * canvas.clientHeight,

        size: Math.random() * 1.5 + .3,

        speed: Math.random() * .18 + .04

      })
    );

  }


  // Draw and move the stars.

  function drawStars() {

    context.clearRect(
      0,
      0,
      canvas.clientWidth,
      canvas.clientHeight
    );


    stars.forEach(star => {

      star.y -= star.speed;

      if (star.y < 0) {
        star.y = canvas.clientHeight;
      }


      context.beginPath();

      context.arc(
        star.x,
        star.y,
        star.size,
        0,
        Math.PI * 2
      );

      context.fillStyle = "rgba(226, 197, 140, .7)";

      context.fill();

    });


    requestAnimationFrame(drawStars);

  }


  resizeCanvas();

  drawStars();

  window.addEventListener("resize", resizeCanvas);

}



// ==========================================
// CLICK EVENTS
// ==========================================

// Handle buttons inside exhibit cards and other
// elements that are added to the page later.

document.addEventListener("click", event => {

  const saveButton = event.target.closest("[data-save]");

  const openButton = event.target.closest("[data-open-exhibit]");

  const removeSavedButton =
    event.target.closest("[data-remove-saved]");

  const closeButton = event.target.closest("[data-close]");

  const editButton = event.target.closest("[data-edit]");

  const deleteButton = event.target.closest("[data-delete]");

  const wingButton = event.target.closest(".wing-shape");


  // Save button should not open the exhibit popup.

  if (saveButton) {

    event.preventDefault();
    event.stopPropagation();

    toggleSaved(saveButton.dataset.save);

    return;

  }


  if (openButton) {

    openArtifact(openButton.dataset.openExhibit);

  }


  if (removeSavedButton) {

    toggleSaved(removeSavedButton.dataset.removeSaved);

  }


  if (closeButton) {

    closeModal(closeButton.dataset.close);

  }


  if (editButton) {

    editArtifact(editButton.dataset.edit);

  }


  if (deleteButton) {

    deleteArtifact(deleteButton.dataset.delete);

  }


  if (wingButton) {

    showWing(wingButton.dataset.wing);

  }

});



// ==========================================
// CONNECT THE BUTTONS AND INPUTS
// ==========================================


// Category filters.

document.getElementById("filterList")
  .addEventListener("click", event => {

    const button = event.target.closest("[data-category]");

    if (!button) return;


    activeCategory = button.dataset.category;


    document.querySelectorAll(".filter-button").forEach(item => {

      item.classList.toggle("active", item === button);

    });


    renderExhibits();

  });


// Search bar.

document.getElementById("searchInput")
  .addEventListener("input", renderExhibits);


// Itinerary buttons.

document.getElementById("openItinerary")
  .addEventListener("click", openItinerary);

document.getElementById("closeItinerary")
  .addEventListener("click", closeItinerary);

document.getElementById("drawerBackdrop")
  .addEventListener("click", closeItinerary);


// Admin button.

document.getElementById("openAdmin")
  .addEventListener("click", openAdmin);


// Light and dark theme switch.

document.getElementById("themeToggle")
  .addEventListener("click", () => {

    document.body.classList.toggle("light-theme");

  });


// Audio guide.

document.getElementById("audioButton")
  .addEventListener("click", playAudioGuide);


// Save an exhibit from its details popup.

document.getElementById("modalSaveButton")
  .addEventListener("click", () => {

    if (!currentExhibit) return;

    toggleSaved(currentExhibit.id);


    document.getElementById("modalSaveButton").textContent =

      savedIds.includes(currentExhibit.id)
        ? "♥ Saved to itinerary"
        : "♡ Save to itinerary";

  });


// Visitor rating.

document.getElementById("ratingStars")
  .addEventListener("click", event => {

    const box = event.currentTarget.getBoundingClientRect();

    const clickPosition = event.clientX - box.left;

    const rating = Math.max(
      1,
      Math.min(5, Math.ceil(clickPosition / (box.width / 5)))
    );

    setRating(rating);

  });


// Pass buttons.

document.querySelectorAll(".choose-pass").forEach(button => {

  button.addEventListener("click", () => {

    openPassForm(button.dataset.tier);

  });

});


// Visitor pass form.

document.getElementById("passForm")
  .addEventListener("submit", makePass);


// Print visitor pass.

document.getElementById("printPass")
  .addEventListener("click", () => {

    window.print();

  });


// Admin login and dashboard.

document.getElementById("adminLoginForm")
  .addEventListener("submit", loginAdmin);

document.getElementById("adminLogout")
  .addEventListener("click", logoutAdmin);

document.getElementById("artifactForm")
  .addEventListener("submit", saveArtifact);

document.getElementById("cancelEditButton")
  .addEventListener("click", resetAdminForm);


// Mobile navigation.

document.getElementById("menuToggle")
  .addEventListener("click", () => {

    document.getElementById("navLinks")
      .classList.toggle("open");

  });


// Close the mobile menu after selecting a link.

document.querySelectorAll(".nav-links a").forEach(link => {

  link.addEventListener("click", () => {

    document.getElementById("navLinks")
      .classList.remove("open");

  });

});


// Close a popup when someone clicks outside its content.

document.querySelectorAll(".modal-overlay").forEach(modal => {

  modal.addEventListener("click", event => {

    if (event.target === modal) {

      closeModal(modal.id);

    }

  });

});



// ==========================================
// START THE WEBSITE
// ==========================================

// Show the exhibits and prepare the other sections.

renderExhibits();

renderItinerary();

showWing("Central Atrium");

startCanvas();


// This is a decorative message for the homepage.
// It is not connected to a real visitor counter.

const crowdLabels = [

  "A calm day to explore",

  "A little buzz in the galleries",

  "Plenty of room to discover"

];

document.getElementById("crowdStatus").textContent =

  crowdLabels[new Date().getDate() % crowdLabels.length];