import { Knex } from "knex";
import { v4 as uuid } from "uuid";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("m_majors").del();

    // Inserts seed entries
    await knex("m_majors").insert([
        { id: uuid(), name: "Teknologi Pendidikan" },
        { id: uuid(), name: "Pendidikan Agama Islam" },
        { id: uuid(), name: "DKV" },
        { id: uuid(), name: "Teknik Informatika" },
    ]);
};