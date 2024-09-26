import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { useState } from "react";

const initalState = {
  isSignedIn: false,
  name: "",
  email: "",
  photoURL: "",
};

const app = initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState(initalState);

  const provider = new GoogleAuthProvider();
  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const { displayName, photoURL, email } = result.user;
        console.log(displayName, photoURL, email);

        const signedUser = {
          isSignedIn: true,
          name: displayName,
          email,
          photoURL,
        };
        setUser(signedUser);
      })
      .catch((error) => {
        console.log(error);
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };


  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUser(initalState)
    }).catch((error) => {
      // An error happened.
    });
  }
  return (
    <>
      <div className="app">
        {!user.isSignedIn ? (
          <button onClick={handleSignIn}> sign in </button>
        ) : (
          <button onClick={handleSignOut}>sign out</button>
        )}

        {user.isSignedIn && (
          <div>
            <p>Welcom, {user.name}</p>
            <p>Email: {user.email}</p>
            <img src={user.photoURL} alt="" />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
