<template>
  <el-row>
    <el-col :span="4">
      <el-menu class="el-menu-demo">
        <el-menu-item
          v-for="chatRoom in allChatRoom"
          :key="chatRoom.chatRoomId"
          @click="enterChatRoom(chatRoom.Id)"
        >
          <el-row class="chatRoomContent">
            <el-row class="chatName">{{ chatRoom.chatRoomName }}</el-row>
            <el-row class="chatRoomLatestChat"> </el-row>
            <p :id="chatRoomLatestChat + chatRoom.chatRoomId">123456</p>
          </el-row>
        </el-menu-item>
      </el-menu>
    </el-col>

    <el-col :span="20" :push="1">
      <!------------------- 聊天室視窗-------------------->
      <div id="fuck" class="chatWindow">
        <div v-for="nowChat in nowChatArray" :key="nowChat.ChatId">
          <el-row
            :class="nowChat.Sender === userId ? 'sendChat-Row' : 'getChat-Row'"
          >
            <div
              :class="
                nowChat.Sender === userId ? 'sendChat-dialog' : 'getChat-dialog'
              "
            >
              {{ nowChat.Content }}
            </div>
          </el-row>
          <el-row
            :class="
              nowChat.Sender === userId
                ? 'sendChat-timeSpan'
                : 'getChat-timeSpan'
            "
          >
            <span> {{ nowChat.ChatTime }} </span>
          </el-row>
        </div>
      </div>
      <!------------------- 聊天室視窗-------------------->

      <div>
        <el-row class="typeWindow-Row">
          <el-input
            class="typeWindow-Input"
            type="text"
            placeholder="請輸入內容"
            maxlength="300"
            v-model="inputText"
            @keyup.enter.native="sendMessage"
          ></el-input>
        </el-row>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ws from "../webSocket";
import * as Interface from "../interface";
import API from "../api";
import * as Enum from "../enum";
import { format } from "date-fns";

@Component
export default class chatView extends Vue {
  //webSocket物件實體
  webs = new ws();
  //輸入的文字框內容
  private inputText = "";
  //現在登入的帳號
  private userId = "";
  //目前點開的聊天室
  private nowChatRoomId = "";
  //目前點開的聊天室的聊天內容
  private nowChatArray: Interface.ChatModel[] = [];
  //使用者所有聊天室
  private allChatRoom: Interface.ChatRoomModel[] = [];
  //全部資料
  private entireData: [] = [];
  private apiClass = new API();

  //預先載入
  private async mounted() {
    this.userId = sessionStorage.getItem("nowUser")!;

    //先打API驗證JWT是否通過，若不通過代表沒有登入成功，跳出提示訊息並且返回上一頁。
    if (!(await this.apiClass.verification())) {
      alert("請先登入");
      location.href = "http://localhost:8080/Login";
    }

    //載入websocket連線
    await this.webs.wsConnect(this.userId);

    //連線成功，就consolelog連線成功，並直接進行一次資料請求
    this.webs.webSocket.onopen = (_data: any) => {
      this.requireMessage();
    };

    //收到伺服器的訊息時使用loadingChat方法把data拿出來
    this.webs.webSocket.onmessage = async (e: any) => {
      await this.wsRouter(e.data);
    };

    //收到伺服器關閉連線通知時，印出關閉訊息
    this.webs.webSocket.onclose = (e: any) => console.log(e);
  }

  //送出訊息
  private async sendMessage(): Promise<void> {
    if (this.inputText === "") return;
    //按Enter後的送出訊息，ContentObject裡東西要跟後端路由的去向做規格對應，
    //現在是sendMessage就要這個格式，如果是其他flag就可以是其他屬性。
    //為了物件的規格可以是自由的，就先把Content轉成字串，這樣後端就可以在路由導向後再轉成物件做處理

    const currentDate = new Date();
    const formattedDate = format(currentDate, "yyyy/MM/dd HH:mm:ss");
    const chatModel: Interface.ChatModel = {
      ChatId: "",
      Sender: this.userId,
      Content: this.inputText,
      ChatTime: formattedDate,
    };

    const ContentObject = JSON.stringify(chatModel);

    //先建立出實體物件，
    const theMessage: Interface.sendMessageModel = {
      type: Enum.WSRequestType.SendingMessage,
      ContentObject: ContentObject,
      ChatRoomId: this.nowChatRoomId,
    };

    //再把實體物件用Json.stringify轉成json字串傳出去
    await this.webs.webSocket.send(JSON.stringify(theMessage));

    this.inputText = "";
  }

  //請求訊息
  private async requireMessage(): Promise<void> {
    //這是訊息請求，就是主動跟伺服器說要撈資料，sendMessageModel的結構要再想一下怎麼改
    const theMessage: Interface.sendMessageModel = {
      type: Enum.WSRequestType.RequiredAllMessage,
      ContentObject: this.userId,
      ChatRoomId: "",
    };
    //送之前先把物件轉成Json String。
    await this.webs.webSocket.send(JSON.stringify(theMessage));
  }

  //產生側邊欄
  private async loadingChat(e: any): Promise<void> {
    //送進來時e已經是從伺服器回傳的data了
    this.entireData = e;
    //重置一次allChatRoom，因為我是用push的方式將資料加進，所以要先清空，不然會堆疊起來
    this.allChatRoom = [];
    //照著宣告時指定的物件屬性去建立一個物件並push進去
    for (var x of this.entireData) {
      this.allChatRoom.push(x);
    }
  }

  //進入聊天室
  private async enterChatRoom(chatRoomId: any): Promise<void> {
    //find(這邊放條件，實際上就是foreach所有值，丟進函數如果retrun true就會被篩出來)
    const myChatRoom = this.allChatRoom.find(
      (x: Interface.ChatRoomModel) => x.Id == chatRoomId
    );
    //防錯，如果沒有這個聊天室就return出去
    if (myChatRoom === undefined) return;

    //指定現在的聊天室內容，為了配合沉底，把陣列照時間降冪
    this.nowChatArray = [...myChatRoom.chat].sort((a, b) =>
      a["ChatTime"] < b["ChatTime"] ? 1 : -1
    );
    //指定現在的聊天室Id
    this.nowChatRoomId = myChatRoom["Id"];
  }

  private async wsRouter(objStr: string): Promise<void> {
    const returnObj: Interface.WsReturnModel = JSON.parse(objStr);
    if (returnObj.entryTypeCode == Enum.WSRequestType.RequiredAllMessage) {
      await this.GetAllMessage(returnObj.contentObject);
    } else if (returnObj.entryTypeCode == Enum.WSRequestType.SendingMessage) {
      this.GetOneMessage(returnObj.contentObject);
    }
  }

  //得到全部訊息只有在首次進入聊天室會發生。
  private async GetAllMessage(objStr: string) {
    const obj: Interface.ChatRoomModel = JSON.parse(objStr);
    await this.loadingChat(obj);
  }

  //得到單一message基本上代表的就是有人送訊息。
  private async GetOneMessage(objStr: string) {
    const obj: Interface.ChatModel = JSON.parse(objStr);
    this.nowChatArray.splice(0, 0, obj);

    let myChatRoom = this.allChatRoom.find(
      (x: Interface.ChatRoomModel) => x.Id == this.nowChatRoomId
    );

    if (myChatRoom == undefined) return;

    myChatRoom.chat.splice(0, 0, obj);
  }

  //private async ChatRoomDefaultContentBuild(_chatRoomId: string) {}
}
</script>

<style scoped>
.chatRoomLatestChat {
  text-align: right;
  font-size: 130%;
}

.el-menu-item {
  height: 120px;
}
.chatName {
  font-size: 170%;
  padding: 0px;
}
.chatWindow {
  background-color: dimgrey;
  width: 108%;
  height: 660px;
  padding: 20px 20px 5px 20px;
  border-radius: 20px 20px 0px 0px;
  max-height: 660px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}
.getChat-Row {
  margin-top: 25px;
}
.getChat-dialog {
  background: #000000;
  margin-left: 40px;
  position: relative;
  padding: 15px;
  color: #fff;
  font-size: 20px;
  border-radius: 10px;
  width: fit-content;
  max-width: 70%;
}
.getChat-dialog::before {
  border-color: transparent #000000 #000000 transparent;
  border-style: solid;
  border-width: 10px 25px;
  content: "";
  height: 0px;
  position: absolute;
  top: 5px;
  left: -40px;
  width: 0px;
}
.getChat-timeSpan {
  margin-left: 50px;
  margin-top: 3px;
}
.sendChat-Row {
  margin-top: 25px;
  display: flex;
  justify-content: right;
}
.sendChat-dialog {
  background: #ffffff;
  margin-right: 40px;
  position: relative;
  padding: 15px;
  color: #000000;
  font-size: 20px;
  border-radius: 10px;
  width: fit-content;
  max-width: 70%;
}
.sendChat-dialog::before {
  height: 0px;
  width: 0px;
  border-color: transparent transparent #fff #fff;
  border-style: solid;
  border-width: 10px 25px;
  content: "";
  position: absolute;
  top: 5px;
  right: -40px;
}
.sendChat-timeSpan {
  display: flex;
  justify-content: right;
  margin-top: 3px;
  margin-right: 45px;
}
.typeWindow-Row {
  background-color: dimgrey;
  border-radius: 0px 0px 20px 20px;
  width: 110.85%;
  height: 100px;
}
/deep/.el-input__inner {
  margin-top: 5px;
  margin-left: 16.5px;
  background-color: dimgrey;
  color: #fff;
  height: 80px;
  width: 98%;
  border-radius: 20px;
}

.chatWindow::-webkit-scrollbar {
  width: 1px;
}
</style>
