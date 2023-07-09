import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("m_creation_contents", function (table) {
        table.string("url").nullable().after("filename");
    });
}

export async function down(knex: Knex): Promise<void> {
    // return knex.schema.dropTable("m_users");
}