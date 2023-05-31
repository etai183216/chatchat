<template>
  <div class="header">
    <el-row>
      <el-col :span="3" :push="1" class="header-logo">
        <img src="../assets/logo.png" />
      </el-col>
      <el-col :span="3">
        <p>CHATCHAT</p>
      </el-col>
      <el-col :span="10" >
        <div class="classMenu">
        <el-menu
          :router="true"
          class="el-menu-demo"
          :default-active="this.$route.path"
          mode="horizontal"
        >
          <el-menu-item index="/Home">
            <p>首頁</p>
          </el-menu-item>
          <el-menu-item index="/Chat">
            <p>聊天</p>
          </el-menu-item>
          <el-menu-item index="/Login">
            <p>登入</p>
          </el-menu-item>
        </el-menu>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Header extends Vue {}
</script>

<style scoped>
.header {
  background-color: #409eff;
}
img {
  width: 100px;
}
p {
  font-size: 90px;
  padding: 0px;
  margin: 0px;
}

.el-menu-demo {
    left: 400px;
    height: 100px;
    background-color: #409eff ;
    padding: 0px;
    margin: 0px;
}

.el-menu-item {
    width: 33%;
    height: 100% !important; 
    text-align: center;
    line-height:100px !important;
}
</style>

