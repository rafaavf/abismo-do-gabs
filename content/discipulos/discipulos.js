import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as databaseRef, get, onValue } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getStorage, ref as storageRef, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-storage.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
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
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

let defaultPfpUrl;

onAuthStateChanged(auth, (user) => {
    console.log(user);

    if (user) {

        checkAccess(user.uid);

        const activityTracker = new SetUserStatus(user);

        const thisUsersDataRef = databaseRef(database, '/users/');

        onValue(thisUsersDataRef, async snapshot => {
            const thisUsersData = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);

            const container = document.getElementById('content');
            container.innerHTML = '';

            thisUsersData.forEach(async (i) => {

                if (i.hasAcess) {
                    const newDiv = document.createElement('div');
                    newDiv.className = 'userStyle';

                    const username = document.createElement('u');
                    username.className = 'usernameStyle';
                    username.textContent = i.username;

                    const usernamePfpDiv = document.createElement('div');
                    usernamePfpDiv.className = 'usernamePfpDiv';

                    const usernameDiv = document.createElement('div');
                    usernameDiv.className = 'usernameDiv';

                    const userStatusDiv = document.createElement('div');
                    userStatusDiv.className = 'userStatusDiv';

                    const userStatus = document.createElement('u');
                    userStatus.textContent = i.status;
                    userStatus.className = i.status == 'online' ? 'userStatusOnline' : 'userStatusOffline';

                    const userStatusImg = document.createElement('img');
                    userStatusImg.className = 'userStatusImg';

                    if (i.status == 'online'){
                        userStatusImg.src = '../assets/images/online icon.png';
                    } else if (i.status == 'idle'){
                        userStatusImg.src = '../assets/images/idle icon.png';
                    } else if (i.status == 'offline'){
                        userStatusImg.src = '../assets/images/offline icon.png';
                    }

                    const lastOnline = document.createElement('u');
                    lastOnline.className = 'lastOnline';
                    lastOnline.textContent = i.status == 'online' || i.status == 'idle' ? 'visto por último: Agora' :`visto por último: ${i.lastOnline}`;

                    const elementsDiv = document.createElement('div');
                    elementsDiv.className = 'elementsDiv';

                    const description = document.createElement('u');
                    description.className = 'descriptionStyle';
                    description.textContent = i.description === '' ? '[Sem descrição]' : i.description;

                    const role = document.createElement('u');
                    role.className = 'roleStyle';
                    role.textContent = i.role ? 'Cargo: ' + i.role : 'Cargo: Nenhum';

                    const dateCreated = document.createElement('u');
                    dateCreated.className = 'elementsStyle';
                    const dateCreatedTransformed = new Date(i.dateCreated);
                    dateCreated.textContent = 'Entrou: ' + dateCreatedTransformed.toLocaleDateString("pt-BR");

                    const pfpElement = document.createElement('img');
                    pfpElement.className = 'pfpStyle';

                    await getImagesFromStorageFolder('users/' + i.id + '/pfp').then(url => {
                        if (url.length > 0) {
                            pfpElement.src = url[0];
                        } else {
                            throw new Error('No images found');
                        }
                    }).catch(e => {
                        pfpElement.src = '../assets/images/no_pfp.png';
                    })

                    userStatusDiv.appendChild(userStatusImg);
                    userStatusDiv.appendChild(userStatus);

                    usernameDiv.appendChild(username);
                    usernameDiv.appendChild(userStatusDiv);
                    usernameDiv.appendChild(lastOnline);

                    usernamePfpDiv.appendChild(pfpElement);
                    usernamePfpDiv.appendChild(usernameDiv);

                    
                    elementsDiv.appendChild(description);
                    elementsDiv.appendChild(role);
                    elementsDiv.appendChild(dateCreated);

                    container
                        .appendChild(newDiv)
                        .appendChild(usernamePfpDiv);

                    newDiv.appendChild(elementsDiv);

                }

            });
        });
    } else {
        location.assign('https://rafaavf.github.io/abismo-do-gabs/');
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

async function checkAccess(uid) {

    const userDataRef = databaseRef(database, '/users/' + uid);
    await get(userDataRef, (snapshot) => { }).catch(async e => {
        console.log(e.message)

        if (e.message == "Permission denied") {
            alert('Você não têm permissão para acessar a plataforma. Contate a proprietária para requisitar acesso');
            await signOut(auth).then(() => window.location.replace('../../'));
        }
    });
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
}
