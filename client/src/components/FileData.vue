<template>
    <div class="container-fluid mybody">
      <div v-if="xlsxData">
      <h2>XLSX Data:</h2>
      <div class="row">
        <div class="col-12">
          <div class="table-container">
            <table class="table">
      <thead>
        <tr>
          <th v-for="(column, index) in  xlsxData[0]" :key="index">
            <div class="row data" >
              <div class="col-8">
                <div v-if="isEditing(0, index)">
              <input v-model="xlsxData[0][index]" 
              ref="editingInput"/>
            </div>
            <div v-else @click="startEditing(0, index)"
             >{{ xlsxData[0][index] }}</div>
              </div>
              <div class="col-2">
                <button class="btn btn-outline-danger" @click="deleteColumn(index)" > <img src="../assets/bin.png"/></button>
              </div>
            </div>
           
            
            </th>

            <th></th>
            <th>
              <div >
          <button class="btn btn-outline-primary" @click="newColoumn()"><img src="../assets/add.png"/></button>
        </div>
            </th>
        </tr>
        
      </thead>
      <tbody>
        <tr v-for="(item, rowIndex) in displayedItems" :key="rowIndex"  >
              
          <td v-for="(value, colIndex) in item" :key="colIndex">
            <div v-if="isEditing(rowIndex+1, colIndex)" class="data">
              <input v-model="item[colIndex]" 
              ref="editingInput"/>
            </div>
            <div v-else @click="startEditing(rowIndex+1, colIndex)"
            class="data" >{{ value!==''? value : "-" }}</div>
          </td>
          <td>
            <button class="btn btn-outline-danger" @click="deleteRow(rowIndex+1)">
              <img src="../assets/bin.png"/>
              </button>
            <!-- {{ rowIndex }} -->
          </td>
          
        
        </tr>
        <tr  v-if="totalPages==currentPage || (totalPages === 0 && xlsxData.length>0)">
          <button class="btn btn-outline-primary newmargin" @click="addNew()"><img src="../assets/add.png"/></button>
        </tr>
      
      </tbody>
    </table>

          </div>
      
         
        </div>
      
      </div>
      <!-- {{ xlsxData.length }}
      currentPage :{{ currentPage }}
      totalPages :{{ totalPages }} -->
      <div class="navigation">
      <button class="mybtn" @click="previousPage" :disabled="currentPage === 1"><img src="../assets/left.png"/> </button>
      {{ currentPage }}
    <button class="mybtn" @click="nextPage" :disabled="currentPage === totalPages "><img src="../assets/right.png"/></button>
  </div>
    </div>

    <div>
      <button class=" btn btn-outline-primary mymargin1" @click="saveXLS" v-if="xlsxData" >
      Save
     
    </button>
    <button class=" btn btn-outline-primary" @click="createXLS" v-if="xlsxData" >
      Downlaod
     
    </button>
  
  </div>
    </div>
    <!-- <div v-if="xlsxData">
      <h2>File Data:</h2>
      <pre>{{ xlsxData }}</pre>
    </div> -->


 
<!-- Modal -->
<!-- Button trigger modal -->
<!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Launch demo modal
</button> -->

<!-- Modal -->
<div class="modal fade" :class="{ 'show': showModal }" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content" >
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Notification</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"  @click="closeModal"></button>
      </div>
      <div class="modal-body">
        File Saved Successfully
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"  @click="closeModal">Close</button>
        
      </div>
    </div>
  </div>
</div>
<!-- <div class="modal fade" :class="{ show: showModal }" tabindex="-1" role="dialog"  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title"></h5>
        
      
      </div>
      <div class="modal-body">
       File Saved Successfully.
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
       
      </div>
    </div>
  </div>
</div> -->
</template>

<script>
import * as XLSX from 'xlsx';
import axios from 'axios';
// import { Toast } from 'bootstrap';


export default {
  data() {
    return {
      id:null,
      xlsxData: null,
      filename:null,
      showModal: false,
      selectedFile: null,
      xlsFile: null,
      keys:null,
      creatingXLS: false,
      editing:{rowIndex:-1, colIndex:-1},
      itemsPerPage: 50,
      currentPage: 1,
    };

  },

  mounted(){
    this.id = this.$route.params['id']
    this.filename = this.$route.params['filename']
      this.getFile(this.id)
      
  },
  computed: {
    
    displayedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData().slice(start, end);
    },
    totalPages() {
      return Math.ceil((this.xlsxData.length -1) / this.itemsPerPage);
    },
  },
  methods: {
    openModal() {
      this.showModal = true;
      document.addEventListener('click', this.closeModalOnOutsideClick);
    },
    closeModal() {
      this.showModal = false;
      
      document.removeEventListener('click', this.closeModalOnOutsideClick);
    },
    closeModalOnOutsideClick(event) {
      if (!event.target.closest('.modal-content')) {
        this.closeModal();
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    deleteColumn(col){
      for(let i = 0; i<this.xlsxData.length; i++){
            this.xlsxData[i].splice(col,1)
           }
           if(this.xlsxData[0].length===0){
            this.xlsxData=[]
           }
          console.log(col)
    },

    deleteRow(row){
     this.xlsxData.splice(row, 1); 
     console.log(row)
    },
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

        this.xlsxData = XLSX.utils.sheet_to_json(worksheet, { header:1 });
//         if(this.xlsxData.length>0){
// this.keys = Object.keys(this.xlsxData[0]);
//         }
        
        
      };
      reader.readAsArrayBuffer(blob);
    },
    getFile(id) {
      axios.get('http://localhost:3001/contact/download/' + id, { responseType: 'blob' })
        .then((response) => {
          console.log(response)
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
          let newRow =[]
          for (let i = 0; i < this.xlsxData[0].length; i++) {
            newRow.push('')
          }
       this.xlsxData.push(newRow)
       this.editing={rowIndex:-1, colIndex:-1}
    },
    newColoumn(){
           let name = "-"
           if(this.xlsxData.length===0){
             this.xlsxData.push([])
           }
          //  this.xlsxData.push([])
           console.log(this.xlsxData[0])
           this.xlsxData[0].push(name)
           for(let i = 1; i<this.xlsxData.length; i++){
            this.xlsxData[i].push("")
           }
           this.editing={rowIndex:-1, colIndex:-1}
    },


    createXLS() {
      if(this.xlsxData){
        
        const ws = XLSX.utils.aoa_to_sheet(this.xlsxData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, this.filename);
       }
       
      },



      saveXLS() {
  if (this.xlsxData) {
    const ws = XLSX.utils.aoa_to_sheet(this.xlsxData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
    
    // Create a FormData object
    const buffer = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'buffer' });

      // Create a Blob from the buffer
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

      // Create a FormData object and append the Blob
      const formData = new FormData();
      formData.append('file', blob, this.filename);


    // Send the XLSX file to the backend
    axios.post('http://localhost:3001/contact/saveFile/'+this.id, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
    this.openModal()
      console.log(response);

    })
    .catch((error) => {
      console.error(error);
    });
  }
}


  },
};
</script>


<style scoped>

.newtr{
  min-height: 50px;
}
.table-container {
  min-width: 100%;
 /* Set the desired width for the container */
  overflow-x: auto; 
}

table {
  width: auto;
 
  border-collapse: collapse;
}

th, td {
  /* border: 1px solid #ddd; /* Add borders for cells if needed */
  /* padding: 8px;
  text-align: left;  */
  width:500px

}
tr{
  
}
.data{
  min-width:300px
}

.mybody{
  padding:20px
}
.newmargin{
  margin-top: 30px
}
.navigation{
  text-align: center;
}
.mybtn{
  cursor: pointer;
  background: none;
  border: none;
}
.mymargin1{
  margin-right:20px
}
.modal.show {
  display: flex;
}

.modal-content{
  width:500px
}

</style>