export interface User {
    id?: number,
    uuid?: number,
    email?: string,
    username?: string,
    password?: string,
    deleted_by?: string,
}

export interface SearchUser {
    uuid?: string,
    email?: string,
    username?: string,
    name?: string,
}