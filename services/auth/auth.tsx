import { SignupForm, LoginForm } from "@/interfaces";
import axios from "axios";

//  after 10 mins



async function signUp(payload: SignupForm) {
    console.log(payload)
    console.log(process.env.NEXT_PUBLIC_API_URL)
    try {
        const userResponse = await axios.post(process.env.NEXT_PUBLIC_API_URL as string + "/users/signup", payload)
        return userResponse.status
    } catch (error: any) {
        console.error("Signup error:", error)
        if (error.response) {
            // Server responded with error status
            return error.response.status
        }
        // Network error or other issue
        return null
    }   
}


async function logIn(payload: LoginForm) {
    console.log(payload)
    console.log(process.env.NEXT_PUBLIC_API_URL)
    try {
        const userResponse = await axios.post(process.env.NEXT_PUBLIC_API_URL as string + "/users/login", payload)
        return userResponse
    } catch (error: any) {
        console.error("Login error:", error)
        // Return the error response if available, otherwise return null
        if (error.response) {
            return error.response
        }
        return null
    }   
}
export { signUp , logIn}
