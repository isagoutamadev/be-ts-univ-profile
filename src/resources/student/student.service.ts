import { Student, UpdateStudent } from "@/models/student.model";
import { Paging } from "@/utils/responses/pagination.response";
import { StudentsRepository } from "./student.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";
import { User } from "@/models/user.model";

export class StudentsService {
    private repository = new StudentsRepository();
    public get = async (search: Student, page: number, limit: number): Promise<Paging<Student>> => {
        try {            
            const result = await this.repository.get(search, page, limit);
            
            return result;
        } catch (error) {
            throw error;
        }
    }
    
    public find = async (search: Student): Promise<Student> => {
        try {            
            const result = await this.repository.find(search);
            
            if (result) {
                return result;
            }

            throw new HttpException("Data siswa tidak ditemukan", ResponseCode.NOT_FOUND);
        } catch (error) {
            throw error;
        }
    }
    
    public update = async (data: UpdateStudent, auth: User): Promise<Student> => {
        try {
            data.updated_by = auth.id;

            await this.repository.update(data);

            return data;
        } catch (error) {
            throw error;
        }
    }
}