import { User } from "./user.model";

export interface Student {
    id?: string,
    name?: string,
    bio?: string,
    nim?: string,
    avatar?: string,
    registered_at?: string,
    graduated_at?: string,
    user?: User,
}

export interface UpdateStudent {
    id?: string,
    name?: string,
    bio?: string,
    nim?: string,
    avatar?: string,
    registered_at?: string,
    graduated_at?: string,
    major_id?: string,
    interest_tag_ids?: string[],
    updated_by?: string,
}

