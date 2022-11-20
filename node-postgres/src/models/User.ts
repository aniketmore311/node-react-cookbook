import pool from "../setup/pool";
import { v4 as uuid } from "uuid";

type userRow = {
  id: string;
  email: string;
  name: string;
  created_at: Date;
  updated_at: Date;
};

class User {
  public id: string;
  public email: string;
  public name: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor({
    id,
    email,
    name,
    createdAt,
    updatedAt,
  }: {
    id: string;
    email: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create({
    email,
    name,
  }: {
    email: string;
    name: string;
  }): Promise<User> {
    let client = await pool.connect();
    let date = new Date();
    let resp = await client.query<userRow>(
      "insert into users (id,email,name,created_at,updated_at) values ($1,$2,$3,$4,$5) returning *",
      [uuid(), email, name, date, date]
    );
    let userRow = resp.rows[0];
    return this.mapRow(userRow);
  }

  private static mapRow(row: userRow): User {
    return new User({
      id: row.id,
      email: row.email,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      name: row.name,
    });
  }
}

export default User;
// table.uuid("id").unique().primary().notNullable();
// table.string("email").unique().notNullable();
// table.string("name").notNullable();
// table.timestamps(true, true, false);
