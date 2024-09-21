import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as dbRef, onValue, set, update } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, updateEmail, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";

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

const thisUser = getCookie('_userid');

if (thisUser == null) {
    location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
} else {
    const thisUserDataRef = dbRef(database, '/users/' + thisUser);

    onValue(thisUserDataRef, (snapshot) => {
        const thisUserData = snapshot.val();
        if (thisUserData.hasAcess == null || !thisUserData.hasAcess) {
            location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
            document.cookie = "_userid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;;";
        } else {
            document.getElementById('username').placeholder = thisUserData.username;
            document.getElementById('email').placeholder = thisUserData.email;
            document.getElementById('descriptionBox').textContent = thisUserData.description;
            document.getElementById('joinDate').textContent = thisUserData.dateCreated
                .replace(' GMT-0300 (Horário Padrão de Brasília)', '')
                .replace('GMT-0300 (Brasilia Standard Time)', '');
            getImagesFromStorageFolder('users/' + thisUserData.id + '/pfp').then(url => {
                if (url.length > 0) {
                    document.getElementById('pfp').src = url[0];
                } else {
                    throw new Error('No images found');
                }
            }).catch(e => {
                getImagesFromStorageFolder('assets/pfpImg').then(newUrl => {
                    document.getElementById('pfp').src = newUrl[0]
                })
            })

            document.getElementById('pfpButton').addEventListener('click', async () => {
                var formats = ['image/png', 'image/jpeg', 'image/jpg']

                const file = document.getElementById("file-upload").files[0];
                if (!file) {
                    alert("Por favor, selecione uma imagem antes");
                    console.log(file)
                } else if (!formats.includes(file.type)) {
                    alert("Por favor, selecione uma imagem que tenha algum dos seguintes formatos: png, jpeg, jpg")
                } else {
                    console.log(file.type)
                    deleteFile('users/' + thisUserData.id + '/pfp/' + thisUserData.id + '_pfp');

                    const imageRef = storageRef(storage, 'users/' + thisUserData.id + '/pfp/' + thisUserData.id + '_pfp');

                    const uploadTask = uploadBytes(imageRef, file);

                    uploadTask.then((snapshot) => {
                        console.log('Upload is ' + (snapshot.bytesTransferred / snapshot.totalBytes) * 100 + '% done');
                        getDownloadURL(snapshot.ref).then((downloadURL) => {
                            console.log('File available at:', downloadURL);
                            alert('Upload realizado com sucesso :)');
                            window.location.reload()
                        });
                    }).catch((error) => {
                        console.error('Upload failed:', error);
                        alert('Ocorreu o seguinte erro: ' + error);
                    });
                }
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
                        update(dbRef(database, 'users/' + thisUser + '/'), {
                            description: description
                        });
                        alert('Informação salva com sucesso :)');
                    } catch (e) {
                        console.log(e);
                        alert('Ocorreu um erro :( se persistir, contate a responsável');
                    }
                }
            });

            document.getElementById('sendBtn').addEventListener('click', async () => {
                var username = document.getElementById('username').value;
                var email = document.getElementById('email').value.replace(' ', '');
                var password = document.getElementById('password').value;

                signInWithEmailAndPassword(auth, thisUserData.email, password)
                    .then((userCredential) => {
                        if (email != thisUserData.email && email != '') {
                            updateEmail(auth.currentUser, email).then(() => {
                                try {
                                    update(dbRef(database, 'users/' + thisUser + '/'), {
                                        email: email
                                    });
                                    sendEmailVerification(auth.currentUser);
                                    alert('Email e/ou username atualizados com sucesso :)');
                                } catch (e) {
                                    console.log(e);
                                    alert('Ocorreu um erro ao atualizar o email na firebase.database, contate a responsável (Operação falhou)');
                                }
                            }).catch((error) => {
                                console.log(error);
                                alert('Ocorreu um erro ao atualizar o email na firebase.auth, contate a responsável (Operação falhou)');
                            });
                        }

                        if (username != thisUserData.email && username != '') {
                            if (username > 15) {
                                alert('O nome de usuário não deve ultrapassar 15 caracteres!');
                            } else {
                                try {
                                    update(dbRef(database, 'users/' + thisUser + '/'), {
                                        username: username
                                    });
                                    alert('Email e/ou username atualizados com sucesso :)');
                                } catch (e) {
                                    console.log(e);
                                    alert('Ocorreu um erro :( se persistir, contate a responsável');
                                }
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                        alert('Ocorreu um erro :( se persistir, contate a responsável');
                    });
            });
        }
    });
}

async function getImagesFromStorageFolder(path) {
    const folderRef = storageRef(storage, path);
    const result = await listAll(folderRef);
    const imageUrls = [];

    for (const itemRef of result.items) {
        const url = await getDownloadURL(itemRef); // Use await instead of .then()
        imageUrls.push(url);
    }

    return imageUrls; // Return the array of URLs
}

function deleteFile(filePath) {
    const fileRef = storageRef(storage, filePath);

    deleteObject(fileRef).then(() => {
        console.log('File deleted successfully');
    }).catch((error) => {
        console.error('Error deleting file:', error);
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
