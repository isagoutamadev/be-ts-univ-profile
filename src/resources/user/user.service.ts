import { SearchUser, User } from "@/models/user.model";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { UserRepository } from "./user.repository";
import { Paging } from "@/utils/responses/pagination.response";
import { v4 as uuid } from "uuid";
import { AuthRepository } from "../auth/auth.repository";
import AuthHelper from "@/helpers/auth.helper";

export class UserService {
    private repository = new UserRepository();
    public getUsers = async (search: SearchUser, page: number, limit: number, auth: User): Promise<Paging<User>> => {
        try {    

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
            const data = await this.repository.find(search);

            if (!data) {
                throw new HttpException("User tidak ditemukan", ResponseCode.NOT_FOUND);
            }

            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public create = async (user: User): Promise<User> => {
        try {
            const getUserByEmail = await this.repository.get({email: user.email}, 1, 1);
            if (getUserByEmail.datas.length > 0) {
                throw new HttpException("Email telah digunakan", ResponseCode.CONFLICT);
            }

            await this.repository.create(user);

            return user;
        } catch (error) {
            throw error;
        }
    }
    
    public update = async (user: User): Promise<User> => {
        try {              
            const dataUser: User = {
                ...user,
            };

            await this.repository.update(dataUser);
            
            return {
                ...dataUser
            };
        } catch (error) {
            throw error;
        }
    }
}