import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("m_faqs", function (table) {
        table.uuid("id").primary().notNullable();
        table.string("question").notNullable();
        table.text("answer").notNullable();
        table.uuid("created_by").nullable();
        table.uuid("updated_by").nullable();
        table.timestamps();
        table.uuid("deleted_by").nullable();
        table.timestamp("deleted_at").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("m_faqs");
}

