import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("m_creations", function (table) {
        table.string("to_url").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    // return knex.schema.dropTable("m_users");
}