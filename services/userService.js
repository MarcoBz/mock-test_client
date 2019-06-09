import Api from "./Api"

export function postUser (userName,availableTests) {
  let body = {
    userName : userName,
    availableTests: availableTests
  }
  const route = "user/" 
  return Api().post(route, body)
}

export function getUser (userName) {
  const route = "user/" + userName
  return Api().get(route)
}

export function patchUser (userName, op, path, value){
  let body = {
    op : op,
    path : path
  }

  if (value) body.value = value
  const route = "user/" + userName 
  return Api().patch(route, body)
}

export function postTest (userName, testName, testSettings, modules) {
  let body = {
    testName : testName,
    testSettings : testSettings,
    modules : modules
  }
  const route = "user/" + userName + "/test/"
  return Api().post(route, body)
}

export function getTest (userName, testName, property){

  let route

  if (testName){
    if (property) route = "user/" + userName + "/test/?testName=" + testName.split(' ').join('+') + "&property=" + property.split(' ').join('+') 
    else route = "user/" + userName + "/test/?testName=" + testName.split(' ').join('+')
  }

  else route = "user/" + userName + "/test/"
  return Api().get(route)
}

export function postResult (userName, testName, moduleName, testPoints, results){
  let body = {
    testName : testName,
    testPoints : testPoints,
    moduleName : moduleName,
    results: results
  }
  const route = "user/" + userName + "/result/"
  return Api().post(route, body)
}

export function getResult (userName, testName){

  let route

  if (testName) route = "user/" + userName + "/result/?testName=" + testName.split(' ').join('+')
  else route = "user/" + userName + "/result/"

  return Api().get(route)
}

export function patchTest (userName, testName, op, path, value){
  let body = {
    op : op,
    path : path
  }

  if (value) body.value = value
  const route = "user/" + userName + "/test/?testName=" + testName.split(' ').join('+')
  return Api().patch(route, body)
}

export default {
  getUser,
  postUser,
  getTest,
  postTest,
  getResult,
  postResult,
  patchTest,
  patchUser
}
