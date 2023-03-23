import { Tag } from "@/models/tag.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class TagRepository {
    async get(search: Tag, page: number, limit: number): Promise<Paging<Tag>> {
        try {
            const select = [
                "tag.id",
                "tag.name",
            ];

            const query = knex("m_tags as tag").select(select);

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<Tag>(
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

    async create(data: Tag): Promise<void> {
        try {
            await knex("m_tags").insert({
                ...data,
                created_at: knex.raw("now()"),
            });
        } catch (error) {
            throw error;
        }
    }
}