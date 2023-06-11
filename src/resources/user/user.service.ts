import { CreateUser, SearchUser, User } from "@/models/user.model";
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
    
    public create = async (data: CreateUser, auth?: User): Promise<CreateUser> => {
        try {
            const getUserByEmail = await this.repository.get({email: data.email}, 1, 1);
            if (getUserByEmail.datas.length > 0) {
                throw new HttpException("Email telah digunakan", ResponseCode.CONFLICT);
            }
            
            const getUserByUsername = await this.repository.get({username: data.username}, 1, 1);
            if (getUserByUsername.datas.length > 0) {
                throw new HttpException("Username telah digunakan", ResponseCode.CONFLICT);
            }

            const userId = uuid();
            const userCreate = {
                id: userId,
                username: data.username,
                email: data.email,
                password: AuthHelper.encrypt(String(data.password)),
                role: data.role,
                created_by: auth?.id || userId
            };

            const studentId = uuid();
            const student = {
                id: studentId,
                nim: data.nim,
                name: data.name,
                user_id: userCreate.id,
                created_by: auth?.id || userId
            };

            await this.repository.create(userCreate, student);

            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public update = async (user: User): Promise<User> => {
        try {
              
            user.password = AuthHelper.encrypt(String(user.password));
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