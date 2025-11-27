import { SignupForm, LoginForm } from "@/interfaces";
import axios from "axios";

//  after 10 mins



async function signUp(payload: SignupForm) {
    console.log(payload)
    console.log(process.env.NEXT_PUBLIC_API_URL)
    try {
        const userResponse = await axios.post(process.env.NEXT_PUBLIC_API_URL as string + "/users/signup", payload)
        return userResponse.status
    } catch (error) {
        console.log(error)
    }   
}


async function logIn(payload: LoginForm) {
    console.log(payload)
    console.log(process.env.NEXT_PUBLIC_API_URL)
    try {
        const userResponse = await axios.post(process.env.NEXT_PUBLIC_API_URL as string + "/users/login", payload)
        return userResponse
    } catch (error) {
        console.log(error)
    }   
}
export { signUp , logIn}
