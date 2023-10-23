<template>
  <div class="container main">
   <h1 class="head">All Files</h1>
    <div v-if="filePaths.length > 0" class="row">
      <div v-for="(file, index) in filePaths" :key="index" class="col-4">
        <div class="card link" @click="getFile(file._id)">

  <div class="card-body">
    <h5 class="card-title">{{ file.filePath.split('/')[1] }}</h5>
   
  </div>
</div>
        <!-- <button @click="getFile(file._id)">File {{ index + 1 }}</button> -->
</div>
</div>
  </div>
  

    

</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';
// import { useRouter } from 'vue-router'

export default {
  data() {
    return {
      xlsxData: null,
      filePaths: [],
      selectedFile: null,
      xlsFile: null,
      creatingXLS: false,
    };
  },
  mounted(){
      this.downloadFiles()
  },
  methods: {
    async downloadFiles() {
      try {
        const response = await axios.get('http://localhost:3001/contact/allData');
        this.filePaths = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    readXLSXFile(blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        this.xlsxData = XLSX.utils.sheet_to_json(worksheet, { header:0 });
      };
      reader.readAsArrayBuffer(blob);
    },
    getFile(id) {
     
        this.$router.push('/fileData/'+id)
    },
    createXLS() {
      if(this.xlsxData){
        const ws = XLSX.utils.json_to_sheet(this.xlsxData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, 'data.xlsx');
       }
       
      },
   
  },
};
</script>


<style scoped>
.main{
  margin-top:30px;
}
.link{
  cursor: pointer;
  margin-bottom:20px
}
.head{
  text-align: center;
  margin-bottom: 20px;
}
</style>
