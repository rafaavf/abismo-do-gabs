import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {SetUserStatus} from "../assets/classes/setUserStatus.js";

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        checkAccess(user.uid);

        const activityTracker = new SetUserStatus(user);

        document.getElementById('logoutBtn').addEventListener('click', ()=>{
            signOut(auth).then(() => {
                window.location.replace('../login.html');
                //location.assign('http://127.0.0.1:5500/login.html')
            }).catch((error) => {
                alert('Ocorreu um erro: ', error.message);
            });
        })

    }
});

async function checkAccess(uid) {

    const userDataRef = databaseRef(database, '/users/' + uid);
    await get(userDataRef, (snapshot) => { }).catch(async e => {
        console.log(e.message)

        if (e.message == "Permission denied") {
            alert('Você não têm permissão para acessar a plataforma. Contate a proprietária para requisitar acesso');
            await signOut(auth).then(() => window.location.replace('../../login.html'));
        }
    });
}