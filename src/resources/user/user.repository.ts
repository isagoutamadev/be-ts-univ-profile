import { Student } from "@/models/student.model";
import { SearchUser, User } from "@/models/user.model";
import HttpException from "@/utils/exceptions/http.exception";
import knex from "@/utils/knex/knex"
import { ResponseCode } from "@/utils/responses/global.response";
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class UserRepository {
    async get(search: SearchUser, page: number, limit: number): Promise<Paging<User>> {
        try {
            const select = [
                "user.id",
                "user.email",
                "user.username",
                "user.role",
                "user.facebook",
                "user.twitter",
                "user.instagram",
                "user.linkedin",
                knex.raw(`JSON_OBJECT(
                    'id', student.id,
                    'nim', student.nim,
                    'name', student.name,
                    'avatar', student.avatar
                ) as student`),
            ];

            const query = knex("m_users as user").select(select)
                .innerJoin("m_students as student", function () {
                    this.on("student.user_id", "user.id");
                    this.onNull("student.deleted_at");
                });

            if (search.id) {
                query.where("user.id", search.id);
            }

            if (search.email) {
                query.whereILike("user.email", search.email);
            }
            
            if (search.username) {
                query.whereILike("user.username", search.username);
            }
            

            query.whereNull("user.deleted_at");

            const offset = limit * page - limit;
            const queryCount = knex().count('id as total').from(knex.raw(`(${query.toQuery()}) x`)).first();

            const [datas, count] = await Promise.all([
                await query.limit(limit).offset(offset),
                await queryCount
            ]);
            const pagination = new Pagination<User>(
                datas.map((item) => {
                    return {
                        ...item,
                        student: JSON.parse(item.student),
                    }
                }),
                // @ts-ignore 
                count.total,
                page,
                limit
            );

            return pagination.getPaging();
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string): Promise<User | undefined> {
        try {
            const select = [
                "user.id",
                "user.email",
                "user.username",
                "user.role",
                "user.facebook",
                "user.twitter",
                "user.instagram",
                "user.linkedin",
                knex.raw(`JSON_OBJECT(
                    'id', student.id,
                    'nim', student.nim,
                    'name', student.name,
                    'avatar', student.avatar
                ) as student`),
            ];

            const query = knex("m_users as user").select(select)
                .innerJoin("m_students as student", function () {
                    this.on("student.user_id", "user.id");
                    this.onNull("student.deleted_at");
                });

            query.whereNull("user.deleted_at");
            query.where("user.id", id);

            const user = await query.first();
            if (user) {
                return {
                    ...user,
                    student: JSON.parse(user.student),
                }
            }
            return undefined;
        } catch (error) {
            throw error;
        }
    }
    
    async find(search: SearchUser): Promise<User | undefined> {
        try {
            const select = [
                "user.id",
                "user.email",
                "user.username",
                "user.role",
                knex.raw(`JSON_OBJECT(
                    'id', student.id,
                    'nim', student.nim,
                    'name', student.name,
                    'avatar', student.avatar
                ) as student`),
            ];

            const query = knex("m_users as user").select(select)
                .innerJoin("m_students as student", function () {
                    this.on("student.user_id", "user.id");
                });

            if (search.id) {
                query.where("user.id", search.id);
            }

            const user = await query.first();
            if (user) {
                return {
                    ...user,
                    student: JSON.parse(user.student),
                }
            }
            return undefined;
        } catch (error) {
            throw error;
        }
    }

    async create(user: User, student: Student): Promise<void> {
        try {
            await knex.transaction(async trx => {
                await trx("m_users").insert({
                    ...user,
                    created_at: knex.raw("now()"),
                });

                await trx("m_students").insert({
                    ...student,
                    created_at: knex.raw("now()"),
                });
            });
        } catch (error: any) {
            if (String(error.message).includes("m_students.m_students_nim_unique")) {
                throw new HttpException("Nim telah terdaftar", ResponseCode.CONFLICT);
            }
            throw error;
        }
    }
    
    async update(user: User): Promise<void> {
        try {
            await knex.transaction(async trx => {
                await trx("m_users").update({
                    ...user,
                    updated_at: knex.raw("now()"),
                }).where("id", user.id);
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(user: User): Promise<void> {
        try {
            await knex.transaction(async trx => {
                await trx("m_users").update({
                    deleted_by: user.deleted_by,
                    deleted_at: knex.raw("now()"),
                }).where("id", user.id);

                await trx("m_students").update({
                    deleted_by: user.deleted_by,
                    deleted_at: knex.raw("now()"),
                }).where("user_id", user.id);
            });
        } catch (error) {
            throw error;
        }
    }
}