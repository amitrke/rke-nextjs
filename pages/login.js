import React from 'react';
import SignInSide from '../src/templates/sign-in-side/SignInSide';
import { setUser, getUser } from '../src/services/auth';

var firebase = require('firebase');

export default function Loginpage() {
    if (typeof window !== 'undefined') {
        if (!firebase.apps.length) {
            var firebaseConfig = {
                apiKey: "AIzaSyAgvZh2TZUc"+"_n2dvu0oOo6tUgA1nJzEkwM",
                authDomain: "myrke-189201.firebaseapp.com",
                databaseURL: "https://myrke-189201.firebaseio.com",
                projectId: "myrke-189201",
                storageBucket: "myrke-189201.appspot.com",
                messagingSenderId: "670134176077",
                appId: "1:670134176077:web:9ee500127a2e0e0b558f04",
                measurementId: "G-Z48Q0SRCJB"
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
        }
        var cachedUser = getUser();
        if (firebase && firebase.auth && !cachedUser){
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                setUser(result);
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
        
        if (cachedUser){
            console.log("Existing user ", cachedUser);
        }

        return (<SignInSide></SignInSide>)
    } else {
        return (<SignInSide></SignInSide>)
    }
};
