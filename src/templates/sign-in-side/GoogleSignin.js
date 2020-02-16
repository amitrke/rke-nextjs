import React from 'react';
var firebase = require('firebase');
import { setUser, getUser } from '../../services/auth';

export default function GoogleSignin () {
    if (typeof window !== 'undefined') {
        var userCache = "";
        var localUserCache = getUser();
        if (!localUserCache && !firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyAgvZh2TZUc_n2dvu0oOo6tUgA1nJzEkwM",
                authDomain: "myrke-189201.firebaseapp.com",
                databaseURL: "https://myrke-189201.firebaseio.com",
                projectId: "myrke-189201",
              });
              var provider = new firebase.auth.GoogleAuthProvider();
              firebase.auth().signInWithPopup(provider).then(function(result) {
                  // This gives you a Google Access Token. You can use it to access the Google API.
                  var token = result.credential.accessToken;
                  // The signed-in user info.
                  var user = result.user;
                  console.log(user);
                  setUser(user);
                  userCache = user.displayName;
                  // ...
                }).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // The email of the user's account used.
                  var email = error.email;
                  // The firebase.auth.AuthCredential type that was used.
                  var credential = error.credential;
                  // ...
                });
        }
        if (localUserCache) {
            return (<div> Hey {localUserCache.name} !</div>)
        } else {
            return (<div> ... {userCache} </div>)
        }
        
    } else {
        return (<div> Loading Google Signin component ...</div>)
    }
}