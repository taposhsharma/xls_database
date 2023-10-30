<template>
  <div class="container">

   
    <form @submit.prevent="">
          <div class="mb-3">
            <label for="chartType" class="form-label">Select Chart Type:</label>
            <select v-model="selectedChartType" id="chartType" class="form-select">
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="polar">Polar Chart</option>
            </select>
          </div>
         
        </form>
        <!-- v-if="selectedChartType === 'bar'" -->

        <form @submit.prevent="generateChart" v-if="selectedChartType">
          <div class="mb-3">
            <label for="data" class="form-label">Select Field:</label>
            <select v-model="selectedData" id="data" class="form-select" >
              <option v-for="(item, i) in keys" :key="item" :value="i">{{item}}</option>
             
            </select>
          </div>
          <div class="mb-3">
            <button type="submit" class="btn btn-outline-success">Generate Chart</button>
          </div>
        </form> 

     <div v-if="xlsxData">
      <!-- {{ keys }} -->

      <!-- {{ xlsxData.gender }} -->
      <!-- {{ new Set(xlsxData.gender) }} -->
     </div>
     <div class="container myClass">

      <line-chart :dataset="dataset" :label="keys[selectedData]" v-if="dataset  &&  selectedChartType === 'line' && showChart"/>
     <bar-chart :dataset="dataset" :label="keys[selectedData]" v-if="dataset  &&  selectedChartType === 'bar'  && showChart"/>
     <pie-chart :dataset="dataset" :label="keys[selectedData]" v-if="dataset  &&  selectedChartType === 'pie'  && showChart"/>
     <polar-chart :dataset="dataset" :label="keys[selectedData]" v-if="dataset  &&  selectedChartType === 'polar'  && showChart"/>
     </div>
  
  </div>
</template>

<script>
import * as XLSX from 'xlsx';

import axios  from 'axios';
import BarChart from './BarChart.vue';
import LineChart from './LineChart.vue';
import PieChart from './PieChart.vue';
import PolarChart from './PolarChart.vue';

export default {
  components: { BarChart, LineChart, PieChart, PolarChart },


  data() {
    return {
      selectedFile:'contact',
     selectedChartType:null,
     selectFile:null,
     xlsxData:null,
     keys:null,
     selectedData:null,
     dataset:null,
     showChart:false
    
    };
  },
mounted(){
  this.id = this.$route.params['id']
  this.getFile(this.id)
},
watch: {
    selectedData() {
    this.showChart = false
    },
    selectedChartType(){
      this.showChart = false
    }
  },

  methods:{
  
    generateChart(){
      // console.log(this.selectedData)
      this.showChart= true
      const index = this.selectedData
      const dataSet = this.xlsxData[this.keys[index]]
      // console.log(this.keys[data])
      // console.log(this.xlsxData[this.keys[data]].count('Male'))
      //  console.log(  this.isDateValid(this.xlsxData[this.keys[data]][0]))
      
      let data= []
       const fields = new Set(dataSet)
       console.log(fields)
       for (const item of fields) {
  // console.log(item);
  const count = this.countOccurrences(dataSet,item)
  const obj ={
    label:item,
    count:count
  }
  data.push(obj)
  // console.log(data)
}

this.dataset = data
console.log(data)
     


    },
    isDateValid(dateString) {
  const parsedDate = new Date(dateString);
  // Check if the parsed date is not "Invalid Date" and the input is not an empty string
  return !isNaN(parsedDate) && dateString.trim() !== "";
},
countOccurrences(arr, targetValue) {
  return arr.reduce((count, value) => (value === targetValue ? count + 1 : count), 0);
},
    selectMyFile(){
      this.selectFile=true
      // axios.get()

    },
    readXLSXFile(blob) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonWorksheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // // Transpose the data to get it column-wise
        const transposedData = this.transpose(jsonWorksheet);

        this.xlsxData = transposedData
        this.keys = Object.keys(this.xlsxData);
        console.log(this.xlsxData)
//         if(this.xlsxData.length>0){
// this.keys = Object.keys(this.xlsxData[0]);
//         }
        
        
      };
      reader.readAsArrayBuffer(blob);
    },
    transpose(matrix) {
      console.log(matrix)
      let arr={};
      for(let i = 0; i<  matrix[0].length; i++ ){
        arr[matrix[0][i]]=[]
        for(let j = 1; j< matrix.length;j++){
          arr[matrix[0][i]].push(matrix[j][i])
        }
          

      }
      console.log(arr)
      return arr
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

      }
  
};
</script>


<style scoped>
.myClass{
 display: flex;
 justify-content: center;
 align-items: center;

 margin-top: 50px ;
 margin-bottom: 50px;
}
</style>