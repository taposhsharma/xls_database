<template>
  <div class="container main">
   <h1 class="head">All Files</h1>
    <div v-if="filePaths.length > 0" class="row">
      <div v-for="(file, index) in filePaths" :key="index" class="col-4">
        <div class="card link " >
          <div class="row" v-if="!this.edit"> 
            <div class="col-8" > 
  <div class="card-body " @click="getFile(file._id,file.filePath.split('/')[1])">
    <h5 class="card-title">{{ file.filePath.split('/')[1] }}</h5>
    
  </div> 
</div>
 
  <div class="col-1">
    <div class="button-container">
    <button class="btn btn-outline-primary mybtn" @click="editfile(file.filePath.split('/')[1])" > <img src="../assets/pen.png"/></button>
    <button class="btn btn-outline-danger mybtn" @click="deletefile(file._id)" > <img src="../assets/bin.png"/></button>
  </div>
    
  </div>
 
</div>
<div v-else>
  <div class="card-body " >
    <input v-model="editname"/>
  <button class="btn btn-primary btn-sm mysavebtn" @click="save(file._id)">Save</button>
    
  </div> 
  
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
      editname:null,
      selectedFile: null,
      xlsFile: null,
      creatingXLS: false,
      edit:false
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
    getFile(id,filename) {
     
        this.$router.push('/fileData/'+id+'/'+filename)
    },
    createXLS() {
      if(this.xlsxData){
        const ws = XLSX.utils.json_to_sheet(this.xlsxData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, 'data.xlsx');
       }
       
      },
      deletefile(id){
        console.log(id)
        axios.get('http://localhost:3001/contact/delete/'+id)
        .then(resposne=>{
          console.log(resposne)
          this.filePaths = this.filePaths.filter(file => file._id !== id)

        })
        .catch(err=>{
          console.log(err)

        })
      },
      editfile(name){
        // console.log(name.split(".xlsx"))
        this.editname= name.split(".xlsx")[0]
        this.edit = true

      },
      save(id){
        console.log(id)
        const data={
          newFileName: this.editname+'.xlsx'
        }

        axios.post('http://localhost:3001/contact/edit/'+id,data)
        .then(res=>
           console.log(res)
        )
        .catch(err=>
        console.log(err)
        )


        this.filePaths = this.filePaths.filter(file=>{
         
          if(file._id===id){
            file.filePath = 'uploads/'+this.editname+'.xlsx'
          }
          return file
        })
        this.edit = false
      }
   
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
.mybtn{
  margin-top:10px;
  margin-right:10px
}
.button-container {
  display: flex;
  justify-content: space-between;  /* Adjust this to your preferred alignment */
}
.mysavebtn{
  margin-left:20px  ;
}
</style>
