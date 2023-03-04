import { Login } from "@/models/auth.model";
import { User } from "@/models/user.model";
import AuthHelper from "@/helpers/auth.helper";
import { JWT } from "@/models/auth.model";
import { AuthRepository } from "./auth.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";

export class AuthService {
    private repository = new AuthRepository();
    public login = async (login: Login): Promise<JWT> => {
        try {            
            const data = await this.repository.findByEmailOrUsername(login.username_or_email || "");

            if (!data) {
                throw new HttpException("Email atau password salah", ResponseCode.UNPROCESSABLE_ENTITY);
            }

            if (!AuthHelper.compare(login.password, data.password || "")) {
                throw new HttpException("Email atau password salah", ResponseCode.UNPROCESSABLE_ENTITY);
            }

            delete data.password;

            return {
                token: AuthHelper.jwtEncode({id: data.id}),
                user: data
            }  

        } catch (error) {
            throw error;
        }
    }

    public getDetail = async (userId: string): Promise<User> => {
        try {            
            throw new HttpException("User tidak ditemukan", ResponseCode.UNPROCESSABLE_ENTITY);
            // const data = await this.repository.findById(userId);

            // if (!data) {
            // }

            // return data;
        } catch (error) {
            throw error;
        }
    }
    
    public updateById = async (user: User): Promise<void> => {
        try {            
            await this.repository.updateById(user);
        } catch (error) {
            throw error;
        }
    }
}