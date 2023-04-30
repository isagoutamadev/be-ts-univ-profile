import { CreateCreation, Creation } from "@/models/creation.model";
import { Paging } from "@/utils/responses/pagination.response";
import { CreationRepository } from "./creation.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { v4 as uuid } from "uuid";
import { User } from "@/models/user.model";

export class CreationService {
    private repository = new CreationRepository();
    public getTypes = async (search: Creation, page: number, limit: number): Promise<Paging<Creation>> => {
        try {            
            const result = await this.repository.getTypes(search, page, limit);

            return result;
        } catch (error) {
            throw error;
        }
    }
    
    public get = async (search: Creation, page: number, limit: number): Promise<Paging<Creation>> => {
        try {            
            const result = await this.repository.get(search, page, limit);

            return result;
        } catch (error) {
            throw error;
        }
    }
    
    public create = async (data: CreateCreation, auth: User): Promise<Creation> => {
        try {
            data.id = uuid();
            data.student_id = auth.student?.id;
            await this.repository.create({
                ...data,
                created_by: auth.id,
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
}