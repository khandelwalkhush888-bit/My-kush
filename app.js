// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCxo2cc90se6y0JvpKp05d0pFSJvcOdlAw",
  authDomain: "my-kush-project-76909.firebaseapp.com",
  databaseURL: "https://my-kush-project-76909-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-kush-project-76909",
  storageBucket: "my-kush-project-76909.appspot.com",
  messagingSenderId: "438641754521",
  appId: "1:438641754521:web:9fab4c1652789b67fc5308",
  measurementId: "G-009JR4HVT5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// File Upload
document.getElementById("submitFile").addEventListener("click", async () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Choose a file!");

  const storageRef = sRef(storage, "uploads/" + file.name);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  // Save to DB
  push(ref(db, "uploads"), { url, type: file.type });

  alert("Uploaded Successfully!");
});

// Display uploaded media
const gallery = document.getElementById("gallery");
onChildAdded(ref(db, "uploads"), (snapshot) => {
  const data = snapshot.val();
  if (data.type.startsWith("image")) {
    gallery.innerHTML = `<img src="${data.url}" alt="photo">` + gallery.innerHTML;
  } else {
    gallery.innerHTML = `<video controls src="${data.url}"></video>` + gallery.innerHTML;
  }
});

// Live Chat
const chatBox = document.getElementById("chatBox");
document.getElementById("sendBtn").addEventListener("click", () => {
  const msg = document.getElementById("chatInput").value;
  if (msg.trim() !== "") {
    push(ref(db, "chat"), { text: msg });
    document.getElementById("chatInput").value = "";
  }
});

onChildAdded(ref(db, "chat"), (snapshot) => {
  const msg = snapshot.val().text;
  const p = document.createElement("p");
  p.textContent = msg;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
});