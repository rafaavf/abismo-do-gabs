import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";



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
const database = getDatabase();
const auth = getAuth(app);
const thisUser = getCookie('_userid');
const storage = getStorage(app);


if (thisUser == null || thisUser == '') {
    location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
} else {
    const thisUsernameRef = ref(database, '/users/' + thisUser);
    onValue(thisUsernameRef, (snapshot) => {
        const thisUserData = snapshot.val();
        if (thisUserData.hasAcess == null || !thisUserData.hasAcess) {
            location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
            document.cookie = "_userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;;"
        } else {

            document.getElementById("helloUser").textContent = `Olá, ${thisUserData.username}!`;
        }
    });
}

function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
            return cookie.substring(name.length + 1, cookie.length);
        }
    }
    return "";
}