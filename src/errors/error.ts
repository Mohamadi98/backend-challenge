export class DatabaseError extends Error {
    constructor(message: string, originalError?: any) {
        super(message)
        this.name = 'DatabaseError'
        this.cause = originalError
    } 
}

export class DuplicateResourceError extends Error {
    constructor(message: string, originalError?: any) {
        super(message)
        this.name = 'DuplicateResourceError'
        this.cause = originalError
    } 
}

export class ForeignKeyViolationError extends Error {
    constructor(message: string, originalError?: any) {
        super(message)
        this.name = 'ForeignKeyViolationError'
        this.cause = originalError
    }
}