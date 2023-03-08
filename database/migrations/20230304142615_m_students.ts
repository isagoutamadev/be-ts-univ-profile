import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("m_students", function (table) {
        table.uuid("id").primary().notNullable();
        table
            .uuid("user_id")
            .unique()
            .notNullable()
            .references("m_users.id")
            .onDelete("cascade");
        table.string("avatar").nullable();
        table.string("nim").unique().notNullable();
        table.string("name").notNullable();
        table.string("bio").nullable();
        table.string("website_screenshot").nullable();
        table.string("website_url").nullable();
        table.date("registered_at").notNullable();
        table.date("graduated_at").nullable();
        table.uuid("created_by").nullable();
        table.uuid("updated_by").nullable();
        table.timestamps();
        table.uuid("deleted_by").nullable();
        table.timestamp("deleted_at").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("m_students");
}
