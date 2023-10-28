import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, updateEmail } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

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


if (thisUser == null) {
    location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
} else {
    const thisUserDataRef = ref(database, '/users/' + thisUser);

    onValue(thisUserDataRef, (snapshot) => {
        const thisUserData = snapshot.val();
        if (thisUserData.hasAcess == null || !thisUserData.hasAcess) {
            location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
            document.cookie = "_userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;;"
            // document.cookie = "_hasAccessMsg=true";
        } else {

            document.getElementById('username').placeholder = thisUserData.username;
            document.getElementById('email').placeholder = thisUserData.email;
            document.getElementById('descriptionBox').textContent = thisUserData.description;
            document.getElementById('joinDate').textContent = thisUserData.dateCreated
            .replace(' GMT-0300 (Horário Padrão de Brasília)', '')
            .replace('GMT-0300 (Brasilia Standard Time)', '');

            (thisUserData.pfpUrl == '') ?
                document.getElementById('pfp').src = 'https://cdn.discordapp.com/attachments/775875729094869003/1165346683039797299/b72a1cfe.png?ex=654684ac&is=65340fac&hm=c22686adb1b0b38a4473342b6d0639b1bd5a73b270d8bae8c4601c4b909dd543&'
                : document.getElementById('pfp').src = thisUserData.pfpUrl;

            document.getElementById('pfpButton').addEventListener('click', async () => {
                const imgUrl = await document.getElementById('pfpUrl').value;

                if (imgUrl == null) {
                    alert('Preencha a URL corretamente!')
                } else {
                    try {
                        set(update(database, 'users/' + thisUser), {
                            pfpUrl: imgUrl
                        })
                        alert('Informação salva com sucesso :)');
                    } catch (e) {
                        console.log(e);
                        alert('Ocorreu um erro :( se persistir, contate a responsável');
                    }
                }
            })

            document.getElementById('descriptionButton').addEventListener('click', async () => {
                const description = await document.getElementById('descriptionBox').value;

                if (description.length > 300) {
                    alert('A descrição não deve superar 300 caracteres!');
                } else {
                    try {
                        update(ref(database, 'users/' + thisUser + '/'), {
                            description: description
                        });
                        alert('Informação salva com sucesso :)');
                    } catch (e) {
                        console.log(e);
                        alert('Ocorreu um erro :( se persistir, contate a responsável')
                    }
                }
            })

            document.getElementById('sendBtn').addEventListener('click', async () => {
                var username = await document.getElementById('username').value;
                var email = await document.getElementById('email').value.replace(' ', '');
                var password = await document.getElementById('password').value;

                signInWithEmailAndPassword(auth, thisUserData.email, password)
                    .then((userCredential) => {
                        if (email != thisUserData.email && email != '') {
                            updateEmail(auth.currentUser, email).then(() => {
                                try {
                                    update(ref(database, 'users/' + thisUser + '/'), {
                                        email: email
                                    });
                                    alert('Email e/ou username atualizados com sucesso :)');
                                } catch (e) {
                                    console.log(e);
                                    alert('Ocorreu um erro ao atualizar o email na firebase.database, contate a responsável (Operação falhou)');
                                }
                            }).catch((error) => {
                                console.log(error);
                                alert('Ocorreu um erro ao atualizar o email na firebase.auth, contate a responsável (Operação falhou)')
                            });
                        }
                        if (username != thisUserData.email && username != '') {
                            try {
                                update(ref(database, 'users/' + thisUser + '/'), {
                                    username: username
                                });
                                alert('Email e/ou username atualizados com sucesso :)');
                            } catch (e) {
                                console.log(e);
                                alert('Ocorreu um erro :( se persistir, contate a responsável');
                            }

                        }

                    })
                    .catch((error) => {
                        console.log(error);
                        alert('Ocorreu um erro :( se persistir, contate a responsável');
                    });

            })
        }
    })
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