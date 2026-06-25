import { AppModel } from "../models/app";
import { Postgres } from "../datastore/postgres";
import { DatabaseError, DuplicateResourceError } from "../errors/error";

export class AppRepository {
    private postgres: Postgres

    constructor(postgres: Postgres) {
        this.postgres = postgres
    }

    public async create(app: AppModel): Promise<AppModel> {
        const result = await this.postgres.query(
            `INSERT INTO apps(token, name)
            VALUES($1, $2) RETURNING *`, [app.getToken(), app.getName()]
        )

        const row = result.rows[0]
        return new AppModel(row.token, row.name, row.chats_count, row.id, row.created_at)
    }

    public async getByToken(token: string): Promise<AppModel | null> {
        const result = await this.postgres.query(`SELECT * FROM apps WHERE token = $1`, [token])
        if (result.rows.length === 0) return null
        const row = result.rows[0]
        return new AppModel(row.token, row.name, row.chatsCount, row.id, row.createdAt)
    }

    public async deleteByToken(token: string) {
        await this.postgres.query('DELETE FROM apps WHERE token = $1', [token])
    }
}