import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").unique().primary().notNullable();
    table.string("email").unique().notNullable();
    table.string("name").notNullable();
    table.timestamps(true, true, false);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
