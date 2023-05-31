<template>
  <div class="home">
    <h1>你知道......其實首頁沒有任何內容，是為了使用vue router而存在的</h1>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HomeView extends Vue {}
</script>
