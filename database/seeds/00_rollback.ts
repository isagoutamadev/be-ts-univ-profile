import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("map_asset_category").del();
    await knex("map_role_permission").del();
    await knex("lt_permissions").del();
    await knex("o_history_asset_borrow_request").del();
    await knex("m_asset_borrow_request").del();
    await knex("m_asset_problem").del();
    await knex("m_asset_borrow").del();
    await knex("o_history_asset_request").del();
    await knex("map_asset_request_created").del();
    await knex("m_asset_request").del();
    await knex("lt_asset_request_status").del();
    await knex("m_assets").del();
    await knex("m_users").del();
    await knex("m_employees").del();
    await knex("lt_asset_status").del();
    await knex("lt_asset_condition").del();
    await knex("lt_asset_problem_status").del();
    await knex("m_branch_companies").del();
    await knex("m_companies").del();
    await knex("m_roles").del();
    await knex("lt_districts").del();
    await knex("lt_regencies").del();
    await knex("lt_provinces").del();
    await knex("lt_categories").del();
};
