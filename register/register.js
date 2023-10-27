import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyB9D8cgdz_uAVxaMmcZgaQeF7k5_IflfE8",
    authDomain: "abismo-do-gabs.firebaseapp.com",
    databaseURL: "https://abismo-do-gabs-default-rtdb.firebaseio.com",
    projectId: "abismo-do-gabs",
    storageBucket: "abismo-do-gabs.appspot.com",
    messagingSenderId: "457206276713",
    appId: "1:457206276713:web:03c275bd0343772dff78f8"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const fs = getFirestore(app);

console.log("para de hackear, vou contar pra sua mamãe");

document.getElementById('sendBtn').addEventListener('click', async () => {
    const userName = await document.getElementById("idName").value;
    const userMessage = await document.getElementById("idText").value;
    const currentTimestamp = Timestamp.fromDate(new Date()).toDate().toString();

    if (userName == "" || userName == null || userMessage == "" || userMessage == null) {
        alert("Verifique se você preencheu todos os campos antes de enviar!");
    } else {
        try {
            const docRef = await addDoc(collection(fs, "requests"), {
                user_name: userName,
                user_message: userMessage,
                user_dateSent: currentTimestamp
            });
            alert("Pedido enviado com sucesso :)")
        } catch (e) {
            console.error(e);
            alert("Ocorreu um erro:" + e);
        }
    }
})