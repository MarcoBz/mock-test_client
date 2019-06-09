import axios from 'axios'
const port = process.env.PORT || 4000
const url = "https://protected-mesa-49093.herokuapp.com"
export default() => {
  return axios.create({
    //baseURL: `http://localhost:` + port + '/api'
    baseURL: url + '/api'
  })
}
