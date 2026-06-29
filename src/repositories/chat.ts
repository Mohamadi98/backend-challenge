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
                `INSERT INTO chats(app_id, number, messages_count)
                VALUES($1, $2, $3) RETURNING *`, [chat.getAppId(), chat.getNumber(), chat.getMessagesCount()]
            )
            const row = result.rows[0]
            return new ChatModel(row.app_id, row.number, row.messages_count, row.id, row.created_at)
        } catch (error: any) {
            if(error.code === '23503') {
                throw new ForeignKeyViolationError('Invalid app_id', error)
            } else if(error.code === '23505') {
                throw new DuplicateResourceError('Duplicate chat number', error)
            } else {
                console.log(error)
                throw new DatabaseError('Unhandled Database error', error)
            }
        }
    }

    public async getChatsByAppToken(appId: number): Promise<ChatModel[]> {
        const result = await this.postgres.query(`SELECT * FROM chats WHERE app_id = $1`, [appId])
        return result.rows.map((chat) => new ChatModel(chat.app_id, chat.number, chat.messages_count, chat.id, chat.created_at))
    }

    public async delete(appId: number, chatNumber: number) {
        try {
            await this.postgres.query(`DELETE FROM chats WHERE app_id = $1 AND number = $2`, [appId, chatNumber])
        } catch (error: any) {
            console.log(error)
        }
    }

    public async getChatByNumber(appId: number, number: number) {
        const result = await this.postgres.query(`SELECT * FROM chats WHERE app_id = $1 AND number = $2`, [appId, number])
        if(result.rowCount === 0) return null
        const row = result.rows[0]
        return new ChatModel(row.app_id, row.number, row.messages_count, row.id, row.created_at)
    }
}