import { signInWithPopup, OAuthProvider } from "firebase/auth"
import { auth } from "../firebase";

export async function signInWithMicrosoft(){
    const provider = new OAuthProvider('microsoft.com');
    let user
    await signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = OAuthProvider.credentialFromResult(result)
            const accessToken = credential.accessToken
            user = await fetch("https://graph.microsoft.com/v1.0/me", {
                method: 'GET', 
                headers: new Headers({
                    'Authorization': accessToken, 
                    'Content-Type': 'application/x-www-form-urlencoded'
                }), 
            })
            .then(e => e.text())
            .then(e => JSON.parse(e))
            user.isConnected = true
            user.accessToken = accessToken
            user.message = ""
        })
    return isValid(user) ? user : {isConnected: false, message: "Invalid user", user: {}}
}

export function isValid(user){
    return user.mail.includes("@abakusitsolutions.eu")
}