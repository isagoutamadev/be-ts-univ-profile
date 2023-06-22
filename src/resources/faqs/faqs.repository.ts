import { Faqs } from "@/models/faqs.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class FaqsRepository {
    async get(search: Faqs, page: number, limit: number): Promise<Paging<Faqs>> {
        try {
            const select = [
                "faq.id",
                "faq.question",
                "faq.answer",
            ];

            const query = knex("m_faqs as faq").select(select);
            
            query.whereNull("faq.deleted_at");

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<Faqs>(
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
    
    async find(search: Faqs): Promise<Faqs|undefined> {
        try {
            const select = [
                "faq.id",
                "faq.question",
                "faq.answer",
            ];

            const query = knex("m_faqs as faq").select(select);

            if (search.id) {
                query.where("faq.id", search.id);
            }

            query.whereNull("faq.deleted_at");

            return await query.first();
        } catch (error) {
            throw error;
        }
    }
    
    async create(data: Faqs): Promise<void> {
        try {
            await knex("m_faqs").insert({
                ...data,
                created_at: knex.raw("now()"),
            });
        } catch (error) {
            throw error;
        }
    }
    
    async update(data: Faqs): Promise<void> {
        try {
            await knex("m_faqs").update({
                ...data,
                updated_at: knex.raw("now()"),
            }).where("id", data.id);
        } catch (error) {
            throw error;
        }
    }
    
    async delete(data: Faqs): Promise<void> {
        try {
            await knex("m_faqs").update({
                ...data,
                deleted_at: knex.raw("now()"),
            }).where("id", data.id);
        } catch (error) {
            throw error;
        }
    }
}