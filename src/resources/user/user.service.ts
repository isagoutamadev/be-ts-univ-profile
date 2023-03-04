import { SearchUser, User } from "@/models/user.model";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { UserRepository } from "./user.repository";
import { Paging } from "@/utils/responses/pagination.response";
import { Employee } from "@/models/employee.model";
import { v4 as uuid } from "uuid";
import { AuthRepository } from "../auth/auth.repository";
import AuthHelper from "@/helpers/auth.helper";

export class UserService {
    private repository = new UserRepository();
    public getUsers = async (search: SearchUser, page: number, limit: number, auth: User): Promise<Paging<User>> => {
        try {    
            if (auth.role?.id == "00001") {
                
            } else if (auth.role?.id == "00002") {
                search.company_id = auth.company?.id;
            } else if (auth.role?.id == "00003") {
                search.branch_company_id = auth.branch_company?.id;
            } else {
                search.id = auth.id;
            }

            const data = await this.repository.get(search, page, limit);

            return data;
        } catch (error) {
            throw error;
        }
    }

    public getDetail = async (userId: string): Promise<User> => {
        try {            
            const data = await this.repository.findById(userId);

            if (!data) {
                throw new HttpException("User tidak ditemukan", ResponseCode.NOT_FOUND);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public find = async (search: SearchUser, auth: User): Promise<User> => {
        try {       
            if (auth.role?.id == "00001") {
                
            } else if (auth.role?.id == "00002") {
                search.company_id = auth.company?.id;
            } else if (auth.role?.id == "00003") {
                search.branch_company_id = auth.branch_company?.id;
            } else {
                search.id = auth.id;
            }
                 
            const data = await this.repository.find(search);

            if (!data) {
                throw new HttpException("User tidak ditemukan", ResponseCode.NOT_FOUND);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public create = async (user: User, employee: Employee): Promise<User> => {
        try {
            const getUserByEmail = await this.repository.get({email: user.email}, 1, 1);
            if (getUserByEmail.datas.length > 0) {
                throw new HttpException("Email telah digunakan", ResponseCode.CONFLICT);
            }

            const dataEmployee: Employee = {
                id: uuid(),
                ...employee
            };           
            const dataUser: User = {
                id: uuid(),
                ...user,
                password: AuthHelper.encrypt(user.password),
                employee_id: dataEmployee.id
            };

            await this.repository.create(dataUser, dataEmployee);

            delete dataUser.password;
            
            return {
                ...dataUser,
                employee: dataEmployee
            };
        } catch (error) {
            throw error;
        }
    }
    
    public update = async (user: User, employee: Employee): Promise<User> => {
        try {
            const userDetail = await this.repository.find({id: user.id});
            if (!userDetail) {
                throw new HttpException("User tidak ditemukan", ResponseCode.UNPROCESSABLE_ENTITY);
            }

            const dataEmployee: Employee = {
                ...employee
            };           
            const dataUser: User = {
                ...user,
                employee_id: userDetail.employee_id
            };

            await this.repository.update(dataUser, dataEmployee);
            
            return {
                ...dataUser,
                employee: dataEmployee
            };
        } catch (error) {
            throw error;
        }
    }
}