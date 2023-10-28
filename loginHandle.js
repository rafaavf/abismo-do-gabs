import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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

var cookieId = getCookie('_userid');
var cookielogout = getCookie('_logout');
// var cookieAccess = getCookie('_hasAccessMsg');
// console.log(cookieAccess);

// if (cookieAccess==true) {
//     alert('You do not have enough permission to join the API');
//     // document.cookie = "_hasAcessMsg=false";
// }

console.log(cookieId);
console.log(cookielogout)

if (cookieId == null || cookieId == '') {
    console.log("OH NO A HACKER CLICKED INSPECT");

    document.getElementById('sendBtn').addEventListener("click", async () => {
        const emailInfo = await document.getElementById('login').value;
        const passwordInfo = await document.getElementById('password').value;

        signInWithEmailAndPassword(auth, emailInfo, passwordInfo)
            .then((userCredential) => {
                if (!userCredential.user.emailVerified) {
                    alert(`Verify you email before loging in! Didn't receive an email verification? Visit this link to get it resended:`)
                } else {
                    const uid = userCredential.user.uid;
                    document.cookie = "_userid=" + uid;
                    location.assign('https://iplogger.com/2Jw1C3');
                }

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                alert("The authentication failed :( check your email, password and if you have created and account already!");
            });
    });
} else {
    window.location.href = './content/content.html';
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
