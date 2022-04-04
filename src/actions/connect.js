import { signInWithPopup, OAuthProvider } from "firebase/auth"
import { auth } from "../firebase";

export async function signInWithMicrosoft(){
    try {
        const provider = new OAuthProvider('microsoft.com');
        let user
        await signInWithPopup(auth, provider)
            .then(async (result) => {
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                user = await fetch("https://graph.microsoft.com/v1.0/me", {
                    method: 'GET', 
                        headers: new Headers({
                            'Authorization': accessToken, 
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }), 
                    })
                    .then(e => e.text())
                    .catch(err => console.log(err))
        }).catch((error) => {
            console.log(error)
        })
        return JSON.parse(user)
    } catch(err) {
        console.log(err)
    }
}

export function isValid(user){
    return user.mail.includes("@abakusitsolutions.eu")
}