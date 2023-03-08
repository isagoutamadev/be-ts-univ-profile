import { Knex } from "knex";
import AuthHelper from "../../src/helpers/auth.helper";
import { v4 } from "uuid";

export async function seed(knex: Knex): Promise<void> {
    // Inserts seed entries
    await knex("m_users").delete();
    await knex("m_students").delete();
    await knex("m_users").insert([
        {
            id: "974c97aa-b068-4cd9-bce4-07311e2449a3",
            username: "admin",
            email: "admin@univ.com", 
            password: AuthHelper.encrypt("$admin#4dm1n"),
            role: "admin",
            created_at: knex.raw("now()")
        },
        {
            id: "c6e9d6dd-abbd-4e58-a168-e057ba36fc69",
            username: "isagoutama",
            email: "isa@univ.com", 
            password: AuthHelper.encrypt("password"),
            role: "student",
            created_at: knex.raw("now()")
        },
        {
            id: "e77d7540-c1aa-46ac-991e-fab9cd6aed63",
            username: "bariqdh",
            email: "bariq@univ.com", 
            password: AuthHelper.encrypt("password"),
            role: "student",
            created_at: knex.raw("now()")
        },
        {
            id: "1e891933-b328-4453-b671-5b111f28c75e",
            username: "febytri",
            email: "feby@univ.com", 
            password: AuthHelper.encrypt("password"),
            role: "student",
            created_at: knex.raw("now()")
        },
    ]);

    await knex("m_students").insert([
        {
            id: "c40a9551-993c-4bcb-aaed-b80741388b2e",
            user_id: "c6e9d6dd-abbd-4e58-a168-e057ba36fc69",
            name: "Muhammad Isa Goutama",
            nim: "000192",
            registered_at: "2020-10-19",
            graduated_at: null, // Masih mahasiswa
        },
        {
            id: "99b95df0-9136-4913-a90d-03d066c1b3d9",
            user_id: "e77d7540-c1aa-46ac-991e-fab9cd6aed63",
            name: "Muhammad Bariq Dharmawan",
            nim: "122334",
            registered_at: "2017-10-19",
            graduated_at: "2021-10-19", // Sudah  lulus
        },
        {
            id: "c8b7a150-8e4c-4e08-bc19-dbde3ea6befd",
            user_id: "1e891933-b328-4453-b671-5b111f28c75e",
            name: "Feby Tri Handayani",
            nim: "123344",
            registered_at: "2017-10-19",
            graduated_at: "2021-10-19", // Sudah  lulus
        },
    ]);
};
