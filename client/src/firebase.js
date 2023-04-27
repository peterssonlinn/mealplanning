// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
import {GoogleAuthProvider, getAuth, signInWithPopup, 
   signInWithEmailAndPassword, createUserWithEmailAndPassword, 
   sendPasswordResetEmail, signOut,} from "firebase/auth";
import {getFirestore, query, getDocs, collection, where, addDoc,collectionGroup} from "firebase/firestore";


 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 // Your web app's Firebase configuration
 const firebaseConfig = {
    apiKey: "AIzaSyDc6u1j9g7029XxKf5I7EF_jFPRt8i6WNA",
    authDomain: "test-46b49.firebaseapp.com",
    projectId: "test-46b49",
    storageBucket: "test-46b49.appspot.com",
    messagingSenderId: "903879469",
    appId: "1:903879469:web:81cc3f9f3e36ff8fac91a4"
 };
 // Initialize Firebase
 
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
   try {
      const res = await signInWithPopup(auth, googleProvider);
      const user = res.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const docs = await getDocs(q);
      if(docs.docs.length === 0) {
         await addDoc(collection(db, "users"), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
         });
      }
   }catch(err) {
      console.error(err);
      alert(err.message);
   }
};


const logInWithEmailAndPassword = async (email, password) => {
   try {
      await signInWithEmailAndPassword(auth, email, password);
   } catch(err){
      console.error(err);
      alert(err.message);
   }
};
const registerWithEmailAndPassword = async (name, email, password) => {
   try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await addDoc(collection(db, "users"), {
         uid: user.uid,
         name,
         authProvider: "local",
         email
      });
   }catch(err) {
         console.error(err);
         alert(err.message);
      }
   };

const sendPasswordReset = async (email) => {
   try {
      await sendPasswordResetEmail(auth, email);
      alert("Link for password reset have been sent!");
   }catch(err){
      console.error(err);
      alert(err.message);
   }
};
const logout = () => {
   signOut(auth);
};

const fetchFriendList = async(userId) =>{
   const q = query(collection(db, "users"), where("uid", "==", userId));
   const doc = await getDocs(q);
   const data = doc.docs[0];

   if (data.exists()){
      console.log("inne i data.")
      const userRef = collection(db, `users/${userId}/Friends`);
      console.log("userRef", userRef);
      const t = query(userRef); 
      console.log("t",t) 
   
      getDocs(userRef).then((querySnapshot) => {
      if (querySnapshot.exists && !querySnapshot.empty) {
         console.log("inne i if");
         // The Friends collection for this user exists and is not empty
         // Do something with the query results
      } else if (querySnapshot.exists && querySnapshot.empty) {
         console.log("inne i elseif");
         // The Friends collection for this user exists but is empty
         // Do something else
      } else {
         console.log("inne i else");
         // The Friends collection for this user does not exist
         // Do something else, we want to create the friends collections for this user. 
      }
      }).catch((error) => {
      // Handle any errors that occur when trying to access the Friends collection
      }); 
   }
};

export {
   auth, 
   db,
   signInWithGoogle,
   signInWithEmailAndPassword,
   logInWithEmailAndPassword,
   registerWithEmailAndPassword,
   sendPasswordReset, 
   logout,
   fetchFriendList,
   
};
 // Export firestore database
 // It will be imported into your react app whenever it is needed
 //export const db = getFirestore(app);