import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("m_creation_contents", function (table) {
        table.uuid("id").primary().notNullable();
        table
        .uuid("creation_id")
        .notNullable()
        .references("m_creations.id")
        .onDelete("cascade");
        table.string("filename").nullable();
        table.text("embed_code").nullable();
        table.uuid("created_by").nullable();
        table.uuid("updated_by").nullable();
        table.timestamps();
        table.uuid("deleted_by").nullable();
        table.timestamp("deleted_at").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("m_creation_contents");
}
