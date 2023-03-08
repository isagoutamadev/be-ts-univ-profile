import DataHelper from "@/helpers/data.helper";
import { Student } from "@/models/student.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class StudentsRepository {
    async get(search: Student, page: number, limit: number): Promise<Paging<Student>> {
        try {
            const select = [
                "student.id",
                "student.nim",
                "student.name",
                "student.avatar",
                "student.registered_at",
                "student.graduated_at",
            ];

            const query = knex("m_students as student").select(select);
            query.innerJoin("m_users as user", function () {
                this.on("user.id", "student.user_id");
                this.onNull("user.deleted_at");
            });

            query.whereNull("student.deleted_at");

            const offset = limit * page - limit;
            const queryCount = knex().count("id as total").from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<Student>(
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
    
    async find(search: Student): Promise<Student|undefined> {
        try {
            const select = [
                "student.id",
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
            ];

            const query = knex("m_students as student").select(select);
            query.innerJoin("m_users as user", function () {
                this.on("user.id", "student.user_id");
                this.onNull("user.deleted_at");
            });
            
            query.whereNull("student.deleted_at");

            if (search.id) {
                query.where("student.id", search.id);
            }

            const result = await query.first();

            if (result) {
                return DataHelper.objectParse(result);
            }

            return undefined;
        } catch (error) {
            throw error;
        }
    }
}