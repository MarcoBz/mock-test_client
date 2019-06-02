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
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}" >Quick Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}">Load Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}">Save Test</a>
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
          <createQuestions  v-if="user && components.createQuestions" v-bind:user="user" @createQuestions= "createTable"/>
          <createTable  v-if="user && components.createTable" v-bind:user="user" v-bind:allRows="allRows" />
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
import CreateTable from './components/CreateTable'
export default {
  name: "App",
  components: {
    Login,
    CreateQuestions,
    CreateTable
  },

  data () {
    return {
     user: "marco_bz",
     modules: [],
     test: null,
     allRows: null,
     components: {
        createQuestions: true,
        login: false,
        createTable: false
     }
    }
  },
  methods: {
    getUser(value){
      this.user = value
    },

    createQuestionsFunction(){
      this.components = {
        createQuestions: true,
        login: false,
        createTable: false
      } 
      this.test = null
      this.modules = []
      this.allRows = null
    },

    createTable(value){
      this.test = value.test
      this.modules = value.modules
      this.allRows = value.rows
      this.components = {
        createQuestions: false,
        login: false,
        createTable: true
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
