<template>
  <div>
    <form @submit.prevent="handleFileUpload">
      <input type="file" accept=".xls,.xlsx" @change="onFileChange" />
      <button type="submit">Upload</button>
    </form>
    <div v-if="showData">
      <h2>File Data:</h2>
      <pre>{{ fileData }}</pre>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import * as XLSX from "xlsx";

export default {
  data() {
    return {
      selectedFile: null,
      showData: false,
      fileData: null,
    };
  },
  methods: {
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    handleFileUpload() {
      if (this.selectedFile) {
        this.showData = true;
        this.readFile();
        console.log(this.fileData);
      }
    },
    readFile() {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        this.fileData = XLSX.utils.sheet_to_json(worksheet, {
          header: firstSheetName,
        });
        axios
          .post("http://localhost:3000/contact/save", this.fileData)
          .then((response) => {
            console.log("POST request successful");
            console.log("Response:", response.data);
          })
          .catch((error) => {
            console.error("POST request error:", error);
          });
      };
      reader.readAsArrayBuffer(this.selectedFile);
    },
  },
};
</script>
