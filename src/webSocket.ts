import { Axios, AxiosResponse } from "axios";

export default class ws {
  public webSocket: any;
  public async wsConnect(_userAccount: string) {
    this.webSocket = new WebSocket(
      `wss://localhost:7217/wsConnect/${_userAccount}`
    );
  }
}
