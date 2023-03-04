import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable(
        "map_student_interest_tags",
        function (table) {
            table
                .uuid("student_id")
                .notNullable()
                .references("m_students.id")
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
    return knex.schema.dropTable("map_student_interest_tags");
}
