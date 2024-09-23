import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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
const database = getDatabase(app); 
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
    if (user) {
        const thisUsernameRef = ref(database, '/users/' + user.uid); 
        onValue(thisUsernameRef, (snapshot) => {
            const thisUserData = snapshot.val();
            
            if (!thisUserData.hasAcess) {
                signOut(auth);
                location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
                console.log('no access')
            } else {
                document.getElementById("helloUser").textContent = `Olá, ${thisUserData.username}!`;
            }
        });
    } else {
        location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
    }
});
