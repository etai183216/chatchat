<template>
  <div class="home">
    <dialog id="homeDialog"><router-view /></dialog>
    <div id="contentDiv">
      <router-link to="CreateChatRoom">link</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class HomeView extends Vue {
  private CreateChatRoom() {
    console.log(document.getElementById("homeDialog"));
  }
}
</script>

<style lang="scss">
#contentDiv {
  display: flex;
  height: 600px;
  width: 1900px;
  align-items: center;
  justify-content: center;
}

#buildChatRoom {
  width: 300px;
  height: 100px;
}
</style>
