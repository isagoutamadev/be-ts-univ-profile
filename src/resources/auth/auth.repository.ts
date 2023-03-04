import { User } from "@/models/user.model";
import knex from "@/utils/knex/knex"

export class AuthRepository {
    public findByEmailOrUsername = async (usernameOrEmail: string): Promise<User|undefined> => {
        try {
            const select = [
                "user.id",
                "user.uuid",
                "user.email",
                "user.password",
                "user.role",
            ];

            const query = knex("m_users as user").select(select);

            query.where(q => q.where("user.email", usernameOrEmail).orWhere("user.username", usernameOrEmail));
            query.whereNull("user.deleted_at");

            const user = await query.first();
           
            return user;
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