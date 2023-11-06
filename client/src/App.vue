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
/* html{
  background-color: #ffffff;
opacity: 0.8;
background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 10px ), repeating-linear-gradient( #ededee55, #ededee );
} */
/* body{
  overflow: hidden;
} */
#app {
  background: transparent;
  background-color: #ffffff;
opacity: 0.8;
background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 10px ), repeating-linear-gradient( #ededee55, #ededee );
min-height: 100vh ;
height: 100%;


}
/* .topDiv{
  background: transparent;
  background-color: #ffffff;
opacity: 0.8;
background-image:  repeating-radial-gradient( circle at 0 0, transparent 0, #ffffff 10px ), repeating-linear-gradient( #ededee55, #ededee );
height: 100vh;

} */
</style>
