<template>
  <div class="container main">

    <h1 class="heading">
      Upload Your File Here
    </h1>
    <div
      class="dropzone"
      @dragover="dragOver"
      @dragleave="dragLeave"
      @drop="drop"
    >
    <div class="row fileUpload">
      <div class="col-12">
        <p class="uploadPara">Drag & Drop a .xls or .xlsx file here or click to browse</p>
      </div>
      <div class="col-12 " >
        <label for="fileInput" class="custom-file-label" ></label>
      <input type="file" id="fileInput" class="custom-file-input" ref="fileInput" @change="onFileChange" accept=".xls,.xlsx" />
      </div>
    </div>
    
    
    </div>
    <div v-if="selectedFile" class="selectedFile">
      <p class="selectedPara"><b>Selected File:</b> {{ selectedFile.name }}</p>
      <button class="btn btn-primary btn-lg" @click="handleFileUpload">Upload</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    dragOver(e) {
      e.preventDefault();
      this.$refs.fileInput.style.display = 'block';
      this.$refs.fileInput.style.border = '2px dashed #333';
    },
    dragLeave(e) {
      e.preventDefault();
      this.$refs.fileInput.style.display = 'none';
      this.$refs.fileInput.style.border = '';
    },
    drop(e) {
      e.preventDefault();
      this.$refs.fileInput.style.display = 'block';
      this.$refs.fileInput.style.border = '';
      const file = e.dataTransfer.files[0];
      if (file) {
        this.onFileChange(e,file);
      }
    },
    
    onFileChange(event,file) {
      if(file){
        this.selectedFile = file
      }
      else{
        this.selectedFile = event.target.files[0];
      }
     
      console.log(this.selectedFile)
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
          })
          .catch((error) => {
            console.error("File upload error:", error);
          });
      }
    },
  },
};
</script>

<style scoped>
.main{

  margin-top:20px

}

.dropzone {
  border: 2px dashed #aaa;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  
  padding: 20px;
  /* cursor: pointer; */
  height: 500px;
}

.dropzone p {
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
}
.custom-file-input {
  visibility: hidden;
  position: absolute;
}

/* Style the custom label */
.custom-file-label {
  background-color: slategrey;
  color: #fff;
  border: 1px solid slategrey;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
}

/* Hide the "No file chosen" text */
.custom-file-label::after {
  font-size:20px;
  content: "Browse";
}

.fileUpload{
  text-align: center;
}
.uploadPara{
  font-size: 40px;
  padding: 20px;
  color: #aaa;
}
.heading{
  text-align: center;
  margin-bottom: 20px;
  color:gray
}
.selectedFile{
  text-align: center;
  margin-top:30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.selectedPara{
  font-size: 30px;
  margin-right: 50px;
  margin-top: 10px;
}
</style>
