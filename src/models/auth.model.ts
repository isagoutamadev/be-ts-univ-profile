import { User } from "./user.model";

export interface Login {
    username_or_email: string,
    password: string,
}

export interface JWT {
    user: User,
    token: string,
}

