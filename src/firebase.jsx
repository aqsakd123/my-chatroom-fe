import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
    apiKey: "DELETED_FOR_SECURITY_REASON",
    authDomain: "DELETED_FOR_SECURITY_REASON",
    projectId: "DELETED_FOR_SECURITY_REASON",
    storageBucket: "DELETED_FOR_SECURITY_REASON",
    messagingSenderId: "DELETED_FOR_SECURITY_REASON",
    appId: "DELETED_FOR_SECURITY_REASON"
};

const app = firebase.initializeApp(firebaseConfig)

const auth = app.auth()
const db = app.firestore()

if (window.location.hostname === 'localhost') {
    auth.useEmulator('http://localhost:9099');
    db.useEmulator('localhost', '8080');
}

export const addDocument = async (collection, data) => {
    const query = db.collection(collection);
    await query.add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const editDocument = async (collection, collectionUID, data) => {
    const query = db.collection(collection).doc(collectionUID);
    await query.set({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    }, {merge: true}).catch(r => console.log(r));
};

export { auth, db }
export { firebase }
