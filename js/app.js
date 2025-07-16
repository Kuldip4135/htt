// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBhUUeRWVKzRhKWQ7K9vwHwd_78Bj_poxg",
//   authDomain: "travel-website-8bd91.firebaseapp.com",
//   projectId: "travel-website-8bd91",
//   storageBucket: "travel-website-8bd91.firebasestorage.app",
//   messagingSenderId: "624149249457",
//   appId: "1:624149249457:web:842d11a19996aa873cd190",
// };

const firebaseConfig = {
  apiKey: "AIzaSyDgbjIVMGbQQDw-5KSbmCb2C4am4U851cU",
  authDomain: "hari-ichha-tours-and-travels.firebaseapp.com",
  projectId: "hari-ichha-tours-and-travels",
  storageBucket: "hari-ichha-tours-and-travels.firebasestorage.app",
  messagingSenderId: "883626420077",
  appId: "1:883626420077:web:8818f33a66cc1777fa9c64",
  measurementId: "G-40RZ0K18PX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fetchPackages() {
  const querySnapshot = await getDocs(collection(db, "packages"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const container = document.getElementById("home-package-grid");
    container.innerHTML += `
    
        <div class="col-md-6 col-lg-4 project-wrap">
          <a
            href="packages-details.html?id=${doc.id}"
            class="img"
          style="background-image: url('../images/${
            data.imageName || "default"
          }.jpg')"
          >
          </a>
          <div class="text p-4">
            <span class="days">${data.night}N / ${data.days}D Tour</span>
            <h3><a href="#">${data.title}</a></h3>
            <p class="location">
              <span class="fa fa-map-marker"></span> ${data.location}
            </p>
            <ul>
              <li><span class="flaticon-shower"></span> ${
                data.night
              } Nights</li>
              <li><span class="flaticon-king-size"></span> ${
                data.days
              } Days</li>
          
            </ul>
          </div>
      
      </div>
    `;
  });
}

async function fetchPackageDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const packageId = urlParams.get("id");

  if (!packageId) {
    console.error("❌ No package ID in URL!");
    return;
  }

  const docRef = doc(db, "packages", packageId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    const tourContainer = document.getElementById("package-detail-container"); // wrap your content in this div

    tourContainer.innerHTML = `
  <div class="col-md-12 py-md-5 mt-md-5">
    <h2 class="mb-3">${data.title} Package Details</h2>
    <p>
      <img src="../images/${data.imageName || "default"}.jpg" alt="${
      data.title
    }" class="package-detail-img" />
    </p>
  
    <h3>Description</h3>
    ${formatTextToHTML(data.description)}

    <h3>Notes</h3>
    ${formatTextToHTML(data.notes, true)}

    <h3>Inclusions</h3>
    ${formatTextToHTML(data.inclusions, true)}

    <h3>Exclusions</h3>
    ${formatTextToHTML(data.exclusions, true)}

        <h3>Terms & Conditions</h3>
    ${formatTextToHTML(data.termsCondition, true)}

        <h3>Cancellation Policy</h3>
    ${formatTextToHTML(data.cancellationPolicy, true)}
  </div>
`;

    // etc.
  } else {
    console.error("😢 No such package found!");
  }
}

async function fetchDestinations() {
  const querySnapshot = await getDocs(collection(db, "destinations"));
  const destinationsContainer = document.getElementById("destinations");
  let htmlContent = "";

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const docId = doc.id;
    const fullDesc = data.desc || "";
    const shortDesc =
      fullDesc.length > 100 ? fullDesc.substring(0, 100) + "..." : fullDesc;

    // Escape HTML to prevent XSS
    const escapedTitle = escapeHtml(data.title || "");
    const escapedShortDesc = escapeHtml(shortDesc);

    const escapedFullDesc = escapeHtml(fullDesc);

    htmlContent += `
  <div class="col-md-6 col-lg-4 mb-4">
    <div class="card h-100 shadow-sm border-0">
      <div 
        class="card-img-top bg-cover" 
        style="height: 220px; background-image: url('../images/${
          data.imageName || "whiteRan"
        }.jpeg'); background-size: cover; background-position: center;">
      </div>
      <div class="card-body">
        <h5 class="card-title">
          <a href="#" class="text-decoration-none text-dark">${escapedTitle}</a>
        </h5>
        <p class="card-text text-muted" id="desc-${docId}">
          <span class="short-text">${escapedShortDesc}</span>
          <span class="full-text" style="display:none;">${escapedFullDesc}</span>
        </p>
        ${
          fullDesc.length > 100
            ? `<button class="btn btn-sm btn-link p-0 toggle-desc" data-doc-id="${docId}">Read more</button>`
            : ""
        }
      </div>
    </div>
  </div>
`;
    if (htmlContent.length > 0) {
      destinationsContainer.innerHTML = htmlContent;
    }
  });

  // Set up event delegation for toggle buttons
  setupToggleListeners();
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Set up event listeners using event delegation
function setupToggleListeners() {
  document
    .getElementById("destinations")
    .addEventListener("click", handleToggleClick);
}

function handleToggleClick(event) {
  const button = event.target.closest(".toggle-desc");
  if (!button) return;

  const docId = button.dataset.docId;
  const descElem = document.getElementById(`desc-${docId}`);
  const shortText = descElem.querySelector(".short-text");
  const fullText = descElem.querySelector(".full-text");

  const isExpanded = button.innerText === "Read less";

  if (isExpanded) {
    fullText.style.display = "none";
    shortText.style.display = "inline";
    button.innerText = "Read more";
  } else {
    fullText.style.display = "inline";
    shortText.style.display = "none";
    button.innerText = "Read less";
  }
}

function formatTextToHTML(text, isList = false) {
  if (!text || typeof text !== "string" || text.trim() === "")
    return "<p>Not available.</p>";

  const lines = text
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  if (isList) {
    return "<ul>" + lines.map((line) => `<li>${line}</li>`).join("") + "</ul>";
  } else {
    return lines.map((line) => `<p>${line}</p>`).join("");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  console.log("📍 Current path:", path);

  if (path.includes("index") || path === "/" || path.endsWith("/")) {
    // 🏡 Home page
    fetchPackages();
    fetchDestinations();
  } else if (path.includes("packages-details")) {
    // 📦 Package Details page
    fetchPackageDetails();
  } else if (path.includes("packages")) {
    // 📦 Package List page
    fetchPackages();
  } else if (path.includes("destination")) {
    //Destination List
    fetchDestinations();
  }
});
