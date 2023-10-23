<template>
  <div>
    <NavBar/>
    <router-view></router-view>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';


// import UploadFile from './components/UploadFile.vue';
// import CreateFIle from './components/CreateFIle.vue';
export default {
  name: 'App',
  components: {
    NavBar
}
}
</script>

<style>
#app {
  
}
</style>
