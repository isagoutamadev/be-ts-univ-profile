import { BranchCompany } from "./branch-company.model";
import { Company } from "./company.model";
import { Employee } from "./employee.model";
import { Role } from "./role.model";

export interface User {
    id?: string,
    email?: string,
    username?: string,
    role_id?: number,
    role?: Role,
    employee_id?: string,
    employee?: Employee,
    branch_company?: BranchCompany,
    company?: Company,
    device_id?: string,
    fcm_token?: string,
    is_banned?: number,
    is_active?: number,
    password?: string,
    deleted_by?: string,
}

export interface SearchUser {
    id?: string,
    email?: string,
    username?: string,
    name?: string,
    role_id?: number,
    employee_id?: string,
    branch_company_id?: string,
    company_id?: string,
}