import { Knex } from "knex";
import { v4 as uuid } from "uuid";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("m_tags").del();

    // Inserts seed entries
    await knex("m_tags").insert([
        { id: uuid(), name: "Classroom Teacher" },
        { id: uuid(), name: "Computer Instructor" },
        { id: uuid(), name: "Media Specialist" },
        { id: uuid(), name: "Course Designer" },
        { id: uuid(), name: "Trainer" },
        { id: uuid(), name: "Designer of Training Materials" },
        { id: uuid(), name: "Project Manager" },
        { id: uuid(), name: "Consultant" },
        { id: uuid(), name: "Evaluator" },
        { id: uuid(), name: "Analyst" },
        { id: uuid(), name: "Curriculum Developer" },
        { id: uuid(), name: "Multimedia Script Writer" },
        { id: uuid(), name: "E-Learning Specialist" },
        { id: uuid(), name: "Learning Designer" },
        { id: uuid(), name: "Instructional Designer" },
        { id: uuid(), name: "Videographer" },
        { id: uuid(), name: "Photographer" },
        { id: uuid(), name: "Video Editing" },
        { id: uuid(), name: "Photo Editing Editing" },
        { id: uuid(), name: "Graphic Designer" },
        { id: uuid(), name: "Illustration Artist" },
        { id: uuid(), name: "Game Based Learning" },
        { id: uuid(), name: "Children’s Media" },
        { id: uuid(), name: "AR/VR" },
        { id: uuid(), name: "Boardgame" },
        { id: uuid(), name: "Leadership" },
        { id: uuid(), name: "Adult Learning" },
        { id: uuid(), name: "Hypermedia" },
        { id: uuid(), name: "Hyperlink" },
        { id: uuid(), name: "Learning Object" },
        { id: uuid(), name: "LCMS" },
        { id: uuid(), name: "Mobile Learning" },
        { id: uuid(), name: "Flip Classroom" },
        { id: uuid(), name: "Blended Learning" },
        { id: uuid(), name: "Distance Learning" },
        { id: uuid(), name: "Guidebook" },
        { id: uuid(), name: "Formative Assessment" },
        { id: uuid(), name: "NFT Enthusiast" },
        { id: uuid(), name: "Module" },
        { id: uuid(), name: "Flipped Classroom" },
    ]);
};