import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  setPersistence,
  browserSessionPersistence,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// 🧩 Firebase config (replace this with yours)
const firebaseConfig = {
  apiKey: "AIzaSyDgbjIVMGbQQDw-5KSbmCb2C4am4U851cU",
  authDomain: "hari-ichha-tours-and-travels.firebaseapp.com",
  projectId: "hari-ichha-tours-and-travels",
  storageBucket: "hari-ichha-tours-and-travels.firebasestorage.app",
  messagingSenderId: "883626420077",
  appId: "1:883626420077:web:8818f33a66cc1777fa9c64",
  measurementId: "G-40RZ0K18PX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let editingDestId = null;
const destForm = document.getElementById("add-destination-form");
const submitBtn = document.getElementById("dest-submit-btn");

let editingPackageId = null;
const packageForm = document.getElementById("add-package-form");
const packageSubmitBtn = document.getElementById("package-submit-btn");

// Toggle UI
function toggleUI(loggedIn) {
  document.getElementById("login-card").classList.toggle("d-none", loggedIn);
  document.getElementById("admin-panel").classList.toggle("d-none", !loggedIn);
}

// 🔐 Login
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("All fields required bro 🤓");
      return;
    }

    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then(() => {
        toggleUI(true);
      })
      .catch((err) => {
        alert("Login failed: " + err.message);
      });
  });
}

// 💾 Add or Update Package
function setupPackageForm() {
  packageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(packageForm);
    const data = Object.fromEntries(formData.entries());

    const emptyField = Object.entries(data).find(([k, v]) => !v.trim());
    if (emptyField) {
      alert(`"${emptyField[0]}" is empty 🧐`);
      return;
    }

    // Fix data types
    data.days = Number(data.days);
    data.night = Number(data.night);
    // data.price = Number(data.price); // keep this if needed

    try {
      if (editingPackageId) {
        await updateDoc(doc(db, "packages", editingPackageId), data);
        alert("Package updated ✅");
        editingPackageId = null;

        // Reset button text
        if (packageSubmitBtn) packageSubmitBtn.textContent = "Add Package";
      } else {
        await addDoc(collection(db, "packages"), data);
        alert("New package added ✅");
      }

      packageForm.reset();
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.message);
    }
  });

  // 🖊️ Fill form to edit
  window.editPackage = (id, data) => {
    editingPackageId = id;

    for (const [key, value] of Object.entries(data)) {
      const input = packageForm.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    }

    // Change button text to "Edit Package"
    if (packageSubmitBtn) packageSubmitBtn.textContent = "Edit Package";

    // Smooth scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

// 🎯 List Packages
function loadPackages() {
  const packageList = document.getElementById("package-list");

  onSnapshot(collection(db, "packages"), (snapshot) => {
    packageList.innerHTML = "";

    snapshot.forEach((docItem) => {
      const data = docItem.data();
      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        ${escapeHtml(data.title)}
        <span>
          <button class="btn btn-sm btn-warning me-2">Edit</button>
          <button class="btn btn-sm btn-danger">Delete</button>
        </span>
      `;

      // Attach events safely
      li.querySelector(".btn-warning").addEventListener("click", () => {
        editPackage(docItem.id, data);
      });

      li.querySelector(".btn-danger").addEventListener("click", () => {
        confirmDelete("packages", docItem.id);
      });

      packageList.appendChild(li);
    });
  });
}

// 📍 Add or Update Destination
function setupDestinationForm() {
  destForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(destForm);
    const data = Object.fromEntries(formData.entries());

    const emptyField = Object.entries(data).find(([k, v]) => !v.trim());
    if (emptyField) {
      alert(`"${emptyField[0]}" is empty 🧐`);
      return;
    }

    try {
      if (editingDestId) {
        await updateDoc(doc(db, "destinations", editingDestId), data);
        alert("Destination updated ✅");
        editingDestId = null;

        // Change button text back to "Add Destination"

        if (submitBtn) submitBtn.textContent = "Add Destination";
      } else {
        await addDoc(collection(db, "destinations"), data);
        alert("New destination added ✅");
      }
      destForm.reset();
    } catch (err) {
      console.error("Error:", err);
      alert("Error: " + err.message);
    }
  });
}

// 🌍 List Destinations
function loadDestinations() {
  const destList = document.getElementById("destination-list");

  onSnapshot(collection(db, "destinations"), (snapshot) => {
    destList.innerHTML = "";

    snapshot.forEach((docItem) => {
      const data = docItem.data();

      const li = document.createElement("li");
      li.className =
        "list-group-item d-flex justify-content-between align-items-center";
      li.innerHTML = `
        ${escapeHtml(data.title)}
        <span>
          <button class="btn btn-sm btn-warning me-2">Edit</button>
          <button class="btn btn-sm btn-danger">Delete</button>
        </span>
      `;

      // Attach event listeners safely
      li.querySelector(".btn-warning").addEventListener("click", () => {
        editDestination(docItem.id, data);
      });

      li.querySelector(".btn-danger").addEventListener("click", () => {
        confirmDelete("destinations", docItem.id);
      });

      destList.appendChild(li);
    });
  });
}

// ✏️ Edit Destination
function editDestination(id, data) {
  editingDestId = id;

  // Change button text to "Edit Destination"
  const submitBtn = document.getElementById("dest-submit-btn");
  if (submitBtn) submitBtn.textContent = "Edit Destination";

  for (const [key, value] of Object.entries(data)) {
    const input = destForm.querySelector(`[name="${key}"]`);
    if (input) input.value = value;
  }
}

// 🔥 Auth State Listener
onAuthStateChanged(auth, (user) => {
  toggleUI(!!user);
  if (user) {
    loadPackages();
    loadDestinations();
  }
});

// 🚀 INIT
setupLoginForm();
setupPackageForm();
setupDestinationForm();

// 🛡️ Confirm & Delete Function
window.confirmDelete = async (collectionName, docId) => {
  if (confirm("Are you sure you want to delete this item? 🧐")) {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      alert("Item deleted successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Oops! Something went wrong 😬");
    }
  }
};

// 🛡 Escape HTML to prevent XSS
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Firestore delete global access
window.deleteDoc = deleteDoc;
window.doc = doc;
window.db = db;
