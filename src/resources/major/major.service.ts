import { Major } from "@/models/major.model";
import { Paging } from "@/utils/responses/pagination.response";
import { MajorRepository } from "./major.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { v4 as uuid } from "uuid";
import { User } from "@/models/user.model";

export class MajorService {
    private repository = new MajorRepository();
    public get = async (search: Major, page: number, limit: number): Promise<Paging<Major>> => {
        try {            
           const result = await this.repository.get(search, page, limit);

           return result;
        } catch (error) {
            throw error;
        }
    }
    
    public find = async (search: Major): Promise<Major> => {
        try {            
           const result = await this.repository.find(search);

           return result;
        } catch (error) {
            throw error;
        }
    }

    public create = async (data: Major, auth: User): Promise<Major> => {
        try {
            data.id = uuid();
            data.created_by = auth.id;        
            await this.repository.create(data);

            return data;
        } catch (error: any) {
            if (String(error.message).includes("m_majors.m_majors_name_unique")) {
                throw new HttpException("Nama jurusan sudah digunakan");
            }
            throw error;
        }
    }
    
    public update = async (data: Major, auth: User): Promise<Major> => {
        try {
            data.updated_by = auth.id;        
            await this.repository.update(data);

            return data;
        } catch (error: any) {
            if (String(error.message).includes("m_majors.m_majors_name_unique")) {
                throw new HttpException("Nama jurusan sudah digunakan");
            }
            throw error;
        }
    }
    
    public delete = async (data: Major, auth: User): Promise<Major> => {
        try {
            data.deleted_by = auth.id;        
            await this.repository.delete(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
}