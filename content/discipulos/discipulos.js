import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";

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
const storage = getStorage(app);
const auth = getAuth(app);

let defaultPfpUrl;
getDefaultPfp()

onAuthStateChanged(auth, (user) => {
    if (user) {
        const thisUsersDataRef = databaseRef(database, '/users/');
        const userDataRef = databaseRef(database, '/users/' + user.uid);
        onValue(userDataRef, (snapshot)=>{
            const userData = snapshot.val()
            if (!userData.hasAcess){
                signOut(auth);
                location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
            }
        })

        onValue(thisUsersDataRef, (snapshot) => {
            const thisUsersData = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);

            thisUsersData.forEach(async (i) => {
                if (i.hasAcess) {
                    const newDiv = document.createElement('div');
                    newDiv.className = 'userStyle';

                    const pfpElement = document.createElement('img');
                    pfpElement.className = 'pfpStyle';

                    getImagesFromStorageFolder('users/' + i.id + '/pfp').then(url => {
                        if (url.length > 0) {
                            pfpElement.src = url[0];
                        } else {
                            throw new Error('No images found');
                        }
                    }).catch(e => {
                        pfpElement.src = defaultPfpUrl;
                    })

                    const username = document.createElement('u');
                    username.className = 'usernameStyle';
                    username.textContent = i.username;

                    const usernameDiv = document.createElement('div');
                    usernameDiv.className = 'usernameDiv';

                    const description = document.createElement('u');
                    description.className = 'descriptionStyle';
                    description.textContent = i.description === '' ? '[Sem descrição]' : i.description;

                    const descriptionDiv = document.createElement('div');
                    descriptionDiv.className = 'descriptionDiv';

                    const role = document.createElement('u');
                    role.className = 'roleStyle';
                    role.textContent = i.role ? 'Cargo: ' + i.role : 'Cargo: Nenhum';

                    const roleDiv = document.createElement('div');
                    roleDiv.className = 'roleDiv';

                    const dateCreated = document.createElement('u');
                    dateCreated.className = 'dateCreatedStyle';
                    const dateCreatedTransformed = new Date(i.dateCreated);
                    dateCreated.textContent = 'Entrou: ' + dateCreatedTransformed.toLocaleDateString("pt-BR");

                    document.getElementById('content')
                        .appendChild(newDiv)
                        .appendChild(usernameDiv)
                        .appendChild(pfpElement);
                    usernameDiv.appendChild(username);

                    newDiv.appendChild(document.createElement('br'));
                    newDiv.appendChild(descriptionDiv);
                    descriptionDiv.appendChild(description);

                    newDiv.appendChild(roleDiv);
                    roleDiv.appendChild(role);
                    roleDiv.appendChild(dateCreated);
                }
            });
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

async function getDefaultPfp() {
    const urls = await getImagesFromStorageFolder('assets/pfpImg');
    if (urls.length > 0) {
        defaultPfpUrl = urls[0];
    }
}