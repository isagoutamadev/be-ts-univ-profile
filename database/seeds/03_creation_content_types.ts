import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("lt_creation_content_types").del();

    // Inserts seed entries
    await knex("lt_creation_content_types").insert([
        {
            id: 1,
            name: "Foto Upload",
            guide_url: "",
        },
        {
            id: 2,
            name: "Youtube",
            guide_url: "https://support.google.com/youtube/answer/171780?hl=en",
        },
        {
            id: 3,
            name: "3D",
            guide_url: "https://help.sketchfab.com/hc/en-us/articles/203509907-Embedding-your-3D-models",
        },
        {
            id: 4,
            name: "Google Sildes",
            guide_url: "https://support.google.com/docs/answer/183965#embed_files",
        },
    ]);
}
