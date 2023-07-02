import DataHelper from "@/helpers/data.helper";
import { SearchStudent, Student, UpdateStudent } from "@/models/student.model";
import knex from "@/utils/knex/knex";
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class StudentsRepository {
    async get(
        search: SearchStudent,
        page: number,
        limit: number
    ): Promise<Paging<Student>> {
        try {
            const select = [
                "student.id",
                "student.nim",
                "student.name",
                "student.avatar",
                "student.bio",
                "student.registered_at",
                "student.graduated_at",
                "student.website_screenshot",
                "student.website_url",
                knex.raw(`JSON_OBJECT(
                    'id', user.id,
                    'username', user.username,
                    'email', user.email
                ) as user`),
            ];

            const query = knex("m_students as student").select(select);
            query.innerJoin("m_users as user", function () {
                this.on("user.id", "student.user_id");
                this.onNull("user.deleted_at");
            });

            query.whereNull("student.deleted_at");

            if (search.is_graduated === 'true') {
                query.whereNotNull("student.graduated_at");
            } else if (search.is_graduated === 'false') {
                query.whereNull("student.graduated_at");
            }

            if (search.is_portofolio_set === 'true') {
                query.whereNotNull("student.website_screenshot");
                query.whereNotNull("student.website_url");
            }

            const offset = limit * page - limit;
            const queryCount = knex()
                .count("id as total")
                .from(knex.raw(`(${query.toQuery()}) x`))
                .first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount,
            ]);
            const pagination = new Pagination<Student>(
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

    async find(search: Student): Promise<Student | undefined> {
        try {
            const select = [
                "student.id",
                "student.major_id",
                "student.nim",
                "student.name",
                "student.bio",
                "student.avatar",
                "student.registered_at",
                "student.graduated_at",
                "student.website_screenshot",
                "student.website_url",
                knex.raw(`JSON_OBJECT(
                    'id', user.id,
                    'username', user.username,
                    'email', user.email
                ) as user`),
                knex.raw(`JSON_OBJECT(
                    'id', major.id,
                    'name', major.name
                ) as major`),
            ];

            if (process.env.IS_FEBY_LAPTOP) {
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', GROUP_CONCAT(tag.id)) as tag_ids`));
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', GROUP_CONCAT(tag.name)) as tag_names`));
            } else {
                select.push(knex.raw(`IF(COUNT(tag.id) = 0, '[]', JSON_ARRAYAGG(JSON_OBJECT(
                    'id', tag.id,
                    'name', tag.name
                ))) as interest_tags`));
            }

            const query = knex("m_students as student").select(select);
            query.innerJoin("m_users as user", function () {
                this.on("user.id", "student.user_id");
                this.onNull("user.deleted_at");
            });

            query.leftJoin("m_majors as major", function () {
                this.on("major.id", "student.major_id");
                this.onNull("major.deleted_at");
            });

            query.leftJoin("map_student_interest_tags as msit", function () {
                this.on("msit.student_id", "student.id");
            });

            query.leftJoin("m_tags as tag", function () {
                this.on("tag.id", "msit.tag_id");
                this.onNull("tag.deleted_at");
            });

            query.whereNull("student.deleted_at");

            if (search.id) {
                query.where("student.id", search.id);
            }

            query.groupBy("student.id");
            let result = await query.first();

            if (result) {
                //@ts-ignore
                // console.log(query.toQuery());
                // return query.toQuery();
                
                if (result.tag_ids && result.tag_names) {
                    result.interest_tags = [];

                    result.tag_ids = result.tag_ids.split(',');
                    result.tag_names = result.tag_names.split(',');
                    for (let i = 0; i < result.tag_ids.length; i++) {
                        const id = result.tag_ids[i];
                        result.interest_tags[i] = {
                            id: id,
                            name: result.tag_names[i]
                        }
                    }

                    delete result.tag_ids;
                    delete result.tag_ids;
                    

                }
                
                result = DataHelper.objectParse(result);

                return result;
            }

            return undefined;
        } catch (error) {
            throw error;
        }
    }

    async update(data: UpdateStudent): Promise<void> {
        try {
            await knex.transaction(async (trx) => {
                await trx("map_student_interest_tags")
                    .delete()
                    .where("student_id", data.id);

                await trx("map_student_interest_tags").insert(
                    data.interest_tag_ids?.map((tagId) => {
                        return {
                            tag_id: tagId,
                            student_id: data.id,
                        };
                    })
                );

                delete data.interest_tag_ids;

                await trx("m_students")
                    .update({
                        ...data,
                        updated_at: knex.raw("now()"),
                    })
                    .where("id", data.id);
            });
        } catch (error) {
            throw error;
        }
    }
    
    async delete(data: UpdateStudent): Promise<void> {
        try {
            await knex.transaction(async (trx) => {
                await trx("m_students")
                    .update({
                        deleted_at: trx.raw("now()"),
                        deleted_by: data.updated_by
                    })
                    .where("id", data.id);
                const student = await trx("m_students").select("user_id").where("id", data.id).first();

                await trx("m_users").update({
                    deleted_at: trx.raw("now()"),
                    deleted_by: data.updated_by
                }).where("id", student.user_id);
            });
        } catch (error) {
            throw error;
        }
    }
}
