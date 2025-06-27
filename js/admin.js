// Firebase Setup
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
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// 🔧 Firebase Config (put your actual config here)
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

// Show/hide UI based on auth
function toggleUI(loggedIn) {
  document.getElementById("login-card").classList.toggle("d-none", loggedIn);
  document.getElementById("admin-panel").classList.toggle("d-none", !loggedIn);
}

// 🔐 Login form setup
function setupLoginForm() {
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("Fill all fields, boss! 🤚");
      return;
    }

    setPersistence(auth, browserSessionPersistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .then((userCredential) => {
        console.log("✅ Admin logged in:", userCredential.user.email);
        toggleUI(true);
      })
      .catch((err) => {
        console.error("❌ Login failed:", err.message);
        alert("Login failed: " + err.message);
      });
  });
}

// 💾 Save Package to Firestore
function setupPackageForm() {
  const packageForm = document.getElementById("add-package-form");

  packageForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(packageForm);
    const data = Object.fromEntries(formData.entries());

    const emptyField = Object.entries(data).find(([k, v]) => !v.trim());
    if (emptyField) {
      alert(`Oops! "${emptyField[0]}" is missing 😬`);
      return;
    }

    // 🧙 Convert number fields
    data.days = Number(data.days);
    data.night = Number(data.night);
    data.price = Number(data.price);

    try {
      const docRef = await addDoc(collection(db, "packages"), data);
      console.log("🎉 Package added with ID:", docRef.id);
      alert("✅ Package added successfully!");
      packageForm.reset();
    } catch (err) {
      console.error("🚨 Error adding package:", err);
      alert("Error adding package: " + err.message);
    }
  });
}

// 📍 Add Destination Form Logic (still logs for now)
function setupDestinationForm() {
  const destinationForm = document.getElementById("add-destination-form");

  destinationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(destinationForm);
    const data = Object.fromEntries(formData.entries());

    // 👀 Check for empty fields
    const emptyField = Object.entries(data).find(([k, v]) => !v.trim());
    if (emptyField) {
      alert(`Oops! "${emptyField[0]}" can't be empty 😅`);
      return;
    }

    try {
      // 🚀 Add to Firestore
      await addDoc(collection(db, "destinations"), data);
      console.log("🌍 Destination added to Firestore!");
      alert("✅ Destination added successfully!");
      destinationForm.reset();
    } catch (err) {
      console.error("🔥 Error adding destination:", err);
      alert("Something went wrong: " + err.message);
    }
  });
}

// 🔥 Auth State Listener
onAuthStateChanged(auth, (user) => {
  toggleUI(!!user);
});

// 🎬 Init all the things
setupLoginForm();
setupPackageForm();
setupDestinationForm();
