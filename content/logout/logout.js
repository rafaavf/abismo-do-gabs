import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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
        console.log(user.uid);
        const thisUserDataRef = databaseRef(database, '/users/' + user.uid);
        onValue(thisUserDataRef, (snapshot) => {
            const userData = snapshot.val()
            console.log(userData)
            
            if (!userData.hasAcess) {
                location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
            }
        })
        document.getElementById('logoutBtn').addEventListener('click', ()=>{
            signOut(auth).then(() => {
                location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
                //location.assign('http://127.0.0.1:5500/login.html')
            }).catch((error) => {
                alert('Ocorreu um erro: ', error.message);
            });
        })

    }
});