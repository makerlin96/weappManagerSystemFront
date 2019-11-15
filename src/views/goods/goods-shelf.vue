<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true">
        <el-form-item label="商品ID">
          <el-input v-model="itemId"></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsShelf',
  data() {
    return {
      itemId: null
    }
  }
}
</script>

<style scoped>

</style>
