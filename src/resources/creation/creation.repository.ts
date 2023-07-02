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
            const select: any = [
                "creation.id",
                "creation.title",
                "creation.cover",
                "creation.to_url",
                "creation.description",
                knex.raw(`JSON_OBJECT(
                    'id', student.id,
                    'name', student.name,
                    'nim', student.nim
                ) as student`),
            ];

            console.log(process.env.IS_FEBY_LAPTOP);

            if (process.env.IS_FEBY_LAPTOP) {
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', GROUP_CONCAT(tag.id)) as tag_ids`));
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', GROUP_CONCAT(tag.name)) as tag_names`));
            } else {
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', JSON_ARRAYAGG(JSON_OBJECT(
                    'id', tag.id,
                    'name', tag.name
                ))) as tags`));
            }

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

            if (search.student_id) {
                query.where("student.id", search.student_id);
            }

            query.groupBy("creation.id");

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);

            const mappedData = datas.map(item => DataHelper.objectParse(item));
            mappedData.map((item: any) => {
                item.tags = [];
                if (item.tag_ids && item.tag_names) {
                    item.tag_ids = item.tag_ids.split(',');
                    item.tag_names = item.tag_names.split(',');
                    for (let i = 0; i < item.tag_ids.length; i++) {
                        const id = item.tag_ids[i];
                        item.tags[i] = {
                            id: id,
                            name: item.tag_names[i]
                        }
                    }
                }
            });
            const pagination = new Pagination<Creation>(
                mappedData,
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
            const select: any = [
                "creation.id",
                "creation.title",
                "creation.cover",
                "creation.to_url",
                "creation.description",
                knex.raw(`JSON_OBJECT(
                    'id', student.id,
                    'name', student.name,
                    'nim', student.nim
                ) as student`),
            ];

            if (process.env.IS_FEBY_LAPTOP) {
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', GROUP_CONCAT(tag.id)) as tag_ids`));
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', GROUP_CONCAT(tag.name)) as tag_names`));
                
                select.push(knex.raw(`IF(COUNT(content.id) = 0, '[]', GROUP_CONCAT(content.id)) as content_ids`));
                select.push(knex.raw(`IF(COUNT(content.id) = 0, '[]', GROUP_CONCAT(
                    CONCAT(IF(content.filename IS NULL, '0', content.filename), '|', CONCAT(IF(content.embed_code IS NULL, '0', content.embed_code))
                    ))) as content_contents`));
            } else {
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', JSON_ARRAYAGG(JSON_OBJECT(
                    'id', tag.id,
                    'name', tag.name
                ))) as tags`));

                select.push(knex.raw(`JSON_ARRAYAGG(JSON_OBJECT(
                    'id', content.id,
                    'filename', content.filename,
                    'embed_code', content.embed_code
                 )) as contents`));
            }

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

            let result = await query.first();

            if (result) {
                result = DataHelper.objectParse(result);
                
                result.tags = [];
                if (result.tag_ids && result.tag_names) {
                    result.tag_ids = result.tag_ids.split(',');
                    result.tag_names = result.tag_names.split(',');
                    for (let i = 0; i < result.tag_ids.length; i++) {
                        const id = result.tag_ids[i];
                        result.tags[i] = {
                            id: id,
                            name: result.tag_names[i]
                        }
                    }
                }

                
                if (result.content_contents && result.content_ids) {
                    result.contents = [];
                    
                    result.content_ids = result.content_ids.split(',');
                    result.content_contents = result.content_contents.split(',');
                    for (let i = 0; i < result.content_contents.length; i++) {
                        const id = result.tag_ids[i];
                        const [filename, embed_code] = result.content_contents[i].split("|");

                        result.contents[i] = {
                            id: id,
                            filename: filename === '0' ? null : filename,
                            embed_code: embed_code === '0' ? null : embed_code,
                        }
                    }
                }

                return result;
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
                    to_url: data.to_url,
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