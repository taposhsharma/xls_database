<template>
    <div>
      <div style="width: 800px">
        <canvas id="acquisitionsCanvas"></canvas>
      </div>
    </div>
  </template>
  
  <script>
  import Chart from "chart.js/auto";
  
  export default {
    props: ["dataset", "label"],
  
    data() {
      return {
        chartInstance: null, // Store the chart instance
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
        const data = this.dataset;
        const canvas = document.getElementById("acquisitionsCanvas");
  
        this.chartInstance = new Chart(canvas, {
          type: 'polarArea',
          data: {
            labels: data.map((row) => row.label),
            datasets: [
              {
                label: `Acquisitions by ${this.label}`,
                data: data.map((row) => row.count),
                fill: false,
                backgroundColor: data.map(() => `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`),
                tension: 0.1,
              },
            ],
          },
        });
      },
    },
  };
  </script>
  