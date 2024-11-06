import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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

console.log(":))");


document.getElementById('sendBtn').addEventListener("click", async () => {
    const createUsername = await document.getElementById('createUser').value;
    const createEmail = await document.getElementById('createEmail').value;
    const createPassword = await document.getElementById('createPassword').value;
    const currentTimestamp = Timestamp.fromDate(new Date()).toDate().toString();


    if (createUsername.length === 0 || createUsername.replace(/\s+/g, '') == '') {
        alert('Ocorreu um erro: o campo usuário encontra-se nulo')
    } else {
        createUserWithEmailAndPassword(auth, createEmail, createPassword)
            .then((userCredential) => {
                alert('User registrado com sucesso :) verifique seu email e prossiga para a página de login para continuar!');

                const user = userCredential.user;


                onAuthStateChanged(auth, (user) => {
                    if (user) {
                      const uid = user.uid;
                      
                      // Set user data in the database
                      set(ref(database, '/users/' + uid), {
                        username: createUsername,
                        email: createEmail,
                        dateCreated: currentTimestamp,
                        description: '',
                        id: uid,
                        hasAccess: false
                      });
                    }
                  });

                sendEmailVerification(user);

            })
            .catch((error) => {
                alert('Ocorreu um erro: ' + error.message + '|| Código de erro: ' + error.code)
            });
    }
})