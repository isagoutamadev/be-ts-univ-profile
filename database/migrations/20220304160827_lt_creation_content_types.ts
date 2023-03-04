import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("lt_creation_content_types", function (table) {
        table.increments("id").primary().notNullable();
        table.string("name").unique().notNullable();
        table.string("guide_url").notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("lt_creation_content_types");
}