<template>
  <div class="container main">
   <h1 class="head">All Files</h1>
    <div v-if="filePaths.length > 0" class="row">
      <div v-for="(file, index) in filePaths" :key="index" class="col-12">
        <div class="card link " >
          <div class="row" v-if="this.edit!==index"> 
            <div class="col-8" > 
  <div class="card-body " @click="getFile(file._id,file.filePath.split('/')[1])">
    <h5 class="card-title">{{ file.filePath.split('/')[1] }}</h5>
    
  </div> 
</div>
 
  <div class="col-4">
    <div class="button-container">
    <button class="btn btn-outline-primary mybtn" @click="editfile(file.filePath.split('/')[1],index)" > <img src="../assets/pen.png"/> EDIT</button>
    <button class="btn btn-outline-danger mybtn" @click="deletefile(file._id)" > <img src="../assets/bin.png"/> DELETE</button>
  </div>
    
  </div>
 
</div>
<div v-else>
  <div class="card-body " >
    <div class="row">
      <div class="col-10">
        <input v-model="editname" class="form-control"/>
      </div>
      <div class="col-2">
        <button class="btn btn-outline-primary   mysavebtn" @click="save(file._id)">Save</button>
      </div>
    </div>
   
 
    
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
      edit:null
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
      editfile(name,index){
        // console.log(name.split(".xlsx"))
        this.editname= name.split(".xlsx")[0]
        this.edit = index
        console.log(this.edit)

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
  margin-bottom:20px;
  border-left: 3px solid  #8e44ad;
  /* border: 1px solid  #8e44ad; */
  transition: all 0.5s ease;
}

.link:hover{

  border-left: 6px solid  #8e44ad;
  color: #8e44ad;
  transform: scale(1.01) ;
  transition: all 0.2s ease;
 
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
  justify-content: right;  /* Adjust this to your preferred alignment */
}
.mysavebtn{
  margin-left:20px  ;
  color:#8e44ad;
  border-color: #8e44ad;
}
.mysavebtn:hover{
  color: white;
  background-color: #8e44ad;
}
</style>
