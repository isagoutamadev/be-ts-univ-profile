import { User } from "@/models/user.model";
import knex from "@/utils/knex/knex"

export class AuthRepository {
    public findByEmail = async (email: string): Promise<User|undefined> => {
        try {
            const select = [
                "user.id",
                "user.email",
                "user.password",
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

            query.where(q => q.where("user.email", email).orWhere("user.username", email));
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
    
    async updateById (user: User): Promise<void> {
        try {
            await knex("m_users").update({
                ...user
            }).where("id", user.id);
        } catch (error) {
            throw error;
        }
    }
}