import React from 'react';
import SignInSide from '../src/templates/sign-in-side/SignInSide';
var firebase = require('firebase');


export default function Loginpage() {
    if (typeof window !== 'undefined') {
        var firebaseui = require('firebaseui');
        return (<SignInSide></SignInSide>)
    } else {
        return (<SignInSide></SignInSide>)
    }
};
