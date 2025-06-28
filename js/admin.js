// // Firebase Setup
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
// import {
//   getAuth,
//   setPersistence,
//   browserSessionPersistence,
//   signInWithEmailAndPassword,
//   onAuthStateChanged,
// } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// import {
//   getFirestore,
//   collection,
//   addDoc,
//   onSnapshot,
//   deleteDoc,
//   doc,
// } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// // 🔧 Firebase Config (put your actual config here)
// const firebaseConfig = {
//   apiKey: "AIzaSyDgbjIVMGbQQDw-5KSbmCb2C4am4U851cU",
//   authDomain: "hari-ichha-tours-and-travels.firebaseapp.com",
//   projectId: "hari-ichha-tours-and-travels",
//   storageBucket: "hari-ichha-tours-and-travels.firebasestorage.app",
//   messagingSenderId: "883626420077",
//   appId: "1:883626420077:web:8818f33a66cc1777fa9c64",
//   measurementId: "G-40RZ0K18PX",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Show/hide UI based on auth
// function toggleUI(loggedIn) {
//   document.getElementById("login-card").classList.toggle("d-none", loggedIn);
//   document.getElementById("admin-panel").classList.toggle("d-none", !loggedIn);
// }

// // 🔐 Login form setup
// function setupLoginForm() {
//   const loginForm = document.getElementById("login-form");
//   loginForm.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value;

//     if (!email || !password) {
//       alert("Fill all fields, boss! 🤚");
//       return;
//     }

//     setPersistence(auth, browserSessionPersistence)
//       .then(() => signInWithEmailAndPassword(auth, email, password))
//       .then((userCredential) => {
//         console.log("✅ Admin logged in:", userCredential.user.email);
//         toggleUI(true);
//       })
//       .catch((err) => {
//         console.error("❌ Login failed:", err.message);
//         alert("Login failed: " + err.message);
//       });
//   });
// }

// // 💾 Save Package to Firestore
// function setupPackageForm() {
//   const packageForm = document.getElementById("add-package-form");

//   packageForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = new FormData(packageForm);
//     const data = Object.fromEntries(formData.entries());

//     const emptyField = Object.entries(data).find(([k, v]) => !v.trim());
//     if (emptyField) {
//       alert(`Oops! "${emptyField[0]}" is missing 😬`);
//       return;
//     }

//     // 🧙 Convert number fields
//     data.days = Number(data.days);
//     data.night = Number(data.night);
//     data.price = Number(data.price);

//     try {
//       const docRef = await addDoc(collection(db, "packages"), data);
//       console.log("🎉 Package added with ID:", docRef.id);
//       alert("✅ Package added successfully!");
//       packageForm.reset();
//     } catch (err) {
//       console.error("🚨 Error adding package:", err);
//       alert("Error adding package: " + err.message);
//     }
//   });
// }

// // 📍 Add Destination Form Logic (still logs for now)
// function setupDestinationForm() {
//   const destinationForm = document.getElementById("add-destination-form");

//   destinationForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const formData = new FormData(destinationForm);
//     const data = Object.fromEntries(formData.entries());

//     // 👀 Check for empty fields
//     const emptyField = Object.entries(data).find(([k, v]) => !v.trim());
//     if (emptyField) {
//       alert(`Oops! "${emptyField[0]}" can't be empty 😅`);
//       return;
//     }

//     try {
//       // 🚀 Add to Firestore
//       await addDoc(collection(db, "destinations"), data);
//       console.log("🌍 Destination added to Firestore!");
//       alert("✅ Destination added successfully!");
//       destinationForm.reset();
//     } catch (err) {
//       console.error("🔥 Error adding destination:", err);
//       alert("Something went wrong: " + err.message);
//     }
//   });
// }

// // 🔥 Show & Delete Packages
// function loadPackages() {
//   const packageList = document.getElementById("package-list");

//   onSnapshot(collection(db, "packages"), (snapshot) => {
//     packageList.innerHTML = ""; // Clear it out

//     snapshot.forEach((docItem) => {
//       const data = docItem.data();
//       const li = document.createElement("li");
//       li.className =
//         "list-group-item d-flex justify-content-between align-items-center";

//       li.innerHTML = `
//         ${data.title}
//         <button class="btn btn-sm btn-outline-primary delete-package" data-id="${docItem.id}">Delete</button>
//       `;
//       packageList.appendChild(li);
//     });

//     // 🔴 Delete package on click
//     document.querySelectorAll(".delete-package").forEach((btn) => {
//       btn.addEventListener("click", async () => {
//         const id = btn.dataset.id;
//         if (confirm("Delete this package?")) {
//           await deleteDoc(doc(db, "packages", id));
//           alert("Deleted package ✅");
//         }
//       });
//     });
//   });
// }

// // 🌍 Show & Delete Destinations
// function loadDestinations() {
//   const destList = document.getElementById("destination-list");

//   onSnapshot(collection(db, "destinations"), (snapshot) => {
//     destList.innerHTML = ""; // Clear it out

//     snapshot.forEach((docItem) => {
//       const data = docItem.data();
//       const li = document.createElement("li");
//       li.className =
//         "list-group-item d-flex justify-content-between align-items-center";

//       li.innerHTML = `
//         ${data.title}
//         <button class="btn btn-sm btn-outline-primary delete-destination" data-id="${docItem.id}">Delete</button>
//       `;
//       destList.appendChild(li);
//     });

//     // 🔴 Delete destination on click
//     document.querySelectorAll(".delete-destination").forEach((btn) => {
//       btn.addEventListener("click", async () => {
//         const id = btn.dataset.id;
//         if (confirm("Delete this destination?")) {
//           await deleteDoc(doc(db, "destinations", id));
//           alert("Deleted destination ✅");
//         }
//       });
//     });
//   });
// }

// // 🔥 Auth State Listener
// onAuthStateChanged(auth, (user) => {
//   toggleUI(!!user);
// });

// // 🎬 Init all the things
// setupLoginForm();
// setupPackageForm();
// setupDestinationForm();
// loadPackages();
// loadDestinations();

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
  const packageForm = document.getElementById("add-package-form");
  let editingId = null;

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
    // data.price = Number(data.price);

    try {
      if (editingId) {
        await updateDoc(doc(db, "packages", editingId), data);
        alert("Package updated ✅");
        editingId = null;
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
    editingId = id;
    for (const [key, value] of Object.entries(data)) {
      const input = packageForm.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
}

// 📍 Add or Update Destination
function setupDestinationForm() {
  const destForm = document.getElementById("add-destination-form");
  let editingId = null;

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
      if (editingId) {
        await updateDoc(doc(db, "destinations", editingId), data);
        alert("Destination updated ✅");
        editingId = null;
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

  // ✏️ Fill form to edit
  window.editDestination = (id, data) => {
    editingId = id;
    for (const [key, value] of Object.entries(data)) {
      const input = destForm.querySelector(`[name="${key}"]`);
      if (input) input.value = value;
    }
    // window.scrollTo({ top: 0, behavior: "smooth" });
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
        ${data.title}
        <span>
          <button class="btn btn-sm btn-warning me-2" onclick='editPackage("${
            docItem.id
          }", ${JSON.stringify(data)})'>Edit</button>
          <button class="btn btn-sm btn-danger" onclick='confirmDelete("packages", "${
            docItem.id
          }")'>Delete</button>
        </span>
      `;
      packageList.appendChild(li);
    });
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
        ${data.title}
        <span>
          <button class="btn btn-sm btn-warning me-2" onclick='editDestination("${
            docItem.id
          }", ${JSON.stringify(data)})'>Edit</button>
          <button class="btn btn-sm btn-danger" onclick='confirmDelete("destinations", "${
            docItem.id
          }")'>Delete</button>
        </span>
      `;
      destList.appendChild(li);
    });
  });
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

// Firestore delete global access
window.deleteDoc = deleteDoc;
window.doc = doc;
window.db = db;
