function readJson(files){
  return new Promise(function(resolve, reject){
    let fileReader = new FileReader()
    fileReader.onload = function(){
      resolve(JSON.parse(fileReader.result))
    }
    fileReader.readAsText(files)
  })
}

export async function jsonParsing (files) {
  let jsonObject = await readJson(files)
  let allRows = []
  for (let i = 0; i < jsonObject.length; i++) {
    let pointers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    allRows.push({
      'question': jsonObject[i].question,
      'answers': [],
      'correctAnswer': jsonObject[i].correctAnswer
    })
    let answers = []
    for (let j = 0; j < jsonObject[i].answers.length; j++) {
      answers.push({
        'pointer': pointers[j],
        'answer': jsonObject[i].answers[j]
      })
    }
    allRows[i]['answers'] = answers
  }
  return allRows
}

export default{
  jsonParsing
}

