export function setUser(userObject) {
    console.log("In set user");
    var expiry = new Date();
    expiry.setHours(expiry.getHours() + 4);
    var user = {
        name: userObject.user.displayName,
        validTill: expiry.getTime(),
        photoURL: userObject.user.photoURL,
        token: userObject.ma,
        accessToken: userObject.credential.accessToken
    }
    console.log("Storing "+JSON.stringify(user))
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
    var localUser = localStorage.getItem('user');
    if (localUser) {
        var localUserObj = JSON.parse(localUser);

        if (localUserObj.validTill && localUserObj.validTill > (new Date()).getTime()){
            return localUserObj;
        }
    }
    return undefined;
}