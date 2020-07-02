import React from 'react';
import SignInSide from '../src/templates/sign-in-side/SignInSide';


export default function Loginpage() {
    if (typeof window !== 'undefined') {
        return (<SignInSide></SignInSide>)
    } else {
        return (<SignInSide></SignInSide>)
    }
};
