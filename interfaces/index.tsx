export interface SignupForm {
    name: string;
    email: string;
    password: string;
}

export interface LoginForm {
    email: string;
    password: string;
    rememberMe: boolean;
}


export interface resizeData{
    imageLink : string;
    imageFormat : string;
    manageAspectRatio : boolean;
    size:string;
    width : string;
    height : string;
    outputFormat : string ;
    userId : string
}