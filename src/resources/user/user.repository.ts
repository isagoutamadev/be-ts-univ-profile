import { SearchUser, User } from "@/models/user.model";
import knex from "@/utils/knex/knex"
import { Pagination, Paging } from "@/utils/responses/pagination.response";

export class UserRepository {
    async get(search: SearchUser, page: number, limit: number): Promise<Paging<User>> {
        try {
            const select = [
                "user.id",
                "user.email",
                "user.username",
                "user.role_id",
                knex.raw(`JSON_OBJECT(
                    'id', employee.id,
                    'name', employee.name,
                    'picture', employee.picture,
                    'address', employee.address
                ) as employee`),
                knex.raw(`JSON_OBJECT(
                    'id', role.id,
                    'name', role.name
                ) as role`),
                knex.raw(`JSON_OBJECT(
                    'id', mbc.id,
                    'name', mbc.name
                ) as branch_company`),
                knex.raw(`JSON_OBJECT(
                    'id', company.id,
                    'name', company.name
                ) as company`),
            ];

            const query = knex("m_users as user").select(select)
                .leftJoin("m_roles as role", function () {
                    this.on("role.id", "user.role_id");
                })
                .leftJoin("m_employees as employee", function () {
                    this.on("employee.id", "user.employee_id");
                })
                .leftJoin("m_branch_companies as mbc", function () {
                    this.on("mbc.id", "employee.branch_company_id");
                })
                .leftJoin("m_companies as company", function () {
                    this.on("company.id", "mbc.company_id");
                });

            if (search.uuid) {
                query.where("user.id", search.uuid);
            }

            if (search.email) {
                query.whereILike("user.email", search.email);
            }
            
            if (search.username) {
                query.whereILike("user.username", search.username);
            }
            
            if (search.name) {
                query.whereILike("employee.name", search.name);
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
                        // @ts-ignore
                        role: JSON.parse(item.role),
                        // @ts-ignore
                        employee: JSON.parse(item.employee),
                        // @ts-ignore
                        branch_company: JSON.parse(item.branch_company),
                        // @ts-ignore
                        company: JSON.parse(item.company),
                    };
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
                "user.role_id",
                knex.raw(`JSON_OBJECT(
                    'id', employee.id,
                    'name', employee.name,
                    'picture', employee.picture,
                    'address', employee.address
                ) as employee`),
                knex.raw(`JSON_OBJECT(
                    'id', role.id,
                    'name', role.name,
                    'permissions', JSON_ARRAYAGG(permission.name)
                ) as role`),
                knex.raw(`JSON_OBJECT(
                    'id', mbc.id,
                    'name', mbc.name
                ) as branch_company`),
                knex.raw(`JSON_OBJECT(
                    'id', mc.id,
                    'name', mc.name
                ) as company`),
            ];

            const query = knex("m_users as user").select(select);
            query.innerJoin("m_employees as employee", function () {
                this.on("employee.id", "user.employee_id");
            });
            query.leftJoin("m_roles as role", function () {
                this.on("role.id", "user.role_id");
            });

            query.leftJoin("m_branch_companies as mbc", function () {
                this.on("mbc.id", "employee.branch_company_id");
                this.onNull("mbc.deleted_at");
            });
            query.leftJoin("m_companies as mc", function () {
                this.on("mc.id", "mbc.company_id");
                this.onNull("mc.deleted_at");
            });
            
            query.leftJoin("map_role_permission as mrp", function () {
                this.on("mrp.role_id", "role.id");
                this.onNull("mc.deleted_at");
            });

            query.leftJoin("lt_permissions as permission", function () {
                this.on("permission.id", "mrp.permission_id");
                this.onNull("mc.deleted_at");
            });

            query.where("user.id", id);
            query.whereNull("user.deleted_at");

            query.groupBy("user.id");
            query.groupBy("employee.id");
            query.groupBy("role.id");
            query.groupBy("mbc.id");
            query.groupBy("mc.id");

            const user = await query.first();
            if (user) {
                return {
                    ...user,
                    // @ts-ignore
                    role: JSON.parse(user.role),
                    // @ts-ignore
                    employee: JSON.parse(user.employee),
                    // @ts-ignore
                    branch_company: JSON.parse(user.branch_company),
                    // @ts-ignore
                    company: JSON.parse(user.company),
                    // @ts-ignore
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
                "user.role_id",
                "user.employee_id",
                knex.raw(`JSON_OBJECT(
                    'id', employee.id,
                    'name', employee.name,
                    'picture', employee.picture,
                    'address', employee.address
                ) as employee`),
                knex.raw(`JSON_OBJECT(
                    'id', role.id,
                    'name', role.name,
                    'permissions', JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', permission.id,
                            'name', permission.name,
                            'description', permission.description
                        )
                    )
                ) as role`),
                knex.raw(`JSON_OBJECT(
                    'id', mbc.id,
                    'name', mbc.name
                ) as branch_company`),
                knex.raw(`JSON_OBJECT(
                    'id', mc.id,
                    'name', mc.name
                ) as company`),
            ];

            const query = knex("m_users as user").select(select);
            query.innerJoin("m_employees as employee", function () {
                this.on("employee.id", "user.employee_id");
            });
            query.leftJoin("m_roles as role", function () {
                this.on("role.id", "user.role_id");
            });

            query.leftJoin("m_branch_companies as mbc", function () {
                this.on("mbc.id", "employee.branch_company_id");
                this.onNull("mbc.deleted_at");
            });
            query.leftJoin("m_companies as mc", function () {
                this.on("mc.id", "mbc.company_id");
                this.onNull("mc.deleted_at");
            });
            
            query.leftJoin("map_role_permission as mrp", function () {
                this.on("mrp.role_id", "role.id");
                this.onNull("mc.deleted_at");
            });

            query.leftJoin("lt_permissions as permission", function () {
                this.on("permission.id", "mrp.permission_id");
                this.onNull("mc.deleted_at");
            });

            if (search.uuid) {
                query.where("user.id", search.uuid);
            }

            if (search.email) {
                query.whereILike("user.email", search.email);
            }
            
            if (search.username) {
                query.whereILike("user.username", search.username);
            }
            
            if (search.name) {
                query.whereILike("employee.name", search.name);
            }

            query.whereNull("user.deleted_at");

            query.groupBy("user.id");
            query.groupBy("employee.id");
            query.groupBy("role.id");
            query.groupBy("mbc.id");
            query.groupBy("mc.id");

            const user = await query.first();
            if (user) {
                return {
                    ...user,
                    // @ts-ignore
                    role: JSON.parse(user.role),
                    // @ts-ignore
                    employee: JSON.parse(user.employee),
                    // @ts-ignore
                    branch_company: JSON.parse(user.branch_company),
                    // @ts-ignore
                    company: JSON.parse(user.company),
                    // @ts-ignore
                }
            }
            return undefined;
        } catch (error) {
            throw error;
        }
    }

    async create(user: User): Promise<void> {
        try {
            await knex.transaction(async trx => {
                await trx("m_users").insert({
                    ...user,
                    created_at: knex.raw("now()"),
                });
            });
        } catch (error) {
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
}