import * as Papa from 'papaparse';

Papa.parsePromise = function(file) {
    return new Promise(function(complete, error) {
        Papa.parse(file, {delimiter: "$", complete, error});
    })
}

export async function csvParsing (files) {
  let results = await Papa.parsePromise(files)
  return csvToJson(results.data)
}

function csvToJson (csvFile) {
  let jsonFile = []
  for (let i = 0; i < csvFile.length; i++) {
    let pointers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
    jsonFile.push({
      'question': csvFile[i][0],
      'answers': [],
      'correctAnswer': csvFile[i][csvFile[i].length - 1]
    })
    let answers = []
    for (let j = 1; j < csvFile[i].length - 1; j++) {
      answers.push({
        'pointer': pointers[j - 1],
        'answer': csvFile[i][j]
      })
    }
    jsonFile[i]['answers'] = answers
  }
  return jsonFile
}

export default {
  csvParsing
}
