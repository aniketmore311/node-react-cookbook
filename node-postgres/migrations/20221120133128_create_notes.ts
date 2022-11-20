import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("notes", (table) => {
    table.uuid("id").primary().notNullable().unique();
    table.uuid("user_id").notNullable();
    table.string("content").notNullable();
    table.foreign("user_id").references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("notes");
}
