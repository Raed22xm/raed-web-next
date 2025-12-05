import { SignupForm, LoginForm } from "@/interfaces";
import axios from "axios";

//  after 10 mins



async function signUp(payload: SignupForm) {
    console.log(payload);
    console.log(process.env.NEXT_PUBLIC_API_URL);
    try {
        const userResponse = await axios.post(
            (process.env.NEXT_PUBLIC_API_URL as string) + "/users/signup",
            payload
        );
        return userResponse.status;
    } catch (error: unknown) {
        console.error("Signup error:", error);
        if (error && typeof error === "object" && "response" in error) {
            const err = error as { response?: { status?: number } };
            return err.response?.status ?? null;
        }
        return null;
    }
}


async function logIn(payload: LoginForm) {
    console.log(payload);
    console.log(process.env.NEXT_PUBLIC_API_URL);
    try {
        const userResponse = await axios.post(
            (process.env.NEXT_PUBLIC_API_URL as string) + "/users/login",
            payload
        );
        return userResponse;
    } catch (error: unknown) {
        console.error("Login error:", error);
        return null;
    }
}
export { signUp, logIn };
