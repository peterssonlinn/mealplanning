// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
import {GoogleAuthProvider, getAuth, signInWithPopup, 
   signInWithEmailAndPassword, createUserWithEmailAndPassword, 
   sendPasswordResetEmail, signOut,} from "firebase/auth";
import {getFirestore, query, getDoc, getDocs,collection, where, addDoc,collectionGroup, setDoc, doc, deleteDoc, updateDoc} from "firebase/firestore";


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
      const docs = await getDoc(q);
      if(docs.docs.length === 0) {
         await setDoc(doc(db, "users",user.uid), {
            uid: user.uid,
            name: user.displayName,
            authProvider: "google",
            email: user.email,
            aboutText:"Welcome to my homepage",
            myAvatar:"/static/media/1.bd53b28416bedd0a1128.jpeg",
         });
      }
   }catch(err) {
      console.error(err);
      alert(err.message);
   }
};


const logInWithEmailAndPassword = async (email, password) => {
   try {
      await signInWithEmailAndPassword(auth, email, password).then((usercred) =>{
        // window.alert("user is signed in ", usercred.user)
      });
      
   } catch(err){
      console.error(err);

      //window.alert(err.message);
   }
};
const registerWithEmailAndPassword = async (name, email, password) => {
   try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;
      await setDoc(doc(db, "users",user.uid), {
         uid: user.uid,
         name,
         authProvider: "local",
         email,
         aboutText:"Welcome to my homepage",
         myAvatar:"/static/media/1.bd53b28416bedd0a1128.jpeg",
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

const addFriendToList = async(userId, email) =>{
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
   
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
      if(data.exists()){
         
         const friendExists = query(collection(db, "users"), where("email", "==", email));
         const getDocsExists = await getDocs(friendExists);
         const friendData = getDocsExists.docs[0];
         if(friendData.exists()){

            await setDoc(doc(db, "users", userId,'Friends',email), {
                  email:email,
               });
             } 

         }
      }
      catch (error) {
         console.error('Error adding friend:', error);
       }


};

const removeFriendFromList = async(userId, email) =>{
   try {
      
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
    
      if(data.exists()){
         const ref = doc(collection(db, "users", userId,'Friends'),email);
         await deleteDoc(ref);
      }
   }
   catch (error) {
      console.error('Error adding friend:', error);
      }

};
const fetchFriendList = async(userId) =>{
   const q = query(collection(db, "users"), where("uid", "==", userId));
   
   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
   const returnArray = [];
  
   if (data.exists()){
      
      const friendQuery = query(collection(db,"users",userId,"Friends"));

      const getFriends = await getDocs(friendQuery);
      getFriends.forEach((friend) => {

         returnArray.push(friend.data())

      });
      return returnArray;
      
   }
};

const fetchRecipeList = async(userId) => {
   const q = query(collection(db, "users"), where("uid", "==", userId));

   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
   const returnArray = [];

   if (data.exists()){
      const recipeQuery = query(collection(db, "users",userId,"Recipe"));

      const getRecipe = await getDocs(recipeQuery);
      getRecipe.forEach((recipe) => {

         returnArray.push(recipe.data())

      });
      return returnArray;
      
   }
};

const removeRecpie = async(userId, name, url, img) => {
   try {
      
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
    
      if(data.exists()){
         console.log('data exists', name)
         const ref = doc(collection(db, "users", userId,'Recipe'),name);
         console.log(ref)

         await deleteDoc(ref);
      }
   }
   catch (error) {
      console.error('Error removign recipe:', error);
      }
}
const addRecpie = async(userId, name, url, img) => {
   try{
      const q = query(collection(db, "users"), where("uid", "==", userId));

      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];  

      if(data.exists()){
         console.log('innan setDoc', name, url, img)
         await setDoc(doc(db, "users", userId, 'Recipe',name),{
            name : name, 
            url : url, 
            img : img,
         });
      }

   }
   catch (error){
      console.error('error adding recipe', error)

   }

};


const updateAvatarUser  = async (userId, avatar) =>{
   const q = query(collection(db, "users"), where("uid", "==", userId));
   
   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
   const returnArray = [];
  
   if (data.exists()){
      await updateDoc(doc(db, "users", userId), {
         myAvatar:avatar,
      });

    } 


};
const updateTextAboutUser = async (userId, newText) =>{
   const q = query(collection(db, "users"), where("uid", "==", userId));
   
   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
  
   if (data.exists()){
      await updateDoc(doc(db, "users", userId), {
         aboutText:newText,
      });
    } 


};

const getInfoOtherUser = async(userId, email) =>{
   const q = query(collection(db, "users"), where("uid", "==", userId));
   
   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
   if (data.exists()){
      const info =  query(collection(db, "users"), where("email", "==", email));
      const infoDoc = await getDocs(info);
     
      const friendData = infoDoc.docs[0].data();
      console.log(friendData)
      const returnData = [];
      returnData.push(friendData.name)
      returnData.push(friendData.aboutText)
      returnData.push(friendData.myAvatar)
      console.log(returnData)
      return returnData
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
   addFriendToList,
   removeFriendFromList,
   updateTextAboutUser,
   updateAvatarUser,
   getInfoOtherUser,
   fetchRecipeList,
   addRecpie,
   removeRecpie,
   
};
 // Export firestore database
 // It will be imported into your react app whenever it is needed
 //export const db = getFirestore(app);