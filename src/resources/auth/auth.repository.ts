import DataHelper from "@/helpers/data.helper";
import { User } from "@/models/user.model";
import knex from "@/utils/knex/knex"

export class AuthRepository {
    public findByEmailOrUsername = async (usernameOrEmail: string): Promise<User|undefined> => {
        try {
            const select = [
                "user.id",
                "user.email",
                "user.password",
                "user.role",
                knex.raw(`JSON_OBJECT(
                    'id', student.id,
                    'name', student.name,
                    'avatar', student.avatar,
                    'avatar', student.graduated_at
                ) as student`),
            ];

            const query = knex("m_users as user").select(select);
            query.leftJoin("m_students as student", "student.user_id", "user.id");

            query.where(q => q.where("user.email", usernameOrEmail).orWhere("user.username", usernameOrEmail));
            query.whereNull("user.deleted_at");

            const user = await query.first();
            if (user) {
                return DataHelper.objectParse(user);
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