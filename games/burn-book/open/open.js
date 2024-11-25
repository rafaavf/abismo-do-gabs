import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getDatabase, ref as databaseRef, onValue, set, update, push as databasePush, get, remove as databaseRemove } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
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
onAuthStateChanged(auth, async (user) => {  
    if (user) {
        const value = getUrlVal('id');

        if (value == null) {

            returnButton(1);

            const container = document.getElementById('content');
            const flexDiv = document.createElement('div');
            flexDiv.className = 'flexDiv';
            flexDiv.id = 'flexDiv';
            container.appendChild(flexDiv);

            const userBurnBooksRef = databaseRef(database, 'games/burn-book/user-data/' + user.uid);
            onValue(userBurnBooksRef, async snapshot => {  
                flexDiv.innerHTML = '';

                const userBurnBooks = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);

                for (const p of userBurnBooks) { 
                    for (const i of p) {
                        console.log(i);

                        const burnBookRef = databaseRef(database, 'games/burn-book/game-data/' + i);
                        const d = await get(burnBookRef);  
                        const burnBookData = d.val();
                        console.log(burnBookData);

                        const itemDiv = document.createElement('div');
                        itemDiv.className = 'itemDiv';

                        const bookTitle = document.createElement('h2');
                        bookTitle.className = 'bookTitle';
                        bookTitle.textContent = burnBookData.title;

                        const dateCreated = document.createElement('h3');
                        dateCreated.className = 'dateCreated';

                        const dateCreatedText = new Date(burnBookData.date);
                        dateCreated.textContent = dateCreatedText.toLocaleDateString('pt-BR');

                        const bookDiv = document.createElement('div');
                        bookDiv.className = 'bookDiv';

                        const bookButton = document.createElement('button');
                        bookButton.className = 'bookButton';
                        bookButton.id = 'bookButton';
                        bookButton.addEventListener('click', () => {
                            //window.location.replace('http://127.0.0.1:5500/games/burn-book/open/open.html?id=' + burnBookData.id);
                            window.location.replace('https://rafaavf.github.io/abismo-do-gabs/games/burn-book/open/open.html?id=' + burnBookData.id);

                        });

                        const bookImg = document.createElement('img');
                        bookImg.className = 'bookImg';
                        bookImg.src = '../assets/burn book pink pixelate.png';

                        let coverImg;

                        if (burnBookData.hasCoverImg) {
                            coverImg = document.createElement('img');
                            coverImg.className = 'coverImg';

                            const imageUrls = await getImagesFromStorageFolder('games/burn-book/game-data/' + burnBookData.id + '/cover');  // Await cover image
                            coverImg.src = imageUrls[0];
                        }

                        const authors = document.createElement('h3');
                        authors.className = burnBookData.hasCoverImg
                            ? 'authorsImg'
                            : 'authors';

                        const authorsList = [];
                        const authorsListId = Object.keys(burnBookData.authors).filter(item => item != user.uid);
                        console.log(authorsListId == 0)

                        if (authorsListId.length > 0) {
                            const allUsers = await getUsers(); 

                            const allUserData = Object.keys(allUsers).map(key => allUsers[key]);

                            allUserData.forEach(w => {
                                if (authorsListId.includes(w.id)) {
                                    authorsList.push(w.username);
                                }
                            });
                        }

                        console.log("Authors List: ", authorsList);

                        if (authorsList.length > 2) {
                            const authorsTextContent = 'Você, ' + authorsList[0] + ', ' + authorsList[1] + ', . . .';
                            authors.textContent = authorsTextContent;
                        } else if (authorsList.length == 0) {
                            let authorsTextContent = 'Você';
                            authors.textContent = authorsTextContent;
                        } else {
                            let authorsTextContent = 'Você';
                            authorsList.forEach(j => {
                                authorsTextContent += ', ' + j;
                            });
                            authors.textContent = authorsTextContent;
                        }

                        flexDiv.appendChild(itemDiv);
                        itemDiv.appendChild(bookTitle);
                        itemDiv.appendChild(dateCreated);
                        itemDiv.appendChild(bookDiv);
                        itemDiv.appendChild(authors);

                        bookButton.appendChild(bookImg);
                        bookDiv.appendChild(bookButton);

                        if (coverImg != null) {
                            bookDiv.appendChild(coverImg);
                        }
                    }
                }
            });
        } else {

            returnButton(2)

            const infoButton = document.createElement('button');
            infoButton.className = "infoButton";
            infoButton.textContent = "Informações";
            // document.getElementById("returnButtonDiv").appendChild(infoButton);

            const usernameAwait = await get(databaseRef(database, 'users/' + user.uid + '/username'));

            const username = Object.keys(usernameAwait).map(key => usernameAwait[key]);

            const container = document.getElementById('content');

            const flexDiv2 = document.createElement('div');
            flexDiv2.className = 'flexDiv2';

            const openedBook = document.createElement('img');
            openedBook.className = 'openedBook';
            openedBook.src = '../assets/livro aberto pixelate.png';

            const burnBookContentDiv = document.createElement('div');
            burnBookContentDiv.className = 'burnBookContentDiv';

            const addBlock = document.createElement('button');
            addBlock.className = 'addBlock';
            addBlock.addEventListener('click', () => {
                const contentBookRef = databaseRef(database, 'games/burn-book/game-data/' + value + '/content');
                const pushContentBook = databasePush(contentBookRef);

                const currentDate = formatDate(Timestamp.fromDate(new Date()).toDate());

                set(pushContentBook, {
                    title: 'Insira título',
                    creator: username[0].value_,
                    hasCoverImg: false,
                    type: 'string',
                    date: currentDate,
                    id: pushContentBook.key
                })
            });

            const addBlockText = document.createElement('span');
            addBlockText.textContent = 'Adicionar';
            addBlockText.className = "buttonText";
            addBlock.appendChild(addBlockText);

            container.appendChild(flexDiv2)
                .appendChild(openedBook);

            flexDiv2.append(burnBookContentDiv);


            flexDiv2.appendChild(addBlock);



            const burnBookRef = databaseRef(database, 'games/burn-book/game-data/' + value);

            onValue(burnBookRef, snapshot => {
                const burnBookData = snapshot.val();

                if (!burnBookData.content) {
                    burnBookContentDiv.innerHTML = ''
                } else {

                    Object.entries(burnBookData.content).forEach(([key, v]) => {
                        // Verificar se o bloco já existe
                        let blockDiv = document.getElementById(`block-${key}`);

                        if (!blockDiv) {
                            // Se o bloco não existe, criá-lo
                            blockDiv = document.createElement('div');
                            blockDiv.className = 'blockDiv';
                            blockDiv.id = `block-${key}`; // Atribui um ID único
                            burnBookContentDiv.appendChild(blockDiv);

                            const headingDiv = document.createElement('div');
                            headingDiv.className = 'headingDiv';
                            blockDiv.append(headingDiv);

                            const blockImgInput = document.createElement('input');
                            blockImgInput.type = 'file';
                            blockImgInput.accept = 'image/*';
                            blockImgInput.id = `blockImgInput-${key}`;
                            console.log(`games/burn-book/game-data/${value}/content/${key}/coverImg/${key}_coverImg`)

                            headingDiv.appendChild(blockImgInput);

                            document.getElementById(`blockImgInput-${key}`).addEventListener('change', (event) => {
                                const file = event.target.files[0];
                                if (file && file.type.startsWith('image/')) {
                                    coverImg.src = URL.createObjectURL(file);
                                    

                                    const pathStorageRef = storageRef(storage, `games/burn-book/game-data/${value}/content/${key}/coverImg/${key}_coverImg`);
                                    const uploadTask = uploadBytes(pathStorageRef, file);
                                    uploadTask.then((h) => {
                                        update(databaseRef(database, `games/burn-book/game-data/${value}/content/${key}`), {
                                            hasCoverImg: true
                                        }).cath(e => console.log(e))
                                    })
                                    console.log(v.hasCoverImg)
                                }
                            })

                            const coverImgLabel = document.createElement('label');
                            coverImgLabel.setAttribute('for', `blockImgInput-${key}`);
                            headingDiv.appendChild(coverImgLabel);


                            const coverImg = document.createElement('img');
                            coverImg.className = 'coverImgBlock';
                            coverImg.id = `coverImg-${key}`;
                            coverImgLabel.appendChild(coverImg);

                            if (v.hasCoverImg) {
                                getImagesFromStorageFolder(`games/burn-book/game-data/${value}/content/${key}/coverImg`).then(async (h) => {
                                    const imageUrl = h[0];
                                    if (imageUrl) {
                                        const img = new Image();
                                        img.src = imageUrl;

                                        img.onload = () => {
                                            // Set the src of the actual cover image after it has loaded
                                            coverImg.src = img.src;
                                        };

                                        img.onerror = () => {
                                            console.log('Error loading image.');
                                            coverImg.src = '../assets/eye.jpg'; // fallback
                                        };
                                    }
                                });
                            } else {
                                coverImg.src = '../assets/eye.jpg';
                            }


                            const titleDiv = document.createElement('div');
                            titleDiv.className = 'titleDiv';
                            headingDiv.append(titleDiv);

                            const delButtonDiv = document.createElement('div');
                            delButtonDiv.className = 'delButtonDiv';
                            titleDiv.appendChild(delButtonDiv)

                            const title = document.createElement('textarea');
                            title.spellcheck = false;
                            title.maxLength = 25;
                            title.className = 'blockTitle';
                            title.value = v.title;
                            title.id = `${key}.title`
                            delButtonDiv.appendChild(title);

                            const delButton = document.createElement('button');
                            delButton.className = 'delButton';
                            delButton.addEventListener('click', async () => {
                                const userConfirm = confirm('Você realmente quer apagar esse bloco?');

                                if (userConfirm) {
                                    try {
                                        // Removing data from Realtime Database
                                        const pathRef = databaseRef(database, `games/burn-book/game-data/${value}/content/${key}`);
                                        await databaseRemove(pathRef);
                                        console.log('Database entry removed successfully.');

                                        // Removing file from Firebase Storage
                                        const fileRef = storageRef(storage, `games/burn-book/game-data/${value}/content/${key}/coverImg/${key}_coverImg`);
                                        await deleteObject(fileRef);
                                        console.log('Storage object removed successfully.');

                                    } catch (error) {
                                        console.log('Error removing entry:', error);
                                    }
                                }

                            })
                            delButtonDiv.appendChild(delButton);

                            const creator = document.createElement('p');
                            creator.className = 'creator';
                            creator.textContent = `Adicionado por: ${v.creator}`;
                            titleDiv.appendChild(creator);

                            const date = document.createElement('p');
                            date.className = 'date';
                            date.textContent = v.date;
                            titleDiv.appendChild(date);

                            const textDiv = document.createElement('div');
                            textDiv.className = 'textDiv';
                            blockDiv.appendChild(textDiv);

                            const buttonDiv = document.createElement('div');
                            buttonDiv.className = 'buttonDiv';
                            blockDiv.appendChild(buttonDiv);

                            const addTextButton = document.createElement('button');
                            addTextButton.className = 'addButtons';
                            const addTextButtonSpan = document.createElement('span');
                            addTextButtonSpan.className = 'addButtonsSpan';
                            addTextButtonSpan.textContent = 'Add Texto';
                            addTextButton.appendChild(addTextButtonSpan);
                            buttonDiv.appendChild(addTextButton);

                            // const addImgButton = document.createElement('button');
                            // addImgButton.className = 'addButtons';
                            // const addImgButtonSpan = document.createElement('span');
                            // addImgButtonSpan.textContent = 'Add Imagem';
                            // addImgButton.appendChild(addImgButtonSpan);
                            // buttonDiv.appendChild(addImgButton);

                            addTextButton.addEventListener('click', () => {
                                addNewText('Insira texto', value, key);
                            });

                            // addImgButton.addEventListener('click', () => {

                            //     addNewImage(value, key)
                            //     console.log('abc')

                            // })


                            title.addEventListener('change', async () => {

                                const pathRef = databaseRef(database, `games/burn-book/game-data/${value}/content/${key}`)
                                update(pathRef, { title: document.getElementById(`${key}.title`).value }).catch(e => { console.log(e) });

                            });

                            const blocksRef = databaseRef(database, `games/burn-book/game-data/${value}/content/${key}/blocks`);

                            onValue(blocksRef, s => {
                                const blocksTextData = s.val();

                                if (!blocksTextData) {
                                    textDiv.innerHTML = ''
                                } else {

                                    Object.entries(blocksTextData).forEach(([k, vv]) => {

                                        let blockTextDiv = document.getElementById(`block-text-${key}-${k}`);


                                        if (!blockTextDiv) {

                                            if (blocksTextData.type = 'text') {

                                                blockTextDiv = document.createElement('div');
                                                blockTextDiv.className = 'blockTextDiv';
                                                blockTextDiv.id = `block-text-${key}-${k}`

                                                const blockTextArea = document.createElement('textarea');
                                                blockTextArea.spellcheck = false;
                                                blockTextArea.value = vv.text;
                                                blockTextArea.id = `block-textArea-${key}-${k}`;
                                                blockTextArea.className = 'blockTextArea';

                                                setTimeout(async () => {
                                                    adjustHeight.call(blockTextArea);
                                                }, 100);

                                                blockTextArea.addEventListener('input', () => {
                                                    adjustHeight.call(blockTextArea);
                                                });

                                                blockTextDiv.appendChild(blockTextArea);


                                                textDiv.appendChild(blockTextDiv);

                                                blockTextArea.addEventListener('input', async () => {
                                                    const pathRef = databaseRef(database, `games/burn-book/game-data/${value}/content/${key}/blocks/${k}`)
                                                    update(pathRef, {
                                                        text: document.getElementById(`block-textArea-${key}-${k}`).value,
                                                    }).catch(e => { console.log(e) });
                                                    const snapshot = await get(pathRef);

                                                    if (snapshot.exists()) {
                                                        console.log('Data:', snapshot.val());
                                                    } else {
                                                        console.log('No data available');
                                                    }
                                                })

                                                const textDelButton = document.createElement('button');
                                                textDelButton.className = 'textDelButton';
                                                textDelButton.addEventListener('click', () => {
                                                    const userConfirm = confirm('Você realmente quer apagar esse texto?');

                                                    if (userConfirm) {

                                                        const pathRef = databaseRef(database, `games/burn-book/game-data/${value}/content/${key}/blocks/${k}`);
                                                        databaseRemove(pathRef).then(() => {
                                                            document.getElementById(`block-text-${key}-${k}`).remove();
                                                        }).catch(e => console.log(e));

                                                    }
                                                })

                                                blockTextDiv.appendChild(textDelButton);
                                            } else if (blocksTextData.type = 'img') {
                                                const blockImgDiv = document.createElement('div');
                                                blockImgDiv.className = 'blockImgDiv';

                                                textDiv.appendChild(blockImgDiv)

                                                const blockImgInput2 = document.createElement('input');
                                                blockImgInput2.type = 'file';
                                                blockImgInput2.accept = 'image/*';
                                                blockImgInput2.className = 'blockImgInput2';
                                                blockImgInput2.id = `blockImg-${key}-${k}`;

                                                blockImgInput2.addEventListener('change', async (event) => {
                                                    const file = event.target.files[0];
                                                    if (file && file.type.startsWith('image/')) {
                                                        coverImg.src = URL.createObjectURL(file);

                                                        const pathStorageRef = storageRef(storage, `games/burn-book/game-data/${value}/content/${key}/blocks/${k}/${k}_img`);
                                                        const uploadTask = uploadBytes(pathStorageRef, file);
                                                        uploadTask.then((h) => {
                                                            update(databaseRef(database, `games/burn-book/game-data/${value}/content/${key}/blocks/${k}`), {
                                                                date: Timestamp.fromDate(new Date)
                                                            })
                                                            console.log(v.hasCoverImg)
                                                        })
                                                    }
                                                })

                                                textDiv.appendChild(blockImgInput2);

                                                const blockImgLabel = document.createElement('label');
                                                blockImgLabel.setAttribute('for', 'blockImgInput2');

                                                const blockImg = document.createElement('img');
                                                blockImg.className = 'blockImg';
                                                blockImg.src = '../assets/eye.jpg';

                                                const textDelButton = document.createElement('button');
                                                textDelButton.className = 'textDelButton';
                                                textDelButton.addEventListener('click', async () => {
                                                    const userConfirm = confirm('Você realmente quer apagar esse texto?');

                                                    if (userConfirm) {
                                                        try {
                                                            const pathRef = databaseRef(database, `games/burn-book/game-data/${value}/content/${key}/blocks/${k}`);
                                                            databaseRemove(pathRef).catch(e => console.log(e));

                                                            const img_path_ref = storageRef(storage, `games/burn-book/game-data/${value}/content/${key}/blocks/${k}/${k}_img`);
                                                            await deleteObject(img_path_ref);

                                                        } catch (e) {

                                                        }

                                                    }
                                                })



                                                blockImgLabel.appendChild(blockImg);
                                                textDiv.appendChild(blockImgLabel);

                                            }

                                        } else {

                                            const blockTextArea = document.getElementById(`block-textArea-${key}-${k}`);
                                            blockTextArea.value = vv.text;

                                            
                                            adjustHeight.call(blockTextArea);
                                            

                                            const existingBlocks = document.querySelectorAll(`.blockTextDiv[id^="block-text-${key}-"]`);
                                            existingBlocks.forEach(existingBlock => {
                                                const blockId = existingBlock.id.split('-').pop();

                                                // Se o bloco não existir mais no banco de dados, remove do DOM
                                                if (!blocksTextData[blockId]) {
                                                    console.log('banana')
                                                    console.log(document.getElementById(`block-text-${key}-${blockId}`));
                                                    document.getElementById(`block-text-${key}-${blockId}`).innerHTML = '';
                                                }
                                            });

                                            const blockImgAbc = document.getElementById(`blockImg-${key}-${k}`);
                                            if (blockImgAbc) {
                                                getImagesFromStorageFolder(`games/burn-book/game-data/${value}/content/${key}/blocks/${k}`).then(async (h) => {
                                                    const imageUrl = h[0];
                                                    if (imageUrl) {
                                                        const img = new Image();
                                                        img.src = imageUrl;

                                                        img.onload = () => {

                                                            blockImgAbc.src = img.src;
                                                        };

                                                        img.onerror = () => {
                                                            console.log('Error loading image.');
                                                            coverImg.src = '../assets/eye.jpg';
                                                        };
                                                    }
                                                })
                                            }

                                        }

                                    })

                                }

                            })


                        } else {
                            // Se o bloco já existe, apenas atualize os valores
                            const title = document.getElementById(`${key}.title`);
                            title.value = v.title;
                            console.log(v.title);

                            const creator = blockDiv.querySelector('.creator');
                            creator.textContent = `Adicionado por: ${v.creator}`;

                            const date = blockDiv.querySelector('.date');
                            date.textContent = v.date;

                            const coverImg = document.getElementById(`coverImg-${key}`);

                            if (v.hasCoverImg) {
                                getImagesFromStorageFolder(`games/burn-book/game-data/${value}/content/${key}/coverImg`).then(async (h) => {
                                    const imageUrl = h[0];
                                    if (imageUrl) {
                                        const img = new Image();
                                        img.src = imageUrl;

                                        img.onload = () => {

                                            coverImg.src = img.src;
                                        };

                                        img.onerror = () => {
                                            console.log('Error loading image.');
                                            coverImg.src = '../assets/eye.jpg';
                                        };
                                    }
                                });
                            } else {
                                coverImg.src = '../assets/eye.jpg';
                            }


                            const existingIDs = Object.entries(burnBookData.content).map(item => item[0]);;
                            //console.log(existingIDs);

                            const existingBlocks2 = document.querySelectorAll(`.blockDiv[id^="block-"]`);

                            existingBlocks2.forEach(existingBlock => {
                                const blockId = existingBlock.id.replace('block-', '');

                                //console.log(blockId);

                                //console.log(existingIDs.includes(blockId));

                                if (!existingIDs.includes(blockId)) {
                                    console.log(blockId)
                                    document.getElementById(`block-${blockId}`).remove()
                                }
                            })
                        }

                    });

                }

            });

        }
    } else {
        window.location.replace('rafaavf.github.io/')
    }
});

function getUrlVal(x){
    const url = window.location.href;
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    const value = params.get(x);

    return value
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

async function getUsers() {
    return new Promise((resolve, reject) => {
        const a = databaseRef(database, 'users/')
        get(a).then(r => {

            if (r) {
                resolve(r.val())
            } else {
                reject('nothing found')
            }
        })
    })
}

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
}

async function addNewText(text, id, id2) {
    try {
        const snapshot = await get(databaseRef(database, `games/burn-book/game-data/${id}/content/${id2}/blocks`));
        const existingTexts = snapshot.val() || {};

        const currentIds = Object.keys(existingTexts).map(Number);
        const nextId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 0;

        await set(databaseRef(database, `games/burn-book/game-data/${id}/content/${id2}/blocks/${nextId}`), {
            text: text,
            type: 'text',
        });
        console.log(`Texto adicionado com ID: ${nextId}`);
    } catch (error) {
        console.error("Erro ao adicionar texto:", error);
        console.log(`games/burn-book/game-data/${id}/content/blocks/`)
    }
}

async function addNewImage(id, id2) {
    try {
        const snapshot = await get(databaseRef(database, `games/burn-book/game-data/${id}/content/${id2}/blocks`));
        const existingTexts = snapshot.val() || {};

        const currentIds = Object.keys(existingTexts).map(Number);
        const nextId = currentIds.length > 0 ? Math.max(...currentIds) + 1 : 0;

        await set(databaseRef(database, `games/burn-book/game-data/${id}/content/${id2}/blocks/${nextId}`), {
            type: 'img',
            id: nextId
        });

        console.log(`Texto adicionado com ID: ${nextId}`);
    } catch (error) {
        console.error("Erro ao adicionar texto:", error);
        console.log(`games/burn-book/game-data/${id}/content/blocks/`)
    }
}

function adjustHeight() {
    this.style.height = 'auto'; 
    this.style.height = `${this.scrollHeight}px`; 
}

function returnButton(type){
    const returnButton = document.getElementById('returnButton');
    const returnButtonDiv = document.getElementById('returnButtonDiv');

    if (type == 1){
        returnButton.addEventListener('click', ()=> window.location.replace('../menu/menu.html')); 
        returnButtonDiv.className = 'returnButtonDiv1';
    } else if (type == 2) {
       returnButton.addEventListener('click', ()=>window.location.replace('open.html'));
       returnButtonDiv.className = 'returnButtonDiv2'
    }
}

async function infoBox(){

    const bookId = getUrlVal('id');

    const infoBoxDiv = document.createElement('div');
    infoBoxDiv.className = "infoBoxDiv";

    const infoTitle = document.createElement('textarea');
    infoTitle.className = "infoTitle";
    infoTitle.addEventListener('input', ()=>{
        const pathR = databaseRef(database, `games/burn-book/game-data/${bookId}`);
        update(pathR, {
            title: infoTitle.value
        })
    })

    const infoCoverImgInput = document.createElement('input');
    infoCoverImgInput.className = "infoCoverImgInput";
    infoCoverImgInput.id = `infoCoverImgInput-${bookId}`;
    infoCoverImgInput.addEventListener('change', async(event)=>{
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {

            const pathStorageRef = storageRef(storage, `/games/burn-book/game-data/${bookId}/cover/${bookId}_cover`);
            const uploadTask = await uploadBytes(pathStorageRef, file);
            uploadTask.then((h) => {
                update(databaseRef(database, `games/burn-book/game-data/${bookId}`), {
                    hasCoverImg: true
                }).cath(e => console.log(e))
            })
        }
    })

    const pathR = databaseRef(database, `games/burn-book/game-data/${bookId}`);
    await onValue(pathR, (snapshot)=>{
        const snapshotVal = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);

        infoTitle.value = snapshotVal.title;
    })

}
