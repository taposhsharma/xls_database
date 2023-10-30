import { createRouter, createWebHistory } from 'vue-router';

import UploadFileVue from './components/UploadFile.vue';
import CreateFIleVue from './components/CreateFIle.vue';
import ContactChart from './components/ContactChart.vue'
import FileData from './components/FileData.vue'


const routes =[

    {path:'/',component:UploadFileVue},
    {path:'/allFiles', component:CreateFIleVue},
    {path:'/fileData/:id/:filename',component:FileData},
    {path:'/contactChart/:id',component: ContactChart}
  
]




const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;
