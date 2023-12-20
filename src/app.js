import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDocs, updateDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAJTpkp2N5O3fLHFHmoW2X6G_yCuoquXsE",
  authDomain: "partner-ea189.firebaseapp.com",
  projectId: "partner-ea189",
  storageBucket: "partner-ea189.appspot.com",
  messagingSenderId: "967618874478",
  appId: "1:967618874478:web:5f7eb7ae3b4e21212b2a7f"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


//init service
const db = getFirestore();




/*
//collection ref 
const colRef = collection(db, 'Nutzer')

//query
const q = query(colRef, orderBy("createdAt"))

//real time collection data 
onSnapshot(q, (snapshot) => {
  let Nutzer = []
  snapshot.docs.forEach((doc) => {
    Nutzer.push({ ...doc.data(), id: doc.id })
  })
  // console.log(Nutzer)
})


//selctors form add
const addUser = document.querySelector(".add")
addUser.addEventListener('submit', (e) => {
  e.preventDefault()

  addDoc(colRef, {
    Alter: addUser.alter.value,
    Name: addUser.name.value,
    createdAt: serverTimestamp()
  })
.then(() => {
  addUser.reset()
})
})

//selctors form delete
const deleteUser = document.querySelector(".delete")
deleteUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(db, 'Nutzer', deleteUser.id.value)
  deleteDoc(docRef)
  .then(() => 
  deleteUser.reset()
  )
})

// get single document
const docRef = doc(db, 'Nutzer', 'FXdz2Z0oTej1J0ZdfoBJ')
getDoc(docRef)

onSnapshot(docRef, (doc) => {
 // console.log(doc.data(), doc.id)
})

// update single document
const updateUser = document.querySelector(".update")
updateUser.addEventListener('submit', (e) => {
  e.preventDefault()
  const docRef = doc(db, 'Nutzer', updateUser.id.value)

  updateDoc(docRef, {
    Name: "Max"
  })
  .then(() => {
    updateUser.reset()
  })

});

// user signup
const userSignUp = document.querySelector(".signupForm")
userSignUp.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = userSignUp.email.value
  const password = userSignUp.password.value

  createUserWithEmailAndPassword(auth, email, password)
  .then((cred) => {
// console.log("User created: ", cred.user)
userSignUp.reset()
  })
.catch((err) => {
 // console.log(err.message)
})
})

// user login and out
const userLogin = document.querySelector(".loginForm")
userLogin.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = userLogin.email.value
  const password = userLogin.password.value

  signInWithEmailAndPassword(auth, email, password)
  .then((cred) => {
   // console.log("User logedin: ", cred.user)
      })
    .catch((err) => {
     // console.log(err.message)
    })
})

const userLogout = document.querySelector(".logout")
userLogout.addEventListener('click', (e) => {
  e.preventDefault()

  signOut(auth)
  .then(() => {
   // console.log("User signed out")
  })
  .catch((err) => {
    // console.log(err.message)
  })
})

// subscribing to auth changed
onAuthStateChanged(auth, (user) => {
  console.log("user status changed:", user)
})
*/
document.getElementById("notification-box").addEventListener("submit", function (event) {
  event.preventDefault();
  

  const list = document.getElementById("myList");
  const inputField = document.getElementById("addTask");
  const inputValue = inputField.value.trim();

  if (inputValue !== "") {
    // Add the input value to Firestore
    addDoc(collection(db, "tasks"), {
      text: inputValue,
      checked: false,
      timestamp: new Date(),
    })
      .then(() => {
        // Clear the input field
        inputField.value = "";

        // Render the updated list
        renderList();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  }
});

function renderList() {
  const list = document.getElementById("myList");

  // Clear the current list
  list.innerHTML = "";

  // Get tasks from Firestore
  getDocs(collection(db, "tasks"))
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const task = doc.data();
      const listItem = createListItem(doc.id, task.text, task.checked);
      console.log(doc.data(), doc.id)
      // Append the list item to the unordered list
      list.prepend(listItem);
    });
  })
  .catch((error) => {
    console.error("Error getting documents: ", error);
  });
}

function createListItem(taskId, taskText, isChecked) {
  const listItem = document.createElement("li");
  const customInput = document.createElement("input");
  const inputParagraph = document.createElement("p");
  customInput.type = "checkbox";
  customInput.checked = isChecked; // Set the checkbox state

  if (isChecked) {
    customInput.checked = true;
    inputParagraph.classList.add("inputChecked");
  } else {
    customInput.checked = false;
    inputParagraph.classList.remove("inputChecked");
  }

  // Assuming that you have a customInput and taskId available in your code
customInput.addEventListener("click", async function () {
  try {
     // Update task in Firestore
     await updateDoc(doc(db, "tasks", taskId), {
       checked: customInput.checked,
     });
 
     // Update the UI
     if (customInput.checked) {
       inputParagraph.classList.add("inputChecked");
     } else {
       inputParagraph.classList.remove("inputChecked");
     }
  } catch (error) {
     console.error("Error updating document: ", error);
  }
 });

  const removeItem = document.createElement("i");
  removeItem.classList.add("far", "fa-trash-alt", "fa-xl");
  // Assuming that you have a removeItem and taskId available in your code
removeItem.addEventListener("click", async function () {
  try {
     // Remove task from Firestore
     await deleteDoc(doc(db, "tasks", taskId));
 
     // Re-render the list
     renderList();
  } catch (error) {
     console.error("Error removing document: ", error);
  }
 });

  listItem.classList.add("message-box", "blue", "user-message");
  inputParagraph.innerText = taskText;
  // Append the custom checkbox and remove button to the list item
  listItem.appendChild(customInput);
  listItem.appendChild(inputParagraph);
  listItem.appendChild(removeItem);

  return listItem;
}

// Initially render the list when the page loads
renderList();

