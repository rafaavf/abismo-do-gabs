import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpgNLmYYUZF0WleyDSXAb-iyA5VUNgQBo",
    authDomain: "projeto-586e9.firebaseapp.com",
    databaseURL: "https://projeto-586e9-default-rtdb.firebaseio.com",
    projectId: "projeto-586e9",
    storageBucket: "projeto-586e9.appspot.com",
    messagingSenderId: "835426278469",
    appId: "1:835426278469:web:95beaa7ebb4467775d172c"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase();
const auth = getAuth(app);

const thisUser = getCookie('_userid');

if (thisUser == null||thisUser=='') {
    location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html')
} else {

 document.getElementById('logoutBtn').addEventListener('click', function logOut(){
    document.cookie = "_userid=null; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/abismo-do-gabs;";
    document.cookie = "_logout=true;"
    //location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html')

    console.log(getCookie('_userid'));
    console.log(getCookie('_logout'));
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
