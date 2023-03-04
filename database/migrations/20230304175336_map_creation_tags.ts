import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        "map_creation_tags",
        function (table) {
            table
                .uuid("creation_id")
                .notNullable()
                .references("m_creations.id")
                .onDelete("cascade");
            table
                .uuid("tag_id")
                .notNullable()
                .references("m_tags.id")
                .onDelete("cascade");
        }
    );
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("map_creation_tags");
}
