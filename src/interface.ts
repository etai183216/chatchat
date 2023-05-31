
// --------------------------
// 送出訊息
// --------------------------


export interface sendMessageModel {
    type: string;
    ContentObject: string;
    ChatRoomId: string;
}

export interface loginModel {
    account:string;
    pw:string;
}