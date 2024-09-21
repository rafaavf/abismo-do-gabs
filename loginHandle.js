import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, signOut, sendEmailVerification, setPersistence, browserLocalPersistence, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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
        //location.assign('http://127.0.0.1:5500/content/content.html');
        location.assign('https://rafaavf.github.io/abismo-do-gabs/content/content.html');
        console.log('has user')
        console.log(user)
        
    } else {
        console.log("OH NO A HACKER CLICKED INSPECT");

        document.getElementById('sendBtn').addEventListener("click", async () => {
            const emailInfo = document.getElementById('login').value;
            const passwordInfo = document.getElementById('password').value;

            signInWithEmailAndPassword(auth, emailInfo, passwordInfo)
                .then(async (userCredential) => {
                    const user = userCredential.user;

                    if (!user.emailVerified) {
                        alert(`Verifique seu email para continuar! Acabamos de enviar um link novo para verificação no seu email :)`);
                        await sendEmailVerification(user);
                    } else {
                        await setPersistence(auth, browserLocalPersistence)
                            .then(() => {
                                //location.assign('http://127.0.0.1:5500/content/content.html');
                                location.assign('https://rafaavf.github.io/abismo-do-gabs/content/content.html');
                            })
                            .catch((error) => {
                                alert('Ocorreu um erro: ' + error.message);
                            });
                    }
                })
                .catch((error) => {
                    if (error.code == 'auth/wrong-password') {
                        alert('A senha não corresponde :(');
                    } else if (error.code == 'auth/user-not-found') {
                        alert('Um usuário com esse email não existe, tente criar uma conta :(');
                    } else {
                        alert("Ocorreu um erro: " + error.message);
                    }
                });
        });
    }
});

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
