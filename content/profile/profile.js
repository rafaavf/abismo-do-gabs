import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue, update, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, updateEmail, sendEmailVerification, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { SetUserStatus } from "../assets/classes/setUserStatus.js";

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
const storage = getStorage(app);


onAuthStateChanged(auth, (user) => {
    if (user) {
        checkAccess(user.uid);

        const activityTracker = new SetUserStatus(user);

        const thisUserDataRef = databaseRef(database, `users/${user.uid}`);

        onValue(thisUserDataRef, (snapshot) => {

            const thisUserData = snapshot.val();

            getUserInfo(thisUserData);

            document.getElementById('pfpButton').addEventListener('click', () => { updateUserPfp(user.uid) });

            document.getElementById('sendBtn').addEventListener('click', async () => {updateEmailAndUsername(user.uid, thisUserData)});
        });

        document.getElementById('descriptionButton').addEventListener('click', async () => {
            const description = document.getElementById('descriptionBox').value;

            var descArr = description.split(' ');
            var canProceed = 0;
            for (let i = 0; i < descArr.length; i++) {
                if (descArr[i].length > 32) {
                    canProceed += 1;
                }
            }

            if (description.length > 100) {
                alert('A descrição não deve superar 100 caracteres!');
            } else if (canProceed > 0) {
                alert('A descrição não deve conter mais de 32 caracteres não separados por um espaço');
            } else {
                try {
                    update(databaseRef(database, 'users/' + user.uid + '/'), {
                        description: description
                    });
                    alert('Informação salva com sucesso :)');
                } catch (e) {
                    console.log(e);
                    alert('Ocorreu um erro :( se persistir, contate a responsável');
                }
            }
        });


    } else {
        location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
    }
});


async function getImagesFromStorageFolder(path) {
    const folderRef = storageRef(storage, path);
    const result = await listAll(folderRef);
    const imageUrls = [];

    for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef);
        imageUrls.push(url);
    }

    return imageUrls;
}

function deleteFile(filePath) {
    const fileRef = storageRef(storage, filePath);

    deleteObject(fileRef).then(() => {
        console.log('File deleted successfully');
    }).catch((error) => {
        console.error('Error deleting file:', error);
    });
}

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

async function getUserInfo(userData) {
    document.getElementById('username').placeholder = userData.username;
    document.getElementById('email').placeholder = userData.email;
    document.getElementById('descriptionBox').textContent = userData.description;
    document.getElementById('joinDate').textContent = formatDate(new Date(userData.dateCreated));

    await getImagesFromStorageFolder('users/' + userData.id + '/pfp').then(url => {
        if (url.length > 0) {
            document.getElementById('pfp').src = url[0];
        } else {
            throw new Error('No images found');
        }
    }).catch(async e => {
        await getImagesFromStorageFolder('assets/pfpImg').then(newUrl => {
            document.getElementById('pfp').src = newUrl[0]
        })
    })
}

async function updateUserPfp(uid) {
    var formats = ['image/png', 'image/jpeg', 'image/jpg']

    const file = document.getElementById("file-upload").files[0];
    if (!file) {
        alert("Por favor, selecione uma imagem antes");
    } else if (!formats.includes(file.type)) {
        alert("Por favor, selecione uma imagem que tenha algum dos seguintes formatos: png, jpeg, jpg")
    } else {
        await deleteFile(`users/${uid}/pfp/${uid}_pfp`).then(() => {

            const imageRef = storageRef(storage, `users/${uid}/pfp/${uid}_pfp`);

            const uploadTask = uploadBytes(imageRef, file);

            uploadTask.then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    alert('Upload realizado com sucesso :)');
                    window.location.reload()
                });
            }).catch((error) => {
                alert('Ocorreu o seguinte erro: ' + error);
            });
        })
    }
}

async function updateEmailAndUsername(uid, data) {
    var username = document.getElementById('username').value
    var email = document.getElementById('email').value.replace(' ', '');
    var password = document.getElementById('password').value;

    if (username.replace(/\s+g/, '') == '' && username.length > 0) {
        alert('Por favor, não preencha o nome de usuário com espaços');
    } else if (username.length > 15) {
        alert('o nome de usuário não deve ultrapassar 15 caracteres')
    } else {

        await signInWithEmailAndPassword(auth, thisUserData.email, password)
            .then((userCredential) => {
                if (email != data.email && email != '' && email.replace(/\s+g/, '') != '') {
                    updateEmail(auth.currentUser, email).then(() => {
                        try {
                            update(databaseRef(database, `users/${uid}`), {
                                email: email
                            });
                            sendEmailVerification(auth.currentUser);
                            alert('Email e/ou username atualizados com sucesso :)');
                        } catch (e) {
                            console.log(e);
                            alert('Ocorreu um erro: ' + e.message);
                        }
                    }).catch((error) => {
                        console.log(error);
                        alert('Ocorreu um erro: ' + e.message);
                    });
                }

                if (username != data.email && username != '') {
                    try {
                        update(databaseRef(database, `users/${uid}`), {
                            username: username
                        });
                        alert('Email e/ou username atualizados com sucesso :)');
                    } catch (e) {
                        console.log(e);
                        alert('Ocorreu um erro: ' + e.message);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                alert('Ocorreu um erro: ' + e.message);
            });
    }
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
}