import * as firebase from "firebase";

if (!firebase.apps.length) {
  var app = firebase.initializeApp({
    apiKey: "key",
    databaseURL: "https://myrke-189201.firebaseio.com/",
    projectId: "myrke-189201"
  });
}

var database = firebase.database();

export function getPublicPosts() {
  return database
    .ref("/posts/public/")
    .once("value")
    .then(function(snapshot) {
      console.log(JSON.stringify(snapshot));
    });
}

export async function getPost(id) {
  // return database
  //   .ref(`/posts/public/${id}`)
  //   .once("value")
  //   .then(function(snapshot) {
  //     return snapshot[Object.keys(snapshot)[0]];
  //   });

  const response = await fetch(`https://myrke-189201.firebaseio.com/posts/${id}.json`)
  const respJson = await response.json();
  return respJson[Object.keys(respJson)[0]];
}
