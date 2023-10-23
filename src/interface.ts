// --------------------------
// 送出訊息
// --------------------------
import { DateType } from "element-ui/types/calendar";
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
  userid: string;
  chatNameRoom: string;
  member: string[];
}

export interface WsReturnModel {
  entryTypeCode: Enum.WSRequestType;
  contentObject: string;
}

export interface ApiReturnModel {
  returnStatusCode: Enum.ApiReturnType;
  contentObject: string;
}

export interface ChatRoomModel {
  Id: string;
  Member: string[];
  UpdateTime: string;
  chat: ChatModel[];
}

export interface ChatModel {
  ChatId: string;
  ChatTime: string;
  Sender: string;
  Content: string;
}
