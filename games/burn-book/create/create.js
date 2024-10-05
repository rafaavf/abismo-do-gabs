import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue, set, update, push as databasePush, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytes, listAll, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

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
const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
    if (user) {

        const thisUsernameRef = databaseRef(database, '/users/' + user.uid);
        onValue(thisUsernameRef, (snapshot) => {
            const thisUserData = snapshot.val();

            if (!thisUserData.hasAcess) {
                //signOut(auth);
                // location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
                console.log('no access')
            } else {
                const value_array = []

                const thisUsersDataRef = databaseRef(database, '/users/');
                onValue(thisUsersDataRef, (snapshot2) => {
                    const thisUsersData = Object.keys(snapshot2.val()).map(key => snapshot2.val()[key]);

                    const select = document.getElementById('select-user');

                    const coverImgElement = document.getElementById('coverImg');

                    document.getElementById('cover').addEventListener('change', function(event) {
                        const file = event.target.files[0];
                        if (file && file.type.startsWith('image/')) {
                            coverImgElement.src = URL.createObjectURL(file);
                        }
                    })

                    var value = 0;
                    thisUsersData.forEach(i => {
                        if (i.hasAcess && i.id != user.uid) {

                            const option = document.createElement('li');
                            option.textContent = i.username;
                            option.value = value;
                            value_array.push(i.id);
                            option.className = 'list-item';

                            select.appendChild(option);

                            option.addEventListener('click', (event) => {
                                event.target.classList.toggle('selected');
                                console.log(document.getElementById('select-user').childNodes);

                            });

                            value += 1
                        }
                    })

                });
                document.getElementById('send').addEventListener('click', () => {
                    const title = document.getElementById('title').value;
                    const coverImg = document.getElementById('cover').files[0];
                    const selectedUsers = []
                    selectedUsers.push(user.uid);
                    var formats = ['image/png', 'image/jpeg', 'image/jpg'];
                
                    if (title.length === 0 || title.replace(/\s+/g, '') == '') {

                        alert('Por favor, preencha o título');

                    } else if (coverImg && !formats.includes(coverImg.type)) {

                        alert("Por favor, selecione uma imagem que tenha algum dos seguintes formatos: png, jpeg, jpg");

                    } else if (title.length > 25) {

                        alert('O título não deve ultrapassar 25 caracteres');

                    } else {

                        const gameDataRef = databaseRef(database, 'games/burn-book/game-data/')

                        const burnBookRef = databasePush(gameDataRef);

                        const authors = {};

                        const currentTimestamp = Timestamp.fromDate(new Date()).toDate().toString();
                
                        document.getElementById('select-user').childNodes.forEach(element => {

                            if (element.className != undefined && element.className.includes('selected')) {

                                selectedUsers.push(value_array[element.value]);

                            }
                        });
                
                        for (let p = 0; p < selectedUsers.length; p++) {

                            authors[selectedUsers[p]] = true;

                        }
                
                        set(burnBookRef, {
                            title: title,
                            hasCoverImg: coverImg ? true : false,
                            authors: authors,
                            locked: false,
                            id: burnBookRef.key,
                            date: currentTimestamp
                        }).catch(e => {
                            console.log(e.message);
                        });
                
                        let uploadTasks = []; // Array to hold the upload promises
                
                        if (coverImg) {
                            const imageRef = storageRef(storage, '/games/burn-book/game-data/' + burnBookRef.key + '/cover/' + burnBookRef.key + '_cover');
                            const uploadTask = uploadBytes(imageRef, coverImg);
                            uploadTasks.push(uploadTask); // Add upload task to the array
                
                            uploadTask.then((snapshot) => {
                                console.log('Upload success');
                            }).catch((error) => {
                                console.error('Upload failed:', error);
                                alert('Ocorreu o seguinte erro: ' + error.message);
                            });
                        }
                
                        let userUpdatePromises = selectedUsers.map(i => {
                            const userDataRef = databaseRef(database, 'games/burn-book/user-data/' + i);
                            return get(userDataRef).then(j => {
                                const userData = j.val();
                                console.log(userData);
                
                                if (userData == null) {
                                    return set(userDataRef, {
                                        books: [burnBookRef.key]
                                    }).catch(e => alert('Ocorreu um erro: ' + e.message));
                                } else {
                                    var newBooks = [...userData.books];
                                    newBooks.push(burnBookRef.key);
                                    console.log(newBooks);
                
                                    return update(userDataRef, {
                                        books: newBooks
                                    }).catch(e => alert('Ocorreu um erro: ' + e.message));
                                }
                            });
                        });
                
                        // Wait for all uploads and user updates to complete
                        Promise.all([...uploadTasks, ...userUpdatePromises])
                            .then(() => {
                                // Navigate to the new page only after all tasks are completed
                                window.location.replace('http://127.0.0.1:5500/games/burn-book/open/open.html?id=' + burnBookRef.key);
                            })
                            .catch(error => {
                                alert('Ocorreu um erro: ' + error.message);
                            });
                    }
                });
                 
            }
        });

    } else {
        location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
    }
});
