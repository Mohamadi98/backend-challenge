import { Postgres } from "../datastore/postgres";
import { DatabaseError, DuplicateResourceError, ForeignKeyViolationError } from "../errors/error";
import { ChatModel } from "../models/chat";

export class ChatRepository {
    private postgres: Postgres

    constructor(postgres: Postgres) {
        this.postgres = postgres
    }

    public async create(chat: ChatModel) {
        try {
            const result = await this.postgres.query(
                `INSERT INTO chats(app_id, number)
                VALUES($1, $2, $3) RETURNING *`, [chat.getAppId, chat.getNumber]
            )
            const row = result.rows[0]
            return new ChatModel(row.app_id, row.number, row.messages_count, row.id, row.created_at)
        } catch (error: any) {
            if(error.code === '23503') {
                throw new ForeignKeyViolationError('Invalid app_id', error)
            } else if(error.code === '23505') {
                throw new DuplicateResourceError('Duplicate chat number', error)
            } else {
                throw new DatabaseError('Unhandled Database error', error)
            }
        }
    }
}