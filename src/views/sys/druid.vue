<template>
  <iframe :src="baseURL" width="100%" height="800px" frameborder="0" scrolling="auto" />
</template>

<script>
export default {
  name: 'Druid',
  data() {
    return {
      baseURL: process.env.VUE_APP_BASE_API + '/druid/sql.html'
    }
  }
}
</script>

<style scoped>

</style>
