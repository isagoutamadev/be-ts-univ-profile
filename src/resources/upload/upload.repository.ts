import { Upload } from "@/models/upload.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class UploadRepository {
    async get(search: Upload, page: number, limit: number): Promise<Paging<Upload>> {
        try {
            const select = [
                "id",
            ];

            const query = knex("").select(select);

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`${query.toQuery()} x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<Upload>(
                datas,
                //@ts-ignore
                count.total,
                page,
                limit
            );

            return pagination.getPaging();
        } catch (error) {
            throw error;
        }
    }

    async create(data: Upload): Promise<void> {
        try {
            await knex('m_uploads').insert({
                ...data,
                created_at: knex.raw("now()"),
            });
        } catch (error) {
            throw error;
        }
    }
}