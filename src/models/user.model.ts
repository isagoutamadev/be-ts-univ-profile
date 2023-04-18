import { Student } from "./student.model"

export interface User {
    id?: string,
    email?: string,
    username?: string,
    password?: string,
    deleted_by?: string,
    student?: Student,
}

export interface CreateUser {
    email?: string,
    username?: string,
    password?: string,
    role?: string,
    name?: string,
    nim?: string,
    created_by?: string
}

export interface SearchUser {
    id?: string,
    email?: string,
    username?: string,
    name?: string,
}