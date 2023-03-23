import { Tag } from "@/models/tag.model";
import { Paging } from "@/utils/responses/pagination.response";
import { TagRepository } from "./tag.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";

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
    
    public create = async (data: Tag): Promise<Tag> => {
        try {            
            await this.repository.create(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
}