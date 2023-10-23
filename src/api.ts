import axios, { AxiosPromise } from "axios";
import * as Interface from "../src/interface";

export default class loginClass {
  public async login(loginModel: Interface.loginModel): AxiosPromise<any> {
    return await axios({
      method: "post",
      url: `https://localhost:7217/login`,
      data: {
        Account: loginModel.account,
        Password: loginModel.pw,
      },
    });
  }

  //在建立WS連線前先打一次驗證，目的是讓伺服器確認是否已經登入，
  public async verification(): Promise<boolean> {
    let resBool = true;
    const axiosRes = await axios({
      method: "get",
      url: `https://localhost:7217/verification`,
      headers: {
        Authorization: "bearer " + sessionStorage.getItem("Token"),
      },
    }).catch(() => {
      resBool = false;
    });

    return resBool;
  }

  public async createCharRoomApi(
    chatNameRoomObj: Interface.CreateChatRoomModel
  ): AxiosPromise<any> {
    return await axios({
      method: "post",
      url: `https://localhost:7217/CreateChatRoom`,
      data: {
        userid: chatNameRoomObj.userid,
        chatRoomName: chatNameRoomObj.chatNameRoom,
        memberList: chatNameRoomObj.member,
      },
    });
  }
}
