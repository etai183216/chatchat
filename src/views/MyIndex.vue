<template>
  <div>
    <el-row class=page-Header>
      <page-Header></page-Header>
    </el-row>
    <el-row style="margin-top:20px">
      <el-col :span="3">
      </el-col>
      <el-col :span="21" class= main-layout>
        <router-view/>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import pageHeader from '@/components/pageHeader.vue';
import { Component, Vue } from 'vue-property-decorator';
@Component({
  components:{
    'page-Header' : pageHeader
  }
})
export default class app extends Vue {

}
</script>

<style scoped lang="scss">


</style>