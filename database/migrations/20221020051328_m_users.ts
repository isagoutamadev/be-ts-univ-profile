import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("m_users", function (table) {
        table.increments("id").primary().notNullable();
        table.uuid("uuid").unique().notNullable();
        table.string("email").unique().notNullable();
        table.string("username").unique().notNullable();
        table.string("password").notNullable();
        table.uuid("created_by").nullable();
        table.uuid("updated_by").nullable();
        table.timestamps();
        table.uuid("deleted_by").nullable();
        table.timestamp("deleted_at").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("m_users");
}
