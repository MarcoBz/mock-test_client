<template>
  <div id="app">
    <header>
      <!-- Fixed navbar -->
      <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="navbar-brand"><u>Mock Test Creator</u></div>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" @click="quickTestFunction">Quick Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" @click="loadTestFunction">Load Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" >Save Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" @click="createQuestionsFunction">Create Questions</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <main role="main" class="container main">
      <div class= "row">
        <div class= "col col-md-12">
          <!-- <Login @logged="getUser" v-if="!user"/> -->
          <createQuestions  v-if="user && components.createQuestions" v-bind:user="user" @createQuestions= "showTable" ref="createQuestions"/>
          <showTable  v-if="user && components.showTable" v-bind:user="user" v-bind:allRows="allRows" v-bind:testName="testName" v-bind:modules="modules" @refresh="clear"/>
          <loadTest  v-if="user && components.loadTest" v-bind:user="user" @gotQuestions="showTest"/>
          <showTest  v-if="user && components.showTest" v-bind:user="user" v-bind:allQuestions="allQuestions" v-bind:testName="testName" v-bind:modules="modules" v-bind:saveResults="saveResults" v-bind:testSettings="testSettings"/>
          <quickTest v-if="user && components.quickTest"  v-bind:user="user" @gotQuestions="showTest"/>
        </div>
      </div>
    </main>
    <footer class="fixed-bottom">
      <div class="container-fluid footer">
        <span class="text-muted text-center">Powered by MarcoBz</span>
      </div>
    </footer>
  </div>
</template>

<script>
import Login from './components/Login'
import CreateQuestions from './components/CreateQuestions'
import ShowTable from './components/ShowTable'
import ShowTest from './components/ShowTest'
import LoadTest from './components/LoadTest'
import QuickTest from './components/QuickTest'
export default {
  name: "App",
  components: {
    Login,
    CreateQuestions,
    ShowTable,
    LoadTest,
    ShowTest,
    QuickTest
  },

  data () {
    return {
      user: "marco_bz",
      allRows: null,
      allQuestions: [],
      components: {
        createQuestions: true,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: false
      },
      testName: null,
      modules: [],
      testSettings: null,
      
      saveResults: false
    }
  },
  methods: {

    clear(){
      if(this.$refs.createQuestions) this.$refs.createQuestions.clearAll()
      this.modules= []
      this.testName= null
      this.allRows= null
      this.allQuestions= []
      this.testSettings= null
      this.saveResults= false
      this.components= {
        createQuestions: true,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: false,
        quickTest: false
      }
    },

    clearTestInfo(){
      this.testName = null
      this.modules = []
      this.allRows = null
      this.testSettings= null
      this.saveResults= false
    },

    getUser(value){
      this.user = value
    },

    createQuestionsFunction(){
      this.components = {
        createQuestions: true,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: false,
        quickTest: false
      } 
      this.clearTestInfo()
    },

    loadTestFunction(){
      this.components = {
        createQuestions: false,
        login: false,
        showTable: false,
        loadTest: true,
        showTest: false,
        quickTest: false
      } 
      this.clearTestInfo()
    },

    quickTestFunction(){
      this.components = {
        createQuestions: false,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: false,
        quickTest: true
      } 
      this.clearTestInfo()
    },

    showTable(value){
      this.clearTestInfo()
      this.testName = value.test
      this.modules = value.modules
      this.allRows = value.rows
      this.components = {
        createQuestions: false,
        login: false,
        showTable: true,
        loadTest: false,
        showTest: false,
        quickTest: false
      }
    },

    showTest(value){
      this.clearTestInfo()
      this.testName = value.test
      this.modules = value.modules
      this.allQuestions = value.allQuestions
      this.testSettings = value.testSettings
      this.saveResults = value.saveResults
      this.components = {
        createQuestions: false,
        login: false,
        showTable: false,
        loadTest: false,
        showTest: true,
        quickTest: false
      }
    }

  }

}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #f5f5f5;
}

.main{
  margin-bottom: 60px;
}

</style>
