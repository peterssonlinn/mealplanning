
import { initializeApp } from "firebase/app";
import {GoogleAuthProvider, getAuth, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut,} from "firebase/auth";
import secret from './secret.json';
import {getFirestore, query, getDoc, getDocs,collection, where, setDoc, doc, deleteDoc, updateDoc} from "firebase/firestore";

 const firebaseConfig = {
   apiKey : secret.setup.apiKey,
   authDomain : secret.setup.authDomain,
   projectId : secret.setup.projectId,
   storageBucket : secret.setup.storageBucket,
   messagingSenderId : secret.setup.messagingSenderId,
   appId :secret.setup.appId
 };

/**
 * Initializes a Firebase app with the given configuration object, and sets up
 * authentication, Firestore, and a Google authentication provider.
 * @param {Object} firebaseConfig - The configuration object for the Firebase app.
 */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Signs in a user with their Google account and creates a new user document in the
 * Firestore database if one does not already exist.
 * @returns None
 * @throws An error if there is an issue with signing in or creating a new user document.
 */
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
      throw err; 
   }
};


/**
 * Logs in a user with the given email and password using Firebase authentication.
 * @param {string} email - The email of the user to log in.
 * @param {string} password - The password of the user to log in.
 * @returns None
 * @throws An error if the login fails.
 */
const logInWithEmailAndPassword = async (email, password) => {
   try {
     const usercred = await signInWithEmailAndPassword(auth, email, password);
   } catch (err) {
     throw err; 
   }
 };


/**
 * Registers a new user with the given name, email, and password.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns None
 * @throws An error if the registration fails.
 */
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
      throw err; 
      }
   };

/**
 * Sends a password reset email to the given email address.
 * @param {string} email - The email address to send the password reset email to.
 * @returns None
 * @throws An error if there was an issue sending the password reset email.
 */
const sendPasswordReset = async (email) => {
   try {
      await sendPasswordResetEmail(auth, email);
      alert("Link for password reset have been sent!");
   }catch(err){
      throw err; 
   }
};


/**
 * Logs the user out of the current session.
 * @returns None
 */
const logout = () => {
   signOut(auth);
};

/**
 * Fetches the recipes of a friend given their email and user ID.
 * @param {string} userId - The user ID of the current user.
 * @param {string} email - The email of the friend whose recipes are being fetched.
 * @returns {Array} An array of recipe objects belonging to the friend.
 * @throws {Error} If there is an error fetching the data.
 */
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
      throw error; 
    }
}

/**
 * Adds a friend to the user's friend list in the Firestore database.
 * @param {string} userId - The ID of the user to add the friend to.
 * @param {string} email - The email of the friend to add.
 * @returns None
 * @throws {Error} If there is an error accessing the Firestore database.
 */
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
         throw error; 
       }
};

/**
 * Removes a friend from the user's friend list in the database.
 * @param {string} userId - The ID of the user whose friend list is being modified.
 * @param {string} email - The email of the friend to be removed.
 * @returns None
 * @throws {Error} If there is an error accessing the database.
 */
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
      throw error; 
      }
};

/**
 * Fetches the friend list for a given user ID from the Firestore database.
 * @param {string} userId - The ID of the user whose friend list is being fetched.
 * @returns {Array} An array of friend objects for the given user ID.
 * @throws {Error} If there is an error accessing the database.
 */
const fetchFriendList = async(userId) =>{
   try{
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

   }
   catch (error) {
      throw error; 
      }
  
};

/**
 * Fetches the calendar data for the given user ID from the Firestore database.
 * @param {string} userId - The ID of the user whose calendar data is being fetched.
 * @returns {Array} An array of calendar data objects for the user.
 * @throws {Error} If there is an error accessing the database.
 */
const fetchCalender = async(userId) => {
   try {
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
      
   } catch (error) {
      throw error; 
   }
   
};

/**
 * Fetches the list of recipes for the given user ID from the Firestore database.
 * @param {string} userId - The ID of the user whose recipe list is being fetched.
 * @returns {Array} An array of recipe objects for the given user ID.
 * @throws {Error} If there is an error fetching the recipe list.
 */
const fetchRecipeList = async(userId) => {
   try {
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
   } catch (error) {
      throw error; 
      
   }
};

/**
 * Removes a recipe from the user's collection in Firestore.
 * @param {string} userId - The ID of the user whose recipe is being removed.
 * @param {string} name - The name of the recipe being removed.
 * @returns None
 * @throws {Error} If there is an error accessing or deleting the recipe document.
 */
const removeRecpie = async(userId, name) => {
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
      if(data.exists()){
         const ref = doc(collection(db, "users", userId,'Recipe'),name);
         await deleteDoc(ref);
      }
   }
   catch (error) {
      throw error; 
      }
}


/**
 * Adds a recipe to the user's calendar.
 * @param {string} userId - The ID of the user.
 * @param {string} id - The ID of the recipe.
 * @param {string} title - The title of the recipe.
 * @param {string} url - The URL of the recipe.
 * @param {Date} date - The date of the recipe.
 * @param {string} startStr - The start time of the recipe.
 * @param {string} endStr - The end time of the recipe.
 * @param {boolean} allDay - Whether the recipe is an all-day event.
 * @returns None
 * @throws Throws an error if there is an issue accessing the database
 */
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
   catch (error) {
      throw error; 
      }

}
/**
 * Adds a recipe to the user's collection in the Firestore database.
 * @param {string} userId - the ID of the user to add the recipe to
 * @param {string} name - the name of the recipe
 * @param {string} url - the URL of the recipe
 * @param {string} img - the URL of the image associated with the recipe
 * @returns None
 * @throws {Error} if there is an error accessing the database
 */
const addRecpie = async(userId, name, url, img) => {
   try{
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];  

      if(data.exists()){
         await setDoc(doc(db, "users", userId, 'Recipe',name),{
            name : name, 
            url : url, 
            img : img,
         });
      }
   }
   catch (error) {
      throw error; 
      }

};

/**
 * Updates the avatar of a user in the Firestore database.
 * @param {string} userId - The ID of the user whose avatar is being updated.
 * @param {string} avatar - The new avatar URL to be saved in the database.
 * @returns None
 * @throws {Error} If there is an error updating the document in the database.
 */
const updateAvatarUser  = async (userId, avatar) =>{
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
   
      if (data.exists()){
         await updateDoc(doc(db, "users", userId), {
            myAvatar:avatar,
         });
      } 
      } catch (error) {
         throw error; 
      }
};

/**
 * Removes an event from the user's calendar in the database.
 * @param {string} userId - the ID of the user whose calendar the event is being removed from
 * @param {string} id - the ID of the event to be removed
 * @returns None
 * @throws Throws an error if there is an issue accessing the database.
 */
const removeEventCal = async (userId, id) => {
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
   
      if(data.exists()){
         const ref = doc(collection(db, "users", userId,'Calender'),id);
         await deleteDoc(ref);
      }
   }
   catch (error) {
      throw error; 
      }

}

/**
 * Updates an event in the user's calendar with the given start and end times, all day status, and date.
 * @param {string} userId - the ID of the user whose calendar is being updated
 * @param {string} id - the ID of the event to update
 * @param {string} startTime - the start time of the event in string format
 * @param {string} endTime - the end time of the event in string format
 * @param {boolean} allDay - whether or not the event is an all day event
 * @param {string} date - the date of the event in string format
 * @returns None
 * @throws Throws an error if the user does not exist
 */
const updateEvent  = async (userId, id,startTime, endTime, allDay,date) =>{
   try {
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
      
   } catch (error) {
      throw error; 
   }

};

/**
 * Updates the aboutText field of a user document in the Firestore database.
 * @param {string} userId - The ID of the user document to update.
 * @param {string} newText - The new text to set as the user's aboutText.
 * @returns None
 * @throws {Error} If there is an error updating the document.
 */
const updateTextAboutUser = async (userId, newText) =>{
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
     
      if (data.exists()){
         await updateDoc(doc(db, "users", userId), {
            aboutText:newText,
         });
       } 
      
   } catch (error) {
      throw error;   
   }
};

/**
 * Fetches user information from the Firestore database for the given user ID.
 * @param {string} userId - The ID of the user to fetch information for.
 * @returns An object containing the user's information, friends, recipes, and calendar events.
 * @throws An error if there is an issue fetching the data from the database.
 */
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
         return returnObject;
      } 
   } catch (error) {
      throw error; 
      
   }
}

/**
 * Fetches user profile information from the Firestore database for the given user ID.
 * @param {string} userId - The ID of the user whose profile information is being fetched.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the user's name, avatar, and about text.
 * @throws {Error} - If there is an error fetching the user's profile information.
 */
const fetchInfoUserProfile =  async(userId) =>{
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
      if (data.exists()){
         const data = getDocumentQ.docs[0].data();
         let returnObject = {
            name : data.name,
            myAvatar : data.myAvatar,
            aboutText : data.aboutText,
         }
         return returnObject
      }
   } catch (error) {
      throw error;  
   }
}


/**
 * Retrieves information about another user from the Firestore database.
 * @param {string} userId - the user ID of the current user
 * @param {string} email - the email address of the user to retrieve information about
 * @returns {Promise<Array>} - an array containing the name, about text, and avatar of the user
 * @throws {Error} - if there is an error retrieving the information from the database
 */
const getInfoOtherUser = async(userId, email) =>{
   try {
      const q = query(collection(db, "users"), where("uid", "==", userId));
   
      const getDocumentQ = await getDocs(q);
      const data = getDocumentQ.docs[0];
      if (data.exists()){
         const info =  query(collection(db, "users"), where("email", "==", email));
         const infoDoc = await getDocs(info);
        
         const friendData = infoDoc.docs[0].data();
         const returnData = [];
         returnData.push(friendData.name)
         returnData.push(friendData.aboutText)
         returnData.push(friendData.myAvatar)
         return returnData
      }
   } catch (error) {
      throw error; 
   }
  

};

/**
 * Removes the current authenticated user from the database and deletes their user document.
 * @returns None
 * @throws {Error} If there is an error deleting the user or their document.
 */
const removeUser = async () => {
   const user = auth.currentUser;
   try {
     const userRef = doc(db, 'users', user.uid);
     await user.delete();
     await deleteDoc(userRef);
   } catch (error) {
      throw error; 
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
   fetchInfoUserProfile,
};
