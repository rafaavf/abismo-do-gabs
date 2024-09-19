import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

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
const thisUser = getCookie('_userid');

const thisUsersDataRef = ref(database, '/users/');

onValue(thisUsersDataRef, (snapshot) => {
    const thisUsersData = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);

    thisUsersData.forEach(i => {
        if (i.hasAcess) {

            const newDiv = document.createElement('div');
            newDiv.className = 'userStyle';

            const pfpUrl = document.createElement('img');
            pfpUrl.className = 'pfpStyle';
            i.pfpUrl == ''
                ? pfpUrl.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5bj96rRqWtfI7OMayBS5waxJBvUiQc88hvw&s'
                : pfpUrl.src = i.pfpUrl;

            const username = document.createElement('u');
            username.className = 'usernameStyle';
            username.textContent = i.username;

            const usernameDiv = document.createElement('div');
            usernameDiv.className = 'usernameDiv';

            const description = document.createElement('u');
            description.className = 'descriptionStyle';
            i.description == '' || i.description == ''
                ? description.textContent = '[Sem descrição]'
                : description.textContent = i.description;

            const descriptionDiv = document.createElement('div');
            descriptionDiv.className = 'descriptionDiv';

            const role = document.createElement('u');
            role.className = 'roleStyle';
            i.role == null
                ? role.textContent = 'Cargo: Nenhum'
                : role.textContent = 'Cargo: ' + i.role;

            const roleDiv = document.createElement('div');
            roleDiv.className = 'roleDiv'

            const dateCreated = document.createElement('u');
            dateCreated.className = 'dateCreatedStyle';
            dateCreated.textContent = 'Entrou: ' + i.dateCreated.toDate().toLocaleDateString("pt-BR")

            document.getElementById('content')
                .appendChild(newDiv)
                .appendChild(usernameDiv)
                .appendChild(pfpUrl);
            usernameDiv.appendChild(username);

            newDiv.appendChild(document.createElement('br'));
            newDiv.appendChild(descriptionDiv);
            descriptionDiv.appendChild(description);

            newDiv.appendChild(roleDiv);
            roleDiv.appendChild(role);
            roleDiv.appendChild(dateCreated);

        }

    })

})

if (thisUser == null || thisUser == '') {
    location.assign('https://rafaavf.github.io/abismo-do-gabs/login.html');
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
