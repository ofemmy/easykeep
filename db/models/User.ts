export interface User {
    _id?:string | number;
    email:string | String;
    name:string|String;
    password?:String | null;
}