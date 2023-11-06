import { createRouter, createWebHistory } from 'vue-router';

// import UploadFileVue from './components/UploadFile.vue';
import CreateFIleVue from './components/CreateFIle.vue';
import ContactChart from './components/ContactChart.vue'
// import FileData from './components/FileData.vue'
import tryIn from './components/tryIn.vue'
import ComparativeChartsVue from './components/ComparativeCharts.vue';
import NewUpload from "./components/NewUpload.vue"


const routes =[

    // {path:'/',component:UploadFileVue},
    {path:'/allFiles', component:CreateFIleVue},
    // {path:'/fileData/:id/:filename',component:FileData},
    {path:'/fileData/:id/:filename',component:tryIn},
    {path:'/contactChart/:id',component: ContactChart},
    {path:'/charts', component:ComparativeChartsVue},
    {path:'/', component:NewUpload}
  
]




const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;
