<template>
  <div id="file-drag-drop">
    <div class="container-fluid">
      <div class="row justify-content-md-center">
        <form ref="fileform">
            <span class="drop-files">Drop the file here!</span>
        </form>
      </div>
      <div class="row justify-content-md-center">
        <div  v-if="files" class="file-listing border">
          {{ files.name }}
        </div>
      </div>
      <div class="row">
        <div class="col col-md-3"></div>
        <div class="col col-md-3">
          <input class="btn" type="file" id="file" ref="file" v-on:change="handleFileUpload()" style="display: none;"/>
          <input type="button" class="btn margin-btn" value="Get File" onclick="document.getElementById('file').click();" />
        </div>
        <div class="col col-md-3">
          <button class="btn margin-btn" v-on:click="submitFiles()" v-bind:disabled="!files">Submit</button>
        </div>
        <div class="col col-md-3"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import parseCsv from '../utils/parseCsv'
  import parsePDF from '../utils/parsePDF'
  import parseJson from '../utils/parseJson'
  export default {
    name: 'DragAndDrop',
    data () {
      return {
        dragAndDropCapable: false,
        files: null
      }
    },

    mounted(){
      this.dragAndDropCapable = this.determineDragAndDropCapable();
      if( this.dragAndDropCapable ){

        ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach( function( evt ) {

          this.$refs.fileform.addEventListener(evt, function(e){
            e.preventDefault();
            e.stopPropagation();
          }.bind(this), false);
        }.bind(this));
        this.$refs.fileform.addEventListener('drop', function(e){
          this.$emit('changedFile')
          this.files= e.dataTransfer.files[0];
        }.bind(this));
      }
    },

    methods: {

      handleFileUpload(){
        this.files = this.$refs.file.files[0]
        this.$emit('changedFile')
      },

      clear(){
        this.dragAndDropCapable= false
        this.files= null
      },

      determineDragAndDropCapable(){
        var div = document.createElement('div');
        return ( ( 'draggable' in div )
                || ( 'ondragstart' in div && 'ondrop' in div ) )
                && 'FormData' in window
                && 'FileReader' in window;
      },

      submitFiles(){
        let extension = this.files.name.substring(this.files.name.lastIndexOf('.')+1, this.files.name.length) || this.name.files
        if (extension == "csv"){
          parseCsv.csvParsing(this.files)
          .then((allQuestions) => {
            this.$emit('parsedCsv', allQuestions)
          })
        }
        else if (extension == "pdf"){
          parsePDF.pdfParsing(this.files)
          .then((allRows) => {
            this.$emit('parsedPDF', allRows)
          })
        }
        else if (extension == "json"){
          parseJson.jsonParsing(this.files)
          .then((allRows) => {
            this.$emit('parsedJson', allRows)
          })
        }
      }
    }
  }
</script>




<style>

  form{
    display: block;
    height: 200px;
    width: 200px;
    background: #ccc;
    margin: auto;
    margin-top: 40px;
    text-align: center;
    line-height: 200px;
      border-radius: 4px;
  }
  button.submit-button{
    display: block;
    margin: auto;
    text-align: center;
    width: 200px;
    padding: 10px;
    text-transform: uppercase;
    background-color: #CCC;
    color: white;
    font-weight: bold;
    margin-top: 20px;
  }

  .margin-btn{
    margin: 10px
  }
</style>