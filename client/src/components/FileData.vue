<template>
    <div class="container">
      <div v-if="xlsxData">
      <h2>XLSX Data:</h2>
      <table class="table">
      <thead>
        <tr>
          <th v-for="column in  keys" :key="column">{{ column}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in xlsxData" :key="rowIndex"  >
          
          <td v-for="(value, colIndex) in item" :key="colIndex">
            <div v-if="isEditing(rowIndex+1, colIndex)">
              <input v-model="item[colIndex]" 
              ref="editingInput"/>
            </div>
            <div v-else @click="startEditing(rowIndex+1, colIndex)"
             >{{ value!==''? value : "Enter Here...." }}</div>
          </td>
        
        </tr>
        <button @click="addNew()">New Row</button>
      </tbody>
    </table>

    <div v-if="xlsxData">
      <h2>File Data:</h2>
      <pre>{{ xlsxData }}</pre>
    </div>
    </div>

    <div>
    <button @click="createXLS" v-if="xlsxData" >
      Downlaod
     
    </button>
  
  </div>
    </div>
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';

export default {
  data() {
    return {
      xlsxData: null,
      
      selectedFile: null,
      xlsFile: null,
      keys:null,
      creatingXLS: false,
      editing:{rowIndex:-1, colIndex:-1},
    };

  },

  mounted(){
      
      this.getFile(this.$route.params['id'])
  },
  methods: {
    filteredData() {
      return this.xlsxData.slice(1); // Exclude the first row
    },
    readXLSXFile(blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        this.xlsxData = XLSX.utils.sheet_to_json(worksheet, { header:0 });
        this.keys = Object.keys(this.xlsxData[0]);
        
      };
      reader.readAsArrayBuffer(blob);
    },
    getFile(id) {
      axios.get('http://localhost:3001/contact/download/' + id, { responseType: 'blob' })
        .then((response) => {
          this.selectedFile = response.data;
          this.readXLSXFile(this.selectedFile);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    isEditing(rowIndex, colIndex) {
      return this.editing.rowIndex === rowIndex && this.editing.colIndex === colIndex;
    },
    startEditing(rowIndex, colIndex) {
      this.editing = { rowIndex, colIndex };
      this.$nextTick(() => {
        const inputRef = this.$refs.editingInput;
        
        if (inputRef) {
          console.log(inputRef)
         inputRef[0].focus()
        }
      });
      
    },
    addNew(){
          let newRow ={}
          for (let i = 0; i < this.keys.length; i++) {
            newRow[this.keys[i]] = ''

}

       this.xlsxData.push(newRow)
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

.newtr{
  min-height: 50px;
}

</style>