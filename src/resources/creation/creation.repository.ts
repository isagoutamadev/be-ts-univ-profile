import DataHelper from "@/helpers/data.helper";
import { CreateCreation, Creation } from "@/models/creation.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";
import { v4 as uuid } from "uuid";

export class CreationRepository {
    async getTypes(search: Creation, page: number, limit: number): Promise<Paging<Creation>> {
        try {
            const select = [
                "type.id",
                "type.name",
                "type.guide_url",
            ];

            const query = knex("lt_creation_content_types as type").select(select);

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<Creation>(
                datas.map(item => DataHelper.objectParse(item)),
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
    
    async get(search: Creation, page: number, limit: number): Promise<Paging<Creation>> {
        try {
            const select = [
                "creation.id",
                "creation.title",
                "creation.cover",
                "creation.description",
                knex.raw(`IF(COUNT(tag.id) = 0, '[]', JSON_ARRAYAGG(JSON_OBJECT(
                    'id', tag.id,
                    'name', tag.name
                ))) as tags`),
            ];

            const query = knex("m_creations as creation").select(select);

            query.innerJoin("m_students as student", function () {
                this.on("student.id", "creation.student_id");
                this.onNull("student.deleted_at");
            });
            
            query.leftJoin("map_creation_tags as mct", function () {
                this.on("mct.creation_id", "creation.id");
            });
            
            query.leftJoin("m_tags as tag", function () {
                this.on("tag.id", "mct.tag_id");
                this.onNull("tag.deleted_at");
            });

            query.groupBy("creation.id");

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<Creation>(
                datas.map(item => DataHelper.objectParse(item)),
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
    
    async find(search: Creation): Promise<Creation|undefined> {
        try {
            const select = [
                "creation.id",
                "creation.title",
                "creation.cover",
                "creation.description",
                knex.raw(`IF(COUNT(tag.id) = 0, '[]', JSON_ARRAYAGG(JSON_OBJECT(
                    'id', tag.id,
                    'name', tag.name
                ))) as tags`),
                knex.raw(`JSON_ARRAYAGG(JSON_OBJECT(
                    'id', content.id,
                    'filename', content.filename,
                    'embed_code', content.embed_code
                )) as contents`),
            ];

            const query = knex("m_creations as creation").select(select);

            query.innerJoin("m_students as student", function () {
                this.on("student.id", "creation.student_id");
                this.onNull("student.deleted_at");
            });
            
            query.leftJoin("map_creation_tags as mct", function () {
                this.on("mct.creation_id", "creation.id");
            });
            
            query.leftJoin("m_tags as tag", function () {
                this.on("tag.id", "mct.tag_id");
                this.onNull("tag.deleted_at");
            });
            
            query.leftJoin("m_creation_contents as content", function () {
                this.on("content.creation_id", "creation.id");
                this.onNull("tag.deleted_at");
            });

            if (search.id) {
                query.where("creation.id", search.id);
            }

            query.groupBy("creation.id");

            const result = await query.first();

            if (result) {
                return DataHelper.objectParse(result);
            }
        } catch (error) {
            throw error;
        }
    }
    
    async create(data: CreateCreation): Promise<void> {
        try {
            await knex.transaction(async trx => {
                await trx("m_creations").insert({
                    id: data.id,
                    title: data.title,
                    cover: data.cover,
                    description: data.description,
                    created_by: data.created_by,
                    student_id: data.student_id,
                    created_at: knex.raw("now()")
                });

                await trx("m_creation_contents").insert(data.contents?.map(content => {
                    return {
                        ...content,
                        id: uuid(),
                        creation_id: data.id,
                        created_by: data.created_by,
                        created_at: knex.raw("now()"),
                    }
                }));
                
                await trx("map_creation_tags").insert(data.tag_ids?.map(id => {
                    return {
                        creation_id: data.id,
                        tag_id: id,
                    }
                }));
            });
;        } catch (error) {
            throw error;
        }
    }
}