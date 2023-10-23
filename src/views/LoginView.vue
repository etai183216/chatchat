<template>
  <el-col :span="6" :push="10">
    <el-row class="loginRow">
      <label class="loginLable">帳號：</label>
      <el-input class="loginInput" v-model="accountInput"></el-input>
    </el-row>
    <el-row class="loginRow">
      <label class="loginLable">密碼：</label>
      <el-input class="loginInput" v-model="pwInput" show-password></el-input>
    </el-row>
    <el-row class="loginRow">
      <el-button class="RegisterButton">註冊</el-button>
      <el-button class="loginButton" @click="loginSend">登入</el-button>
    </el-row>
  </el-col>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as Interface from "../interface";
import API from "../api";
import * as Enum from "../enum";
@Component
export default class loginView extends Vue {
  apiClass = new API();

  private accountInput = "";
  private pwInput = "";

  private async loginSend() {
    const loginObject: Interface.loginModel = {
      account: this.accountInput,
      pw: this.pwInput,
    };

    const returnObj: Interface.ApiReturnModel = (
      await this.apiClass.login(loginObject)
    ).data;

    if (
      returnObj === null ||
      returnObj.returnStatusCode == Enum.ApiReturnType.Error
    ) {
      alert("登入失敗");
      return;
    }

    sessionStorage.setItem("Token", returnObj.contentObject);
    sessionStorage.setItem("nowUser", loginObject.account);
    alert("登入成功");
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
  margin-left: 175px;
}
.loginButton {
  margin-left: 0px;
}
</style>
