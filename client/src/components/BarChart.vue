<template>
  <div>
    <div style="width: 1400px;">
      <canvas id="acquisitionsCanvas1"></canvas>
      <div class="mybtn">
      <button class="btn btn-outline-success generateButton" @click="downloadChart">Download Chart</button>
    </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props: ['dataset','label'],

  data() {
    return {
      chartInstance: null,
      plugin :{
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const {ctx} = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
}, // Store the chart instance
    };
  },

  watch: {
    dataset() {
      if (this.chartInstance) {
        this.chartInstance.destroy(); // Destroy the old chart
      }
      this.renderChart();
    },
  },

  mounted() {
    this.renderChart();
  },

  methods: {
    renderChart() {
      const data = this.dataset[0];
      const newData = []
      for(let i = 0 ; i< this.dataset.length; i++){
        let color;
        if(i ===0 ){
          color= '#c48edb'
          
        }
        else{
          color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`
        }
      const mydata =   {
          label:`Acquisitions by ${this.label[i]}`,
          data:this.dataset[i].map(row=>row.count),
          backgroundColor: [
      color
    ],
        }

        newData.push(mydata)
      


      }
      const canvas = document.getElementById('acquisitionsCanvas1');

      this.chartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: data.map(row => row.label),
          datasets:newData
        },
        options: {
    plugins: {
      customCanvasBackgroundColor: {
        color: 'white',
      }
    }
  },
  plugins: [this.plugin],
       
      });
    },
    downloadChart() {
      if (this.chartInstance) {
        // Get the canvas element
          const chartCanvas = document.getElementById('acquisitionsCanvas1');

    // Create a new canvas with a white background
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = chartCanvas.width;
    canvas.height = chartCanvas.height;
    ctx.fillStyle = 'white'; // Set the background color to white
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the existing chart on the new canvas
    ctx.drawImage(chartCanvas, 0, 0);
    const image = canvas.toDataURL('image/png');

        // Create an "a" element to trigger the download
        const a = document.createElement('a');
        a.href = image;
        a.download = 'chart.png';
        a.style.display = 'none';

        // Append the "a" element to the document and simulate a click event
        document.body.appendChild(a);
        a.click();

        // Clean up by removing the "a" element
        document.body.removeChild(a);
      }
    },
  },
};
</script>

<style scoped>
.mybtn{
  text-align: center;

  margin-bottom: 40px;
  margin-top:40px
}
.generateButton {
  
  color: #8e44ad;
  border-color: #8e44ad;
}
.generateButton:hover{
  color: white;
  background-color: #8e44ad;

}
</style>
