import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue, get } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import {SetUserStatus} from "./assets/classes/setUserStatus.js";

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        checkAccess(user.uid);

        const thisUsernameRef = databaseRef(database, '/users/' + user.uid); 
        onValue(thisUsernameRef, (snapshot) => {
            const thisUserData = snapshot.val();         
                document.getElementById("helloUser").textContent = `Olá, ${thisUserData.username}!`;
        });

        const bannersRef = databaseRef(database, '/banners');
        get (bannersRef).then(snapshot => {
            const banners = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
            console.log(banners);

            banners.forEach(async i=>{

                const displayGamesDiv = document.getElementById('display-games');

                const bannerBox = document.createElement('div');
                bannerBox.className = 'bannerBox';
                
                const bannerTitle = document.createElement('p');
                bannerTitle.className = 'bannerTitle';
                bannerTitle.textContent = i.title;

                const bannerImg = document.createElement('img');
                bannerImg.src = i.imgPath;
                bannerImg.className = 'bannerImg';

                const bannerDescription = document.createElement('p');
                bannerDescription.className = 'bannerDescription';
                bannerDescription.textContent = i.description;

                const bannerButton = document.createElement('button');
                bannerButton.className = 'bannerButton';
                bannerButton.addEventListener('click', ()=>{
                    window.location.replace(i.link)
                })
                bannerButton.textContent = 'JOGAR!'

                bannerBox.appendChild(bannerTitle);
                bannerBox.appendChild(bannerImg);
                bannerBox.appendChild(bannerDescription);
                bannerBox.appendChild(bannerButton);

                displayGamesDiv.appendChild(bannerBox);

            })
        })

        const activityTracker = new SetUserStatus(user);
    } else {
        location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
    }
});

async function checkAccess(uid) {

    const userDataRef = databaseRef(database, '/users/' + uid);
    await get(userDataRef, (snapshot) => { }).catch(async e => {
        console.log(e.message)

        if (e.message == "Permission denied") {
            alert('Você não têm permissão para acessar a plataforma. Contate a proprietária para requisitar acesso');
            await signOut(auth).then(() => window.location.replace('../login.html'));
        }
    });
}

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