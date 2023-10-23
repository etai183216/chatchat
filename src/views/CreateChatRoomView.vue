<template>
  <el-col :span="6" :push="10">
    <el-row class="loginRow">
      <label class="loginLable">聊天室名稱：</label>
      <el-input class="loginInput" v-model="chatRoomName"></el-input>
    </el-row>
    <el-row class="loginRow">
      <label class="loginLable">邀請成員(以;分隔)：</label>
      <el-input class="loginInput" v-model="chatRoomMember"></el-input>
    </el-row>
    <el-row class="loginRow">
      <el-button class="" @click="createChatRoomSend">創建聊天室</el-button>
    </el-row>
  </el-col>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Interface from "../interface";
import API from "../api";
import * as Enum from "../enum";
@Component
export default class CreateChatRoom extends Vue {
  apiClass = new API();

  private chatRoomName = "";
  private chatRoomMember = sessionStorage.getItem("nowUser") + ";";

  private async createChatRoomSend() {
    const CreateChatRoomObject: Interface.CreateChatRoomModel = {
      userid: sessionStorage.getItem("nowUser")!,
      chatNameRoom: this.chatRoomName,
      member: this.chatRoomMember.split(";"),
    };

    const returnObj: Interface.ApiReturnModel = JSON.parse(
      (await this.apiClass.createCharRoomApi(CreateChatRoomObject)).data
    );

    if (returnObj.returnStatusCode == Enum.ApiReturnType.Error) {
      alert("建立聊天室失敗。");
      return;
    }
    alert("建立聊天室成功。");
  }
}
</script>

<style>
.loginInput {
  width: 80%;
}
.loginLable {
  font-size: 20px;
}
.loginRow {
  margin-top: 20px;
}
.RegisterButton {
  margin-left: 243px;
}
.loginButton {
  margin-left: 0px;
}
</style>
