import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { auth } from "./config";

// 1. Sign Up New Users
export async function signUpUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// 2. Log In Existing Users
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
}

// 3. Log Out
export function logoutUser() {
  return signOut(auth);
}

// 4. Listen to Auth Changes (keeps user logged in on refresh)
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback);
}