// --------------------------
// 送出訊息
// --------------------------
import * as Enum from "./enum";

export interface sendMessageModel {
  type: Enum.WSRequestType;
  ContentObject: string;
  ChatRoomId: string;
}

export interface loginModel {
  account: string;
  pw: string;
}

export interface CreateChatRoomModel {
  chatNameRoom: string;
  member: string[];
}

export interface ReturnModel {
  entryTypeCode: Enum.WSRequestType;
  contentObject: string;
}
