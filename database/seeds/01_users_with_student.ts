import { Knex } from "knex";
import AuthHelper from "../../src/helpers/auth.helper";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("m_employees").insert([
        { 
            id: "97599bfe-de62-4b63-8fcd-7f762db11cf5", 
            name: "Super Admin",
            branch_company_id: "b06ad12b-7bdd-4dc9-a0b5-a6e342e8813c",
            district_id: 3276050,
        },
    ]);

    await knex("m_users").insert([
        { 
            id: "0", 
            username: "admin",
            email: "admin@asset.com", 
            password: AuthHelper.encrypt("Admin3RP!!1109"),
            employee_id: "97599bfe-de62-4b63-8fcd-7f762db11cf5",
            role_id: "00001"
        },
    ]);
};
