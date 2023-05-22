import { Faqs } from "@/models/faqs.model";
import { Paging } from "@/utils/responses/pagination.response";
import { FaqsRepository } from "./faqs.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { v4 as uuid } from "uuid";
import { User } from "@/models/user.model";

export class FaqsService {
    private repository = new FaqsRepository();
    public get = async (search: Faqs, page: number, limit: number): Promise<Paging<Faqs>> => {
        try {            
            const result = await this.repository.get(search, page, limit);

            return result;
        } catch (error) {
            throw error;
        }
    }
    
    public find = async (search: Faqs): Promise<Faqs> => {
        try {            
            const result = await this.repository.find(search);

            if (result) {
                return result;
            }

            throw new HttpException("FAQ not found");
        } catch (error) {
            throw error;
        }
    }
    
    public create = async (data: Faqs, auth: User): Promise<Faqs> => {
        try {           
            data.id = uuid(); 
            data.created_by = auth.id;

            await this.repository.create(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public update = async (data: Faqs, auth: User): Promise<Faqs> => {
        try {           
            data.updated_by = auth.id;

            await this.repository.update(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public delete = async (data: Faqs, auth: User): Promise<Faqs> => {
        try {           
            data.deleted_by = auth.id;

            await this.repository.delete(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
}