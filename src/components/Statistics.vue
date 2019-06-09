<template>
  <div class="container-fluid align-middle">
      <div class = "row">
        <div class = "col text-center">
          <h1>STATISTICS</h1>
        </div>
      </div>
      <div class = "row">
        <div class = "col text-center">
          [Work in progress]
        </div>
      </div>
  </div>
</template>

<script>
  import userService from '../../services/userService'
  export default {
    name: 'Login',
    data () {
      return {
        user: null,
        userError: false,
        userExist: false
      }
    },
    methods: {
      async getUser () {
        let response
        try{
          response = await (userService.getUser(this.user))
        }
        catch (err){
          response = err.response
        }
        finally {
          if (response.data.content) {
              this.userExist = true
              this.$emit('logged', this.user)
            }
          else {
            this.user = null
            this.userError = true
            }
        }
      },

      deleteBorder(){
        this.userError = false
      }
    }
  }
</script>

<style>

</style>
