import { Tag } from "@/models/tag.model";
import { Paging } from "@/utils/responses/pagination.response";
import { TagRepository } from "./tag.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { User } from "@/models/user.model";
import { v4 as uuid } from "uuid";

export class TagService {
    private repository = new TagRepository();
    public get = async (search: Tag, page: number, limit: number): Promise<Paging<Tag>> => {
        try {            
            const result = await this.repository.get(search, page, limit);

            return result
        } catch (error) {
            throw error;
        }
    }
   
    public find = async (search: Tag): Promise<Tag> => {
        try {            
            const result = await this.repository.find(search);

            if (result) {
                return result
            }

            throw new HttpException("Tag not found", ResponseCode.NOT_FOUND);
            
        } catch (error) {
            throw error;
        }
    }
    
    public create = async (data: Tag, auth: User): Promise<Tag> => {
        try {
            data.id = uuid();
            data.created_by = auth.id;        
            await this.repository.create(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
    
    public delete = async (data: Tag, auth: User): Promise<Tag> => {
        try {
            data.deleted_by = auth.id;        
            await this.repository.delete(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
}