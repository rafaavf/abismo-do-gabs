import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { getDatabase, ref as databaseRef, update, onDisconnect } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-database.js";
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
const auth = getAuth(app);
const database = getDatabase(app);

export class SetUserStatus {
    constructor(user) {
        this.user = user;
        this.uid = user.uid;
        this.inactivityLimit = 900000; 
        this.onlineInterval = null;
        this.inactivityTimer = null;
        this.isIdle = false;

        this.setOnline();

        this.startTracking();

        this.setupOnDisconnect();
    }

    async setOnline() {
        const pathRef = databaseRef(database, `users/${this.uid}`);
        await update(pathRef, { status: 'online' });
        //console.log(`${this.uid} is online`);
    }

    async setIdle() {
        this.isIdle = true;
        const pathRef = databaseRef(database, `users/${this.uid}`);
        const currentTime = this.formatDate(Timestamp.fromDate(new Date()).toDate());
        await update(pathRef, { status: 'idle', lastOnline: currentTime });
        clearInterval(this.onlineInterval);
        //console.log(`${this.uid} is idle`);
    }

    resumeOnlineInterval() {
        if (this.isIdle) {
            //console.log("Resuming online interval.");
            this.isIdle = false;
            this.onlineInterval = setInterval(() => this.setOnline(), 5000);
        }
    }

    startTracking() {
        this.resetInactivityTimer();

        this.onlineInterval = setInterval(() => {
            if (!this.isIdle) {
                this.setOnline();
            }
        }, 5000);

        window.addEventListener('mousemove', () => this.resetInactivityTimer());
        window.addEventListener('keypress', () => this.resetInactivityTimer());
        window.addEventListener('click', () => this.resetInactivityTimer());
        window.addEventListener('scroll', () => this.resetInactivityTimer());
        window.addEventListener('touchstart', () => this.resetInactivityTimer());
    }

    resetInactivityTimer() {
        clearTimeout(this.inactivityTimer); 
        if (this.isIdle) {
            this.resumeOnlineInterval(); 
        }
        this.isIdle = false;

        this.inactivityTimer = setTimeout(() => {
            this.setIdle();
        }, this.inactivityLimit);
    }

    setupOnDisconnect() {
        const userRef = databaseRef(database, `users/${this.uid}`);
        onDisconnect(userRef).update({
            status: 'offline',
            lastOnline: this.formatDate(Timestamp.fromDate(new Date()).toDate())
        });
    }

    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} às ${hours}:${minutes}`;
    }
}
