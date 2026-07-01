export function formatAppRedisKey(token:string) {
    return `app:${token}:chat:number`
}

export function formatChatRedisKey(token: string, chatNumber: number) {
    return `${token}:chat:${chatNumber}:msg:number`
}