// Import the functions you need from the SDKs you need

//import { query } from "express";
import { initializeApp } from "firebase/app";
//import { getFirestore } from "firebase/firestore";
import {GoogleAuthProvider, getAuth, signInWithPopup, 
   signInWithEmailAndPassword, createUserWithEmailAndPassword, 
   sendPasswordResetEmail, signOut,} from "firebase/auth";
   import secret from './secret.json';
   import {getFirestore, query, getDoc, getDocs,collection, where, addDoc,collectionGroup, setDoc, doc, deleteDoc, updateDoc} from "firebase/firestore";

   
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey : secret.setup.apiKey,
   authDomain : secret.setup.authDomain,
   projectId : secret.setup.projectId,
   storageBucket : secret.setup.storageBucket,
   messagingSenderId : secret.setup.messagingSenderId,
   appId :secret.setup.appId
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
     const usercred = await signInWithEmailAndPassword(auth, email, password);
     console.log("user is signed in", usercred.user);
   } catch (err) {
     throw err; // Throw the error to be caught in handleLogin
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

const fetchFriendsRecipe = async(userId, email) =>{
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
   
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
      const returnArray = [];
      if(data.exists()){
         const friendExists = query(collection(db, "users"), where("email", "==", email));
         const getDocsExists = await getDocs(friendExists);
         const friendData = getDocsExists.docs[0].data();
         const friendUid = friendData.uid;
   
         
         if(friendUid){
           
            const recipeQuery = query(collection(db, "users",friendUid,"Recipe"));

            const getRecipe = await getDocs(recipeQuery);
            getRecipe.forEach((recipe) => {
      
               returnArray.push(recipe.data())
      
            });
            
            return returnArray
         }

      
   }
   }
   catch (error) {
      console.error('Error adding friend:', error);
    }


}

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

const fetchCalender = async(userId) => {
   const q = query(collection(db, "users"), where("uid", "==", userId));

   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
   const returnArray = [];

   if (data.exists()){
      const calenderQuery = query(collection(db, "users",userId,"Calender"));

      const getCalender = await getDocs(calenderQuery);
      getCalender.forEach((day) => {

         returnArray.push(day.data())

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


const addRecipeCalender = async(userId, id, title, url, date, startStr, endStr, allDay) =>{
   try{
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];  
      if(data.exists()){
         await setDoc(doc(db, "users", userId, 'Calender', id),{
            id : id, 
            title : title, 
            url : url,
            date :date, 
            startStr : startStr, 
            endStr : endStr,
            allDay : allDay,
         });
      }


   }
   catch (error){
      console.error('error adding recipe to calender', error)

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

// const updateOldImage = async(userId, name, link) =>{
//    try{
//       const q = query(collection(db, "users"), where("uid", "==", userId));

//       const getDocumentQ = await getDocs(q);
     

//       const data = getDocumentQ.docs[0];  
//       if(data.exists()){
//          await updateDoc(doc(db, "users", userId, 'Recipe',name), {
//             img:link,
//          });
         
//          console.log('data exists, ref is this!!!')


//       }
//    }
//    catch (error){
//       console.error('error updating recipe', error)

//    }
// };


const updateAvatarUser  = async (userId, avatar) =>{
   const q = query(collection(db, "users"), where("uid", "==", userId));
   
   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
  
   if (data.exists()){
      await updateDoc(doc(db, "users", userId), {
         myAvatar:avatar,
      });

    } 


};

const removeEventCal = async (userId, id) => {
   try {
      
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
    
      if(data.exists()){
         console.log('data exists in remmove event calendar ')
         console.log("id", id)
         const ref = doc(collection(db, "users", userId,'Calender'),id);
         console.log("ref", ref)

         await deleteDoc(ref);
         console.log("deleted from database")
      }
   }
   catch (error) {
      console.error('Error removign recipe:', error);
      }

}

const updateEvent  = async (userId, id,startTime, endTime, allDay,date) =>{
   const q = query(collection(db, "users"), where("uid", "==", userId));
   
   const getDocumentQ = await getDocs(q);
   const data = getDocumentQ.docs[0];
  
  
   if (data.exists()){
      await updateDoc(doc(db, "users", userId,"Calender",id), {
         startStr:startTime,
         endStr:endTime,
         allDay:allDay,
         date:date,
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

const fetchInfoUser = async(userId) =>{
   try {

      const q = query(collection(db, "users"), where("uid", "==", userId));
   
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
   
      if (data.exists()){
         

         const data = getDocumentQ.docs[0].data();
         let userInfo = []
         userInfo.push("User email:");   
         userInfo.push(data.email);
         userInfo.push("User about field:");   
         userInfo.push(data.aboutText);
         userInfo.push("User avatar:");   
         userInfo.push(data.myAvatar);
         userInfo.push("User name:");   
         userInfo.push(data.name);
         
         let recipeArray = [] 
         const recipeSnapshot = await getDocs(collection(db, 'users', userId, 'Recipe'));
         recipeSnapshot.forEach((recipeDoc) => {
         const recipeId = recipeDoc.id;
         const recipeData = recipeDoc.data();
         recipeArray.push("Recipe name:");   
         recipeArray.push(recipeData.name);   
         recipeArray.push("Recipe url:");   
         recipeArray.push(recipeData.url);   
         });

         let friendArray = [];
         const friendsSnapshot = await getDocs(collection(db, 'users', userId, 'Friends'));
         friendsSnapshot.forEach((friendDoc) => {
        
         const friendData = friendDoc.data();
         friendArray.push("Friend email:");   
         friendArray.push(friendData.email)
         });

         let calenderArray = [];
         const calendarSnapshot = await getDocs(collection(db, 'users', userId, 'Calender'));
         calendarSnapshot.forEach((calendarDoc) => {
         
         const calendarData = calendarDoc.data();
         calenderArray.push("Event title:");   
         calenderArray.push(calendarData.title);
         calenderArray.push("Event url:");   
         calenderArray.push(calendarData.url);
         calenderArray.push("Event allDay:");   
         calenderArray.push(calendarData.allDay);
         calenderArray.push("Event date:");   
         calenderArray.push(calendarData.date); 
         calenderArray.push("Event start date:");   
         calenderArray.push(calendarData.startStr);
         calenderArray.push("Event end date:");   
         calenderArray.push(calendarData.endStr);
         
         });
         
         let returnObject = {
            user : userInfo,
            friends: friendArray,
            recipes: recipeArray,
            calender:calenderArray

         }

         //console.log(JSON.stringify(returnObject))

         return returnObject;
      } 
      
   } catch (error) {
      console.log(error)
      
   }
   
}

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

const removeUser = async () => {
   const user = auth.currentUser;
 
   try {
     
     const userRef = doc(db, 'users', user.uid);
      // Delete user's authentication credentials
     await user.delete();

     // Delete user's Firestore data
     await deleteDoc(userRef);
 
    
     console.log("Account deleted");
   } catch (error) {
     console.error("Error deleting user account:", error);
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
   fetchFriendsRecipe,
   addRecipeCalender,
   fetchCalender,
   updateEvent,
   removeEventCal,
   fetchInfoUser,
   removeUser,
   
  
   
};
 // Export firestore database
 // It will be imported into your react app whenever it is needed
 //export const db = getFirestore(app);