import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";



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
const auth = getAuth(app);
const thisUser = getCookie('_userid');

onAuthStateChanged(auth, (user) => {
    if (user) {
        //location.assign('http://127.0.0.1:5500/content/content.html');
        location.assign('https://rafaavf.github.io/abismo-do-gabs/content/content.html');
        
    } else {
        document.getElementById('sendBtn').addEventListener('click', async ()=>{
            const email = await document.getElementById('login').value;

            if (email == ''){
                alert('Por favor, preencha o campo de email antes de enviar!');
            } else {
                sendPasswordResetEmail(auth, email).then(task => {
                alert("Email de redefinição enviado com sucesso :)");
                }). catch(e=>{
                    alert("Ocorreu um erro: " + e.message + "|| Código de erro: " + e.code);
                })
            }
        })
        }
    }
});
