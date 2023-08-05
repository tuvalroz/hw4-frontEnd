const jwt = require('jsonwebtoken')

export async function handleExpiredToken(setUser: any, Router: any) {
    alert("Your token has expired or invalid");
    setUser({ username: "", email: "", token: "" });
    await Router.push("/login");
}

export function checkTokenValidation(token: string) {
    console.log("in check");
    let decodedToken = undefined;
    try {
        console.log("before jwt.verify");
        decodedToken = jwt.verify(token, process.env.SECRET)
        console.log("after jwt.verify");
    }
    catch (e) {
        return false;
    }

    if (!decodedToken.id) {
        return false;
    }
    return true;
}