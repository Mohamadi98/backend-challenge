import { Postgres } from "../datastore/postgres";
import { DuplicateResourceError, ForeignKeyViolationError } from "../errors/error";
import { MessageModel } from "../models/message";

export class MessageRepository {
    private postgres: Postgres

    constructor(postgres: Postgres) {
        this.postgres = postgres
    }

    public async create(message: MessageModel) {
        try {
            const result = await this.postgres.query(
                `INSERT INTO messages(chat_id, body, number)
                VALUES($1, $2, $3)
                RETURNING *`, [message.getChatId(), message.getBody(), message.getNumber()]
            )
            const row = result.rows[0]
            return new MessageModel(row.chat_id, row.number, row.body, row.id, row.created_at)
        } catch (error: any) {
            if(error.code === '23503') {
                console.log(error)
                throw new ForeignKeyViolationError('Invalid chat_id', error)
            } else if(error.code === '23505') {
                console.log(error)
                throw new DuplicateResourceError('Duplicate message number', error)
            } else {
                console.log(error)
                throw new Error('Unhandled Database error', error)
            }
        }
    }
}