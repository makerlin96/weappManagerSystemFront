<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="商品ID">
          <el-input v-model="itemId"></el-input>
        </el-form-item>
        <!--        <el-form-item label="商品标题">-->
        <!--          <el-input v-model="itemTitle"></el-input>-->
        <!--        </el-form-item>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import { getGoodForId } from '@/api/goods';

export default {
  name: 'GoodsShelf',
  data() {
    return {
      itemId: '',
      itemTitle: null
    }
  },
  created() {
    getGoodForId({ itemId: this.itemId }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped>

</style>
