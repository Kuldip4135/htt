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

async function fetchTours() {
  const querySnapshot = await getDocs(collection(db, "packages"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // console.log("🎒 Tour Package:", data, typeof data);

    const container = document.getElementById("home-package-grid");
    // console.log("🎒 Tour container:", container);
    container.innerHTML += `
    
        <div class="project-wrap">
          <a
            href="packages-details.html?id=${doc.id}"
            class="img"
          style="background-image: url('/htt/images/${
            data.imageName || "default"
          }.jpg')"
          >
            <span class="price">${data.price}/person</span>
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
              <li><span class="flaticon-mountains"></span>Near Mountain</li>
            </ul>
          </div>
      
      </div>
    `;
  });
}

async function fetchToursForPackagesPage() {
  const querySnapshot = await getDocs(collection(db, "packages"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // console.log("🎒 Tour Package:", data, typeof data);

    const container = document.getElementById("packages-grid-container");
    // console.log("🎒 Tour container:", container);
    container.innerHTML += `
    
        <div class="project-wrap">
          <a
            href="packages-details.html?id=${doc.id}"
            class="img"
          style="background-image: url('/htt/images/${
            data.imageName || "default"
          }.jpg')"
          >
            <span class="price">${data.price}/person</span>
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
              <li><span class="flaticon-mountains"></span>Near Mountain</li>
            </ul>
          </div>
      
      </div>
    `;
  });
}

async function fetchTourDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const packageId = urlParams.get("id");
  // console.log("🆔 Package ID:", packageId);

  if (!packageId) {
    console.error("❌ No package ID in URL!");
    return;
  }

  const docRef = doc(db, "packages", packageId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // console.log("🎯 Tour Details:", data);

    const tourContainer = document.getElementById("package-detail-container"); // wrap your content in this div

    tourContainer.innerHTML = `
  <div class="col-md-12 py-md-5 mt-md-5">
    <h2 class="mb-3">${data.title} Package Details</h2>
    <p>
      <img src="/htt/images/${data.imageName || "default"}.jpg" alt="${
      data.title
    }" class="img-fluid" />
    </p>
    
 

    <h3>Description</h3>
    ${formatTextToHTML(data.description)}

    <h3>Notes</h3>
    ${formatTextToHTML(data.notes, true)}

    <h3>Inclusions</h3>
    ${formatTextToHTML(data.inclusions, true)}

    <h3>Exclusions</h3>
    ${formatTextToHTML(data.exclusions, true)}
  </div>
`;

    // etc.
  } else {
    console.error("😢 No such package found!");
  }
}

async function fetchDestinations() {
  const querySnapshot = await getDocs(collection(db, "destinations"));

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    // console.log("🎒 Destinationsss :", data);
    const destinationsContainer = document.getElementById("destinations");

    destinationsContainer.innerHTML += `
  <div class="col-md-6 project-wrap">
    <div
      class="img"
      style="background-image: url(/htt/images/${
        data.imageName || "default"
      }.jpg)"
    >
    </div>
    <div class="text p-4">
      <h3><a href="#">${data.title}</a></h3>
      <p class="location">
        ${data.desc}
      </p>
    </div>
  </div>
`;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // console.log("📍 Current Path:", path);

  if (path.includes("index.html") || path === "/" || path.endsWith("/")) {
    fetchTours(); // 🏡 Home page
    fetchDestinations();
  } else if (path.includes("packages-details.html")) {
    fetchTourDetails(); // 📦 Package Details page
  } else if (path.includes("packages.html")) {
    fetchToursForPackagesPage(); // 📦 Package Details page
  } else if (path.includes("destination.html")) {
    fetchDestinations(); // 📦 Details page
  }
});

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

//  <div class="ftco-animate project-wrap">
//             <a
//               href="packages-details.html"
//               class="img"
//               style="background-image: url(images/hotel-resto-1.jpg)"
//             >
//               <!-- <span class="price">$200/person</span> -->
//             </a>
//             <div class="text p-4">
//               <p class="star mb-2">
//                 <span class="fa fa-star"></span>
//                 <span class="fa fa-star"></span>
//                 <span class="fa fa-star"></span>
//                 <span class="fa fa-star"></span>
//                 <span class="fa fa-star"></span>
//               </p>
//               <span class="days">8 Days Tour</span>
//               <h3><a href="#">Bhuj</a></h3>

//               <ul>
//                 <li><span class="flaticon-shower"></span>2</li>
//                 <li><span class="flaticon-king-size"></span>3</li>
//                 <li><span class="flaticon-mountains"></span>Near Mountain</li>
//               </ul>
//             </div>
//           </div>
