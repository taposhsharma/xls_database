<template>
  <div>
    <NavBar/>
    <router-view></router-view>

    <!-- <contact-chart/> -->
  </div>
</template>

<script>
// import ContactChart from './components/ContactChart.vue';
import NavBar from './components/NavBar.vue';


// import UploadFile from './components/UploadFile.vue';
// import CreateFIle from './components/CreateFIle.vue';
export default {
  name: 'App',
  components: {
    NavBar,
    // ContactChart
}
}
</script>

<style>
#app {
  
}
</style>
