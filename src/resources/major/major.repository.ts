import { Major } from "@/models/major.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class MajorRepository {
    async get(search: Major, page: number, limit: number): Promise<Paging<Major>> {
        try {
            const select = [
                "major.id",
                "major.name",
            ];

            const query = knex("m_majors as major").select(select);

            query.whereNull("major.deleted_at");

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination(
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

    async find(search: Major): Promise<Major> {
        try {
            const select = [
                "major.id",
                "major.name",
            ];

            const query = knex("m_majors as major").select(select);

            query.whereNull("major.deleted_at");

            if (search.id) {
                query.where("major.id", search.id);
            }

            return await query.first();
        } catch (error) {
            throw error;
        }
    }

    async create(data: Major): Promise<void> {
        try {
            await knex("m_majors").insert({
                ...data,
                created_at: knex.raw("now()"),
            });
        } catch (error) {
            throw error;
        }
    }
    
    async update(data: Major): Promise<void> {
        try {
            await knex("m_majors").update({
                ...data,
                updated_at: knex.raw("now()"),
            }).where("id", data.id);
        } catch (error) {
            throw error;
        }
    }
    
    async delete(data: Major): Promise<void> {
        try {
            await knex("m_majors").update({
                ...data,
                deleted_at: knex.raw("now()"),
            }).where("id", data.id);
        } catch (error) {
            throw error;
        }
    }
}