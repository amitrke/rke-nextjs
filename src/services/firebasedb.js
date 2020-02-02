const fetch = require("node-fetch");

export async function getPost(id) {
  const response = await fetch(`https://myrke-189201.firebaseio.com/posts/${id}.json`)
  const respJson = await response.json();
  return respJson[Object.keys(respJson)[0]];
}
