import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { isValidElement, useState } from "react";

const initalState = {
  isSignedIn: false,
  name: "",
  email: "",
  password: "",
  photoURL: ""
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
    signOut(auth)
      .then(() => {
        setUser(initalState);
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const handleSubmit = () => {};

  const handleChange = (e) => {
    let isFormValid
    if (e.target.name === "email") {
      isFormValid = /\S+@\S+\.\S+/.test(e.target.value);
      // console.log(isEmailValid)
    }
    if (e.target.name === "password") {
      isFormValid = e.target.value.length > 6;
    }
    if(e.target.name === "name"){
      isFormValid = e.target.value
    }
    if(isFormValid){
      const newUserInfo = {...user}
      newUserInfo[e.target.name] = e.target.value
      setUser(newUserInfo) 
    }
  };
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
        <h1>Our own Authentication system</h1>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>password: {user.password}</p>
        <form onSubmit={handleSubmit}>
          <input onBlur={handleChange} type="text" name="name" placeholder="Your name"/>
          <br />
          <br />
          <input
            type="text"
            name="email"
            onBlur={handleChange}
            placeholder="Email"
            required
          />
          <br />
          <br />
          <input
            type="password"
            name="password"
            onBlur={handleChange}
            placeholder="password"
            required
          />
          <br />
          <br />
          <input type="submit" value="Submit"></input>
        </form>
      </div>
    </>
  );
}

export default App;
