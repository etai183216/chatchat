
import API from './api';
export default class ws {
    public webSocket:any;
    public apiClass = new API();
    public wsConnect(_userAccount:string) {
        const flag = this.apiClass.verification();
        if(!flag) return;
        this.webSocket = new WebSocket(`wss://localhost:7217/wsConnect/${_userAccount}`);
    }
}