import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("m_users", function (table) {
        table.string("facebook").nullable();
        table.string("twitter").nullable();
        table.string("instagram").nullable();
        table.string("linkedin").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    // return knex.schema.dropTable("m_users");
}