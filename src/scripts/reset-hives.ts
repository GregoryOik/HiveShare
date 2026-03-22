import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "fake",
  authDomain: "hiveshare-dev.firebaseapp.com",
  projectId: "hiveshare-dev",
  storageBucket: "hiveshare-dev.appspot.com",
  messagingSenderId: "fake",
  appId: "fake"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetHives() {
  const querySnapshot = await getDocs(collection(db, "hives"));
  for (const document of querySnapshot.docs) {
    console.log(`Resetting hive ${document.id} to available...`);
    await updateDoc(doc(db, "hives", document.id), {
      status: "available",
      assignedTo: null,
      currentSubscribers: 0
    });
  }
  console.log("Done!");
}

resetHives();
