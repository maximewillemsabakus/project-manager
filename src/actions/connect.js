import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import {auth} from "../firebase"

export async function signInWithGoogle(){
    let provider = new GoogleAuthProvider()
    try{
        signInWithPopup(auth, provider)
            .then(result => {
                const credential = GoogleAuthProvider.credentialFromResult(result)
                console.log(credential)
            })
    } catch(ex){
        
    }
}