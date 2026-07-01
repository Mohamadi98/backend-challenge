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

    public async getMessages(chatId: number) {
        const result = await this.postgres.query(`SELECT * FROM messages WHERE chat_id = $1`, [chatId])
        return result.rows.map((row) =>  new MessageModel(row.chat_id, row.number, row.body, row.id, row.created_at))
    }

    public async getMessage(chatId: number, msgNumber: number) {
        const result = await this.postgres.query(
            `SELECT * FROM messages WHERE chat_id = $1 AND number = $2`, [chatId, msgNumber])
        if(result.rowCount === 0) return null
        const row = result.rows[0]
        return new MessageModel(row.chat_id, row.number, row.body, row.id, row.created_at)
    }

    public async delete(chatId: number, msgNumber: number) {
        try {
            await this.postgres.query(`DELETE FROM messages WHERE chat_id = $1 AND number = $2`, [chatId, msgNumber])
        } catch (error) {
            console.log(error)
        }
    }
}