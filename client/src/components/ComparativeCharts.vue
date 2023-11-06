<template>
  <div class="container main">
    <form @submit.prevent="">
      <div class="mb-3">
        <label for="chartType" class="form-label">Select Chart Type:</label>
        <select v-model="selectedChartType" id="chartType" class="form-select">
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
         
        </select>
      </div>
    </form>
    <div class="row" v-if="selectedChartType">
      <!-- {{ chartData }} -->
      <div v-for="(item, index) in noOfFiles" :key="index" :class="myclass">
        <form @submit.prevent="">
          <div class="mb-3">
            <label for="selectfile" class="form-label">Select file:</label>
            <select
              v-model="selectedFiles[index]"
              id="selectfile"
              class="form-select"
              @change="searchData(selectedFiles[index], index)"
            >
              <option v-for="(item, i) in filePaths" :key="i" :value="item._id">
                {{ item.filePath.split("/")[1] }}
              </option>
            </select>
          </div>
        </form>
        <!-- {{ data[index] }} -->

        <form @submit.prevent="" v-if="selectedFiles[index]">
          <div class="mb-3">
            <label for="data" class="form-label">Select Field:</label>
            <select
              v-model="selectedData[index]"
              id="data"
              class="form-select"
              @change="fileData(index)"
            >
              <option v-for="(item, i) in keys[index]" :key="item" :value="i">
                {{ item }}
              </option>
            </select>
          </div>
        </form>
        <button class="btn btn-danger" @click="removeFile(index)">Remove File</button>
      </div>
      <div>
     
    </div>
    
    
    </div>

  

    <div class="mybtn position-relative">
      <button @click="addFile()" v-if="noOfFiles !== 4 && selectedChartType" class="twobutton">
        Add File to compare
      </button>
      <button v-if="generate && noOfFiles >0" @click="generateChart()" class="twobutton position-absolute right-0">Generate Chart</button>
    </div>

    <div>
      <!-- {{ selectedFiles }} -->
    </div>

    <div class="container myClass">
      <line-chart
        :dataset="dataset"
        :label="labels"
        v-if="dataset && selectedChartType === 'line' && showChart"
      />
      <bar-chart
        :dataset="dataset"
        :label="labels"
        v-if="dataset && selectedChartType === 'bar' && showChart"
      />
 
    </div>
  </div>
</template>
<script>
import * as XLSX from "xlsx";
import axios from "axios";
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';

// import { useRouter } from 'vue-router'

export default {
  components: { BarChart, LineChart },
  data() {
    return {
      selectedChartType: null,
      fileIndex: null,
      dataset:null,
      labels:null,
      noOfFiles: 1,
      myclass: "col-12",
      xlsxData: null,
      filePaths: [],
      editname: null,
      data: [],
      keys: [],
      selectedFiles: [""],
      filenames:[''],
      selectedData: [],
      xlsFile: null,
      creatingXLS: false,
      edit: null,
      chartData: [],
      showChart:false,
      generate:false
    };
  },
  watch: {
    noOfFiles() {
      if (this.noOfFiles === 2) {
        this.myclass = "col-6";
      } else if (this.noOfFiles === 3) {
        this.myclass = "col-4";
      } else if (this.noOfFiles === 4) {
        this.myclass = "col-3";
      }else if(this.noOfFiles==1){
        this.myclass = "col-12"
      }
    },
    selectedChartType(){
      this.showChart = false
    }
    //  selectedFiles(){
    //     console.log(this.selectedFiles)
    //  }
  },
  mounted() {
    this.downloadFiles();
  },
  methods: {


    removeFile(index){
      console.log(index)
      this.noOfFiles -= 1;
     
        this.selectedFiles.splice(index,1);
        this.data.splice(index,1);
        this.filenames.splice(index,1)
        this.keys.splice(index,1);
        this.selectedData.splice(index,1);
        this.chartData.splice(index,1);
        if(this.noOfFiles === 0){
          this.showChart = false
        }
        else{
          this.generateChart()
        }
       
    },

    alignAndFillData(...arrays) {
      // Combine labels from all arrays to create a set of unique labels
      const allLabels = new Set(
        arrays.flatMap((arr) => arr.map((item) => item.label))
      );

      // Create a mapping of labels to their respective objects in each array
      const dataMaps = arrays.map(
        (arr) => new Map(arr.map((item) => [item.label, item]))
      );

      // Iterate over unique labels and add corresponding objects with count 0 if missing in each array
      const alignedArrays = arrays.map((arr, index) => {
        return Array.from(allLabels).map((label) => {
          const obj = dataMaps[index].get(label) || { label, count: 0 };
          return obj;
        });
      });

      return alignedArrays;
    },
    countOccurrences(arr, targetValue) {
      return arr.reduce(
        (count, value) => (value === targetValue ? count + 1 : count),
        0
      );
    },

    fileData(i) {
      // console.log(i)
      // console.log(this.selectedData[i])
      // console.log(this.data[i])
      this.generate = true
      const index = this.selectedData[i];
      const dataSet = this.data[i][this.keys[i][index]];
      // console.log(dataSet)

      let data1 = [];
      const fields = new Set(dataSet);
      //  console.log(fields)
      for (const item of fields) {
        // console.log(item);
        const count = this.countOccurrences(dataSet, item);
        const obj = {
          label: item,
          count: count,
        };
        data1.push(obj);
        // console.log(data)
      }

      this.chartData[i] = data1;
      // console.log(this.chartData);
      // console.log(this.alignAndFillData(...this.chartData));
    },
    searchData(id, i) {
      if (id) {
        // console.log(i)
        this.fileIndex = i;


        // console.log(this.filePaths)

        const file = this.filePaths.filter(row => row._id === id)

        this.filenames[i] = file[0].filePath.split("/")[1]
               console.log(this.filenames)
        this.getFile(id);
    
        
        // console.log(this.xlsxData)
        // console.log(id)
      }
    },
    addFile() {
      if (this.noOfFiles === 4) {
        alert("Only upto 4 files at once.");
      } else {
        this.noOfFiles += 1;
        this.selectedFiles.push("");
        this.data.push([]);
        this.filenames.push('')
        this.keys.push([]);
        this.selectedData.push("");
        this.chartData.push([]);
      }
    },
    getFile(id) {
      axios
        .get("http://localhost:3001/contact/download/" + id, {
          responseType: "blob",
        })
        .then((response) => {
          //   console.log(response)
          this.selectedFile = response.data;
          this.readXLSXFile(this.selectedFile);
          // console.log(this.xlsxData)
        
        })
        .catch((err) => {
          console.error(err);
        });
    },
    async downloadFiles() {
      try {
        const response = await axios.get(
          "http://localhost:3001/contact/allData"
        );
        this.filePaths = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    readXLSXFile(blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonWorksheet = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        // // Transpose the data to get it column-wise
        const transposedData = this.transpose(jsonWorksheet);

        this.xlsxData = transposedData;
        this.data[this.fileIndex] = this.xlsxData;
        this.keys[this.fileIndex] = Object.keys(this.xlsxData);
        if(this.selectedData[this.fileIndex]){
          this.fileData(this.fileIndex)
        }
      };
      reader.readAsArrayBuffer(blob);
    },
    transpose(matrix) {
      // console.log(matrix)
      let arr = {};
      for (let i = 0; i < matrix[0].length; i++) {
        arr[matrix[0][i]] = [];
        for (let j = 1; j < matrix.length; j++) {
          arr[matrix[0][i]].push(matrix[j][i]);
        }
      }
      // console.log(arr)
      return arr;
    },
    // getFile(id,filename) {

    //     this.$router.push('/fileData/'+id+'/'+filename)
    // },
    createXLS() {
      if (this.xlsxData) {
        const ws = XLSX.utils.json_to_sheet(this.xlsxData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");
        XLSX.writeFile(wb, "data.xlsx");
      }
    },
    deletefile(id) {
      console.log(id);
      axios
        .get("http://localhost:3001/contact/delete/" + id)
        .then((resposne) => {
          console.log(resposne);
          this.filePaths = this.filePaths.filter((file) => file._id !== id);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editfile(name, index) {
      // console.log(name.split(".xlsx"))
      this.editname = name.split(".xlsx")[0];
      this.edit = index;
      console.log(this.edit);
    },
    save(id) {
      console.log(id);
      const data = {
        newFileName: this.editname + ".xlsx",
      };

      axios
        .post("http://localhost:3001/contact/edit/" + id, data)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      this.filePaths = this.filePaths.filter((file) => {
        if (file._id === id) {
          file.filePath = "uploads/" + this.editname + ".xlsx";
        }
        return file;
      });
      this.edit = false;
    },
    generateChart() {

      this.showChart=false
      
      const data = this.alignAndFillData(...this.chartData);
      this.dataset = data
      this.labels = this.filenames;
       console.log(this.dataset && this.selectedChartType === 'bar' && this.showChart)

       this.showChart=true
      // console.log(data);
    },

  },
};
</script>
<style scoped>
.main{
  color:#9b59b6;
  padding-top:20px
}
.myClass{
 display: flex;
 justify-content: center;
 align-items: center;

 margin-top: 50px ;
 padding-bottom: 50px;
}
.mybtn{
  /* display: flex; */
  /* justify-content: space-between; */
  margin-top:20px

}

.twobutton {
  /* margin-right: 20px; */
 
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
    width: 200px;
    top: 0;
    right: 0;
    transition: transform 0.15s ease-in-out, box-shadow 0.35s linear, height 0.0s linear, margin-top 0.0s linear, width 0.0s linear;
    /* transform: translateX(25px); */
    box-shadow: 0px 5px 15px rgba(255, 64, 129, 0.2); /* $fl-pink */
}
.twobutton:hover {
  height: 50px;
    margin-top: 0px;
    width: 200px;
    
}
</style>
