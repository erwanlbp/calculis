export interface FirebaseNotification {
    data: {
        type: string
        gameId?: string
    }
    notification: {
        title: string
        body: string
    }
}