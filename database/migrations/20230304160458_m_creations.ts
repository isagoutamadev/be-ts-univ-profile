import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("m_creations", function (table) {
        table.uuid("id").primary().notNullable();
        table
            .uuid("student_id")
            .notNullable()
            .references("m_students.id")
            .onDelete("cascade");
        table.string("title").notNullable();
        table.text("description").notNullable();
        table.uuid("created_by").nullable();
        table.uuid("updated_by").nullable();
        table.timestamps();
        table.uuid("deleted_by").nullable();
        table.timestamp("deleted_at").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("m_creations");
}
