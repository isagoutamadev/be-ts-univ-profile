export interface User {
    id?: string,
    email?: string,
    username?: string,
    password?: string,
    deleted_by?: string,
}

export interface SearchUser {
    id?: string,
    email?: string,
    username?: string,
    name?: string,
}