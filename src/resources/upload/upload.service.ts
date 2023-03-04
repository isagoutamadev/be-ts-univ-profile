import { Upload } from "@/models/upload.model";
import { Paging } from "@/utils/responses/pagination.response";
import { UploadRepository } from "./upload.repository";
import HttpException from "@/utils/exceptions/http.exception";
import { ResponseCode } from "@/utils/responses/global.response";

export class UploadService {
    private repository = new UploadRepository();

    public create = async (data: Upload): Promise<Upload> => {
        try {
            await this.repository.create(data);
            return data;
        } catch (error) {
            console.error(error);
            return data;
        }
    };
}
