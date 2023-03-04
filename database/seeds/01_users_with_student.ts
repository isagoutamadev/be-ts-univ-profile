import { Knex } from "knex";
import AuthHelper from "../../src/helpers/auth.helper";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("m_users").truncate();
    await knex("m_users").insert([
        {
            uuid: v4(),
            username: "admin",
            email: "admin@univ.com", 
            password: AuthHelper.encrypt("$admin#4dm1n"),
            role: "admin",
        },
    ]);
};
