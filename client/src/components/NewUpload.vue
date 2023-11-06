<template>
    <div class="container main">
    <div class="upload">
      <div class="upload-field" @dragover.prevent="onDragOver" @dragleave="onDragLeave" @drop.prevent="onDrop" :class="{ 'drag-over': isDragOver }">
        <div class="icon-field">
          <span class="fa fa-file-o"></span>
          <p>Drag your files here</p>
        </div>

      </div>
      <div class="upload-status">
        <h1>File upload</h1>
        <div class="file" v-if="selectedFile">
          <div class="file-description" >
            <div class="file-name" >{{ selectedFile.name }}</div>
            <div class="file-size">{{(selectedFile.size/(1024 * 1024)).toFixed(2)}} mb</div>
          </div>
          <div class="file-status">
            <div class="status-field">
              <div class="status-line" style="width: 100%"></div>
            </div>
          </div>
        </div>
      
       <div style="margin-top: 20px;"> 
        <form onsubmit="return false;">
         
         <input type="button" value="UPLOAD" id="upload-btn" class="focus-out" @click="handleFileUpload()">
         <input type="file" ref="fileInput" style="display: none" @change="selectFiles"  accept=".xls,.xlsx"/>
       <button class="browse-button focus-out"  @click="openFileInput">BROWSE</button>
       </form>
       </div>
       
      </div>
    </div>
    <p class="uploadPara">Drag & Drop a .xls or .xlsx file here or click to browse</p> 
  </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        selectedFile:null,
        
        isDragOver: false,
      };
    },
    methods: {
        openFileInput() {
      this.$refs.fileInput.click();
    },
    selectFiles(event) {
      const files = event.target.files[0];
      console.log('Selected file(s):', files);
     this.handleSelectedFiles(files)
    },
  
      onDragOver() {
        this.isDragOver = true;
      },
      onDragLeave() {
        this.isDragOver = false;
      },
      onDrop(event) {
        this.isDragOver = false;
        const files = event.dataTransfer.files;
        const excelFiles = Array.from(files).filter((file) =>
  /\.(xls|xlsx)$/i.test(file.name) || file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')
);

      if (excelFiles.length > 0) {
        // Handle the selected Excel files
        this.handleSelectedFiles(excelFiles[0]);
      } else {
        // Display an error or message for unsupported file types
        alert('Please select only .xls and .xlsx files.');
      }
  
        // Handle the dropped files
        
      },
      handleSelectedFiles(files) {
        // Process the dropped files here
        console.log(files)
        this.selectedFile = files
        console.log(this.selectedFile)
        // for (const file of files) {
        //   console.log('Dropped file:', file.name);
        //   // You can perform further actions with the dropped file here
        // }
      },
      handleFileUpload() {
      if (this.selectedFile) {
        console.log(this.selectedFile)
        const formData = new FormData();
        formData.append('jelllll',"dfkjdkfj")
        formData.append("file", this.selectedFile);
        console.log(formData.file)

        axios
          .post("http://localhost:3001/contact/save", formData)
          .then((response) => {
            console.log("File uploaded successfully");
            console.log("Response:", response.data);
            alert("file Uploaded Successfully")
          })
          .catch((error) => {
            console.error("File upload error:", error);
          });
      }
      else{
        alert('No file selected')
      }
    },
      
    },
  
  };
  </script>
  
  <style scoped>
   @import 'font-awesome/css/font-awesome.min.css';
  
  
   @import url('https://fonts.googleapis.com/css?family=Ubuntu:400,300,500,600,700');
  
  /* Colors */
  body {
    width: 100vw;
    min-height: 100vh;
    display: block;
    position: relative;
    z-index: 0;
    background-image: linear-gradient(35deg, #ccc, #e9e9e9);
    font-family: 'Ubuntu';
  }
  
  main {
    width: 100%;
    max-width: 960px;
    margin: 50px auto;
    position: relative;
    display: block;
    z-index: 1;
  }
  
  p#inspired-by {
    text-align: center;
    position: absolute;
    top: -50px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  a {
    text-decoration: none;
    color: #e67e22; /* $fl-orange */
  }
  .browse-button {
    background-color: #9b59b6; /* $fl-lpurple */
    border: 0;
    outline: 0;
    border-radius: 20px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
  
    margin-top: 2px;
    height: 36px;
    width: 80px;
    top: 0;
    right: 0;
    transition: transform 0.15s ease-in-out, box-shadow 0.35s linear, height 0.0s linear, margin-top 0.0s linear, width 0.0s linear;
    transform: translateX(25px);
    box-shadow: 0px 5px 15px rgba(255, 64, 129, 0.2); /* $fl-pink */
}
.browse-button:hover {
    height: 40px;
    margin-top: 0px;
    width: 80px;
  }
  .upload {
    width: 520px;
    height: 400px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    background-color: transparent;
  }
  
  h1, p {
    margin: 0;
  }
  
  .upload-field {
    width: 75%;
    height: 100%;
    background-image: linear-gradient(15deg, #8e44ad, #9b59b6); /* $fl-purple, $fl-lpurple */
    border-radius: 5px;
    position: absolute;
    z-index: 4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #bdc3c7; /* $fl-smoke */
    box-shadow: 0px 10px 40px rgba(0, 0, 0, 0);
    pointer-events: hover;
    cursor: pointer;
    animation: fadeInUp 1s;
  }
  
  .icon-field {
    width: 60%;
    height: 65%;
    padding: 10px;
    border: 4px dashed #bdc3c7; /* $fl-smoke */
    font-size: 30px;
    text-align: center;
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: transform 0.2s linear;
  }
  
  .icon-field:hover {
    transform: scale(1.05);
  }
  
  .icon-field span {
    font-size: 90px;
    transform: rotateY(180deg) translateX(20px);
  }
  
  .icon-field p {
    font-weight: 500;
  }
  
  .upload-status {
    position: absolute;
    display: block;
    z-index: 5;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 60%;
    height: 80%;
    padding: 25px 45px;
    background-color: #fff;
    box-shadow: 0px 10px 75px rgba(0, 0, 0, 0.5);
  }
  
  h1 {
    text-transform: uppercase;
    font-size: 20px;
    text-align: center;
    margin: 15px 0px;
    color: #34495e; /* $fl-lnightblue */
  }
  
  .file {
    height: 50px;
    width: 100%;
    position: relative;
    margin: 8px 0px;
  }
  
  .file-description {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
  }
  .uploadPara{
  font-size: 40px;
  padding: 20px;
  margin-top:40px;
  color: #aaa;
  text-align: center;
}
  .file-name {
    color: #6e6e6e;
    font-weight: 500;
  }
  
  .file-size {
    font-size: 13px;
    text-transform: lowercase;
    color: #2ecc71; /* $fl-lgreen */
  }
  
  .file-status {
    width: 100%;
    height: 5px;
    margin-top: 10px;
  }
  
  .status-field {
    background-color: #e9e9e9;
    height: 5px;
    width: 100%;
    border-radius: 2.5px;
    position: relative;
    overflow: hidden;
  }
  
  .status-line {
    transition: background-image 0.2s linear;
    max-width: 100%;
    min-width: 1%;
    height: 100%;
    background-color: #9b59b6; /* $fl-lpurple */
    background-image: linear-gradient(0deg, #8e44ad 50%, #9b59b6 50%); /* $fl-purple, $fl-lpurple */
    animation: loading 1.5s;
  }
  
  .file:hover .file-status .status-field .status-line {
    background-image: linear-gradient(0deg, #d35400 50%, #e67e22 50%); /* $fl-dorange, $fl-orange */
  }
  
  form {
    width: 100%;
    height: 50px;
    position: relative;
    display: block;
  }
  
  input[type="text"] {
    box-sizing: border-box;
    display: block;
    position: absolute;
    height: 40px;
    border: 0;
    outline: 0;
    padding: 10px 10px;
    padding-right: 0px;
    border-radius: 20px;
    border: 1px solid #ccc;
  }
  
  input[type="text"]:focus, input[type="text"]:active {
    border: 1px solid #9b59b6; /* $fl-lpurple */
    outline: 0;
  }
  
  input[type="button"] {
    background-color: #9b59b6; /* $fl-lpurple */
    border: 0;
    outline: 0;
    border-radius: 20px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    display: block;
    position: absolute;
    margin-top: 2px;
    height: 36px;
    width: 80px;
    top: 0;
    right: 0;
    transition: transform 0.15s ease-in-out, box-shadow 0.35s linear, height 0.0s linear, margin-top 0.0s linear, width 0.0s linear;
    transform: translateX(25px);
    box-shadow: 0px 5px 15px rgba(255, 64, 129, 0.2); /* $fl-pink */
  }
  
  input[type="button"].focus-out {
    transform: translateX(0px);
    box-shadow: 0px 5px 15px transparent;
  }
  
  input[type="button"]:hover {
    height: 40px;
    margin-top: 0px;
    width: 80px;
  }
  
  @keyframes loading {
    from {
      max-width: 0%;
    }
    20% {
      max-width: 40%;
    }
    60% {
      max-width: 60%;
    }
    to {
      max-width: 100%;
    }
  }
  
  .main{
    margin-top:50px;
    margin-bottom:50px
  }
  </style>
  