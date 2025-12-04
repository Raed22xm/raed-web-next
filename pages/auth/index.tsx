"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import NorthEastOutlinedIcon from "@mui/icons-material/NorthEastOutlined";
import { SignupForm, LoginForm } from "@/interfaces";
import { logIn, signUp } from "@/services/auth/auth";
import { useRouter } from "next/navigation";

const tabStyles = {
    container: "bg-slate-100 rounded-full p-1 flex mb-8",
    button: "flex-1 text-sm sm:text-base font-semibold py-3 rounded-full transition-colors duration-200",
    active: "bg-white text-slate-900 shadow",
    inactive: "text-slate-500 hover:text-slate-900",
};

const inputClasses =
    "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/60";

function Auth() {
    const [mode, setMode] = useState<"login" | "signup">("login");
    const router = useRouter();
    const [signupForm, setSignupForm] = useState<SignupForm>({
        name: "",
        email: "",
        password: "",
    });
    const [loginForm, setLoginForm] = useState<LoginForm>({
        email: "",
        password: "",
        rememberMe: false,
    });

    const isLogin = mode === "login";

    const updateSignupForm = <K extends keyof SignupForm>(key: K, value: SignupForm[K]) => {
        setSignupForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const updateLoginForm = <K extends keyof LoginForm>(key: K, value: LoginForm[K]) => {
        setLoginForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload = isLogin ? loginForm : signupForm;

        console.info(`[Auth] ${isLogin ? "Login" : "Signup"} attempt`, payload);
        // problem is ts
        // ts is strict about the types any small issue and it will throw an error

        if (isLogin) {
            const response = await logIn(payload as LoginForm);
            if (response) {
                alert("Logged in successfully");
                const userData = response.data;
                const accessToken =
                    userData?.accessToken ||
                    userData?.token ||
                    userData?.data?.accessToken ||
                    userData?.data?.token;
                const normalizedUserData = accessToken
                    ? { ...userData, accessToken }
                    : userData;
                localStorage.setItem("userData", JSON.stringify(normalizedUserData));
                router.push("/");
            } else {
                alert("Error in logging in");
            }
        } else {
            const response = await signUp(payload as SignupForm);
            if (response === 200 || response === 201) {
                setSignupForm({
                    name: "",
                    email: "",
                    password: "",
                });

                setMode("login");

                alert("Account created successfully");
            } else {
                alert("Error in creating account");
            }
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-100 via-white to-blue-50">
            <div className="max-w-5xl mx-auto px-6 py-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200"
                >
                    <span className="text-lg">←</span>
                    Back to Home
                </Link>

                <div className="mt-12 bg-white/80 backdrop-blur rounded-3xl shadow-2xl max-w-lg mx-auto p-10">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg mb-4">
                            <NorthEastOutlinedIcon className="text-white" fontSize="large" />
                        </div>
                        <h1 className="text-2xl font-semibold text-slate-900">ResizeHub</h1>
                    </div>

                    <div className={tabStyles.container}>
                        <button
                            type="button"
                            className={`${tabStyles.button} ${isLogin ? tabStyles.active : tabStyles.inactive}`}
                            onClick={() => setMode("login")}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            className={`${tabStyles.button} ${!isLogin ? tabStyles.active : tabStyles.inactive}`}
                            onClick={() => setMode("signup")}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            {isLogin ? "Log in to your account to continue rescaling images." : "Sign up to start rescaling images instantly."}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <label className="block text-left">
                                    <span className="text-sm font-medium text-slate-700">Full Name</span>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className={inputClasses}
                                        value={signupForm.name}
                                        onChange={(e) => {
                                            updateSignupForm("name", e.target.value);
                                        }}
                                    />
                                </label>
                            )}

                            <label className="block text-left">
                                <span className="text-sm font-medium text-slate-700">Email</span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className={inputClasses}
                                    onChange={(e) => {
                                        if (isLogin) {
                                            updateLoginForm("email", e.target.value);
                                        } else {
                                            updateSignupForm("email", e.target.value);
                                        }
                                    }}
                                    value={isLogin ? loginForm.email : signupForm.email}
                                />
                            </label>

                            <label className="block text-left">
                                <span className="text-sm font-medium text-slate-700">Password</span>
                                <input
                                    type="password"
                                    className={inputClasses}
                                    placeholder="Enter your password"
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    onChange={(e) => {
                                        if (isLogin) {
                                            updateLoginForm("password", e.target.value);
                                        } else {
                                            updateSignupForm("password", e.target.value);
                                        }
                                    }}
                                    value={isLogin ? loginForm.password : signupForm.password}
                                />
                            </label>

                            {isLogin ? (
                                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                                    <label className="inline-flex items-center gap-2 text-slate-600">
                                        <input
                                            onChange={(e) => {
                                                updateLoginForm("rememberMe", e.target.checked);
                                            }}
                                            type="checkbox"
                                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                            checked={loginForm.rememberMe}
                                        />
                                        Remember me
                                    </label>
                                    <Link href="/auth/forgot" className="font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot password?
                                    </Link>
                                </div>
                            ) : (
                                <label className="flex items-start gap-3 text-sm text-slate-600">
                                    <input type="checkbox" className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span>
                                        I agree to the{" "}
                                        <Link href="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            Terms of Service
                                        </Link>{" "}
                                        and{" "}
                                        <Link href="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                                            Privacy Policy
                                        </Link>
                                        .
                                    </span>
                                </label>
                            )}

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-slate-800"
                            >
                                {isLogin ? "Log In" : "Create Account"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-xs text-slate-500">
                            Demo mode: Use any credentials to {isLogin ? "log in" : "create an account"}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Auth;
