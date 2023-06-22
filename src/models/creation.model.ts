import { string } from "joi";
import { CreationContent } from "./creation-content.model";

export interface Creation {
    id?: string,
    title?: string,
    cover?: string,
    to_url?: string,
    description?: string,
    student_id?: string,
    created_by?: string,
    updated_by?: string,
    deleted_by?: string,
}

export interface CreateCreation {
    id?: string,
    student_id?: string,
    title?: string,
    cover?: string,
    to_url?: string,
    description?: string,
    tag_ids?: string[],
    contents?: CreationContent[],
    created_by?: string,
    updated_by?: string,
    deleted_by?: string,
}