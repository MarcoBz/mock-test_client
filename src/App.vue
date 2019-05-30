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
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}">Quick Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}">Load Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}">Save Test</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" v-bind:class= "{disabled : !user}">Create Questions</a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <main role="main" class="container">
      <div class= "row">
        <div class= "col col-md-12">
          <!-- <Login @logged="getUser" v-if="!user"/> -->
          <createQuestions  v-if="user" v-bind:user="user" />
        </div>
      </div>
    </main>
    <footer class="footer">
      <div class="container">
        <span class="text-muted">Powered by MarcoBz</span>
      </div>
    </footer>
  </div>
</template>

<script>
import Login from './components/Login'
import CreateQuestions from './components/CreateQuestions'
import router from './router'
export default {
  name: "App",
  components: {
    Login,
    CreateQuestions
  },

  data () {
    return {
     user: "marco_bz"
    }
  },
  methods: {
    getUser(value){
      this.user = value
    },
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
</style>
