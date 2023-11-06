<template>
  <div class="container-fluid">
    <div v-if="xlsxData">
      <h2>XLSX Data:</h2>
      <div class="myTable position-relative">
        <div class="tableHead" ref="tableHead" @scroll="scrollBoth('head')">
          <div class="tr">
            
            <div
              class="th py-2"
              v-for="(column, index) in xlsxData[0]"
              :key="index"
            >
              <input
                v-model="xlsxData[0][index]"
                ref="editingInput"
                class="form-control"
                v-if="isEditing(0, index)"
              />
              <p
                v-else
                @click="startEditing(0, index)"
                class="data thdata fw-bold mb-0 text-uppercase"
              >
                {{ xlsxData[0][index] }}
              </p>
              <button class="btn btn-danger" @click="deleteColumn(index)">
                Delete
                <!-- <i class="fa-solid fa-arrow-down"></i> -->
              </button>
            </div>
            <div class="th colFixed "></div>
          </div>
        </div>
        <div class="tableBody" ref="tableBody" @scroll="scrollBoth('body')">
          <div
            class="tr"
            v-for="(item, rowIndex) in displayedItems"
            :key="rowIndex"
          >
            
            <div
              class="td py-2"
              v-for="(value, colIndex) in item"
              :key="colIndex"
            >
              <input
                v-if="isEditing(rowIndex + 1, colIndex)"
                v-model="item[colIndex]"
                class="form-control"
                ref="editingInput"
              />
              <p
                v-else
                @click="startEditing(rowIndex + 1, colIndex)"
                class="data mb-0"
              >
                {{ value !== "" ? value : "-" }}
              </p>
            </div>
            <div class="td colFixed">
              <button class="btn btn-danger" @click="deleteRow(rowIndex + 1)">
                Delete
              </button>
            </div>
          </div>
        </div>
        <div class="navigation">
          <button
            class="mybtn"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            <img src="../assets/left.png" />
          </button>
          {{ currentPage }}
          <button
            class="mybtn"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            <img src="../assets/right.png" />
          </button>
        </div>

        <div class="threebutton">
          <button
            class="btn btn-outline-primary deleteButton"
            @click="goToDelete()"
          >
            Go to Delete
          </button>
          <button class="mymargin1" @click="saveXLS" v-if="xlsxData">
            SAVE
          </button>
          <!-- vscode-file://vscode-app/usr/share/code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html -->
          <button class="mymargin1" @click="createXLS" v-if="xlsxData">
            DOWNLOAD
          </button>
          <button class="mymargin1" @click="openChart" v-if="xlsxData">
            CHART
          </button>

          <button class="btn btn-outline-primary addRow" @click="addNew()">
            Add Row
          </button>

          <button class="btn btn-outline-primary addCol" @click="newColoumn()">
            Add Column
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import axios from "axios";
// import { Toast } from 'bootstrap';

export default {
  data() {
    return {
      id: null,
      xlsxData: null,
      filename: null,
      showModal: false,
      selectedFile: null,
      xlsFile: null,
      keys: null,
      creatingXLS: false,
      editing: { rowIndex: -1, colIndex: -1 },
      itemsPerPage: 50,
      currentPage: 1,
    };
  },

  mounted() {
    this.id = this.$route.params["id"];
    this.filename = this.$route.params["filename"];
    this.getFile(this.id);
  },
  computed: {
    displayedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData().slice(start, end);
    },
    totalPages() {
      return Math.ceil((this.xlsxData.length - 1) / this.itemsPerPage);
    },
  },
  methods: {
    openModal() {
      this.showModal = true;
      document.addEventListener("click", this.closeModalOnOutsideClick);
    },
    closeModal() {
      this.showModal = false;

      document.removeEventListener("click", this.closeModalOnOutsideClick);
    },
    closeModalOnOutsideClick(event) {
      if (!event.target.closest(".modal-content")) {
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
    deleteColumn(col) {
      for (let i = 0; i < this.xlsxData.length; i++) {
        this.xlsxData[i].splice(col, 1);
      }
      if (this.xlsxData[0].length === 0) {
        this.xlsxData = [];
      }
      console.log(col);
    },

    deleteRow(row) {
      this.xlsxData.splice(row, 1);
      console.log(row);
    },
    filteredData() {
      return this.xlsxData.slice(1); // Exclude the first row
    },
    readXLSXFile(blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        this.xlsxData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        //         if(this.xlsxData.length>0){
        // this.keys = Object.keys(this.xlsxData[0]);
        //         }
      };
      reader.readAsArrayBuffer(blob);
    },
    getFile(id) {
      axios
        .get("http://localhost:3001/contact/download/" + id, {
          responseType: "blob",
        })
        .then((response) => {
          console.log(response);
          this.selectedFile = response.data;
          this.readXLSXFile(this.selectedFile);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    isEditing(rowIndex, colIndex) {
      return (
        this.editing.rowIndex === rowIndex && this.editing.colIndex === colIndex
      );
    },
    startEditing(rowIndex, colIndex) {
      this.editing = { rowIndex, colIndex };
      this.$nextTick(() => {
        const inputRef = this.$refs.editingInput;

        if (inputRef) {
          console.log(inputRef);
          inputRef[0].focus();
        }
      });
    },
    addNew() {

      let newRow = [];
      for (let i = 0; i < this.xlsxData[0].length; i++) {
        newRow.push("");
      }
      this.xlsxData.push(newRow);
      this.editing = { rowIndex: -1, colIndex: -1 };
      this.currentPage = this.totalPages;
      this.nextPage();
      const body = this.$refs.tableBody;
      setTimeout(() => {
        body.scrollTop = body.scrollHeight;
       
      }, 0);
      
    },
    newColoumn() {
      console.log("NEw column called")
      let name = "-";
      if (this.xlsxData.length === 0) {
        this.xlsxData.push([]);
      }
      //  this.xlsxData.push([])
      console.log(this.xlsxData[0]);
      this.xlsxData[0].push(name);
      for (let i = 1; i < this.xlsxData.length; i++) {
        this.xlsxData[i].push("");
      }
      this.editing = { rowIndex: -1, colIndex: -1 };
      const body = this.$refs.tableBody;
      const head = this.$refs.tableHead;
      // console.log("Actual and view width of head:", head.scrollWidth);
      // console.log("Actual and view width of body:", body.scrollWidth);

      setTimeout(() => {
        body.scrollLeft = body.scrollWidth;
        head.scrollLeft = head.scrollWidth;
      }, 0);
      // body.scrollRight = 0;
      // head.scrollRight = 0;
    },

    createXLS() {
      if (this.xlsxData) {
        const ws = XLSX.utils.aoa_to_sheet(this.xlsxData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
        XLSX.writeFile(wb, this.filename);
      }
    },

    saveXLS() {
      if (this.xlsxData) {
        const ws = XLSX.utils.aoa_to_sheet(this.xlsxData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

        // Create a FormData object
        const buffer = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "buffer",
        });

        // Create a Blob from the buffer
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Create a FormData object and append the Blob
        const formData = new FormData();
        formData.append("file", blob, this.filename);

        // Send the XLSX file to the backend
        axios
          .post("http://localhost:3001/contact/saveFile/" + this.id, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((response) => {
            this.openModal();
            console.log(response);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    openChart() {
      this.$router.push("/contactChart/" + this.id);
    },

    scrollBoth(element) {
      // console.log(element);
      const body = this.$refs.tableBody;
      const head = this.$refs.tableHead;
      if (element === "body") {
        // console.log(body);
        // console.log(head);
        head.scrollLeft = body.scrollLeft;
      } else {
        body.scrollLeft = head.scrollLeft;
      }
    },

    goToDelete() {
      const body = this.$refs.tableBody;
      const head = this.$refs.tableHead;
      // console.log("Actual and view width of head:", head.scrollWidth);
      // console.log("Actual and view width of body:", body.scrollWidth);

   
        body.scrollLeft = body.scrollWidth;
        head.scrollLeft = head.scrollWidth;
     
    },
  },
};
</script>

<style scoped>
@import "font-awesome/css/font-awesome.min.css";
* {
  box-sizing: border-box;
}
.tableBody {
  /* overflow-x: scroll; */
  /* overflow-x: auto; */
  /* width: 100vw; */
  overflow: scroll;
  width: 99vw;
  position: relative;
  height: 70vh;
  margin: 0 auto;
}
.tableHead {
  display: flex;
  overflow: scroll;
  width: 99vw;
  position: relative;
  margin: 0 auto;
  /* scroll-behavior: smooth; */
  /* flex-wrap: nowrap;
  overflow-x: auto; */
  /* width: 100%; */
}
.tr {
  display: flex;
  /* overflow-x: auto; */
}
.th,
.td {
  flex: 0 0 300px;
  background-color: #8e44ad;
  color: white;
  margin-right: 4px;
  margin-bottom: 4px;
}
.th {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  /* padding:10px; */
}
.td {
  background: rgb(255, 255, 255, 0.5);
  color: hsl(282, 100%, 17%);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ::-webkit-scrollbar{
  width: 0;
  height: 0;
}

::-webkit-scrollbar-thumb {
  background: transparent;
} */

.tableHead::-webkit-scrollbar {
  width: 0;
  height: 0px;
}
.tableHead::-webkit-scrollbar-thumb {
  background: transparent;
}

.tableBody::-webkit-scrollbar-thumb {
  background: rgb(128, 128, 128);
  border-radius: 17px;
}
.tableBody::-webkit-scrollbar {
  width: 0;
  height: 0.4rem;
}
.data {
  padding: 5px;
}
.mymargin1 {
  margin-right: 20px;

  padding: 10px;
  background-color: #9b59b6; /* $fl-lpurple */
  border: 0;
  outline: 0;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  margin-top: 3px;
  height: 40px;
  width: 100px;
  top: 0;
  right: 0;
  transition: transform 0.15s ease-in-out, box-shadow 0.35s linear,
    height 0s linear, margin-top 0s linear, width 0s linear;
  transform: translateX(25px);
  box-shadow: 0px 5px 15px rgba(255, 64, 129, 0.2); /* $fl-pink */
}
.mymargin1:hover {
  height: 50px;
  margin-top: 0px;
  width: 100px;
}
.threebutton {
  margin-top: 20px;
  text-align: center;
  position: relative;
}

.threebutton .deleteButton {
  position: absolute;
  right: 0;
  margin-top: 0;
}

.threebutton .addRow {
  position: absolute;
  left: 0;
  margin-top: 0;
}
.threebutton .addCol {
  position: absolute;
  left:100px;
  margin-top: 0;
}

.colFixed {
  flex: 0 0 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.deleteButton:hover {
 
  color: #8e44ad;
  border-color: #8e44ad;
  background-color: white;
}
.deleteButton {
  margin-top: 20px;
  color: white;
  border-color: #8e44ad;
  background-color: #8e44ad;
}

.addRow:hover {
 
 color: #8e44ad;
 border-color: #8e44ad;
 background-color: white;
}
.addRow {
 margin-top: 20px;
 color: white;
 border-color: #8e44ad;
 background-color: #8e44ad;
}
.addCol:hover {
 
 color: #8e44ad;
 border-color: #8e44ad;
 background-color: white;
}
.addCol {
 margin-top: 20px;
 color: white;
 border-color: #8e44ad;
 background-color: #8e44ad;
}
.navigation {
  text-align: center;
}
.mybtn {
  cursor: pointer;
  background: none;
  border: none;
}
.newmargin {
  margin: 10px;
}
</style>
