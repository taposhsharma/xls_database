<template>
  <div>
    <CreateFIle/>
<UploadFile></UploadFile>
  </div>
</template>

<script>

import UploadFile from './components/UploadFile.vue';
import CreateFIle from './components/CreateFIle.vue';
export default {
  name: 'App',
  components: {
   UploadFile,
   CreateFIle
  }
}
</script>

<style>
#app {
  
}
</style>
