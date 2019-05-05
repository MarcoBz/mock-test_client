const PDFJS = require('pdfjs-dist/webpack') ;
function readPDF(files){
  return new Promise(function(resolve, reject){
    let fileReader = new FileReader()
    fileReader.onload = function(){
      resolve(fileReader.result)
    }
    fileReader.readAsArrayBuffer(files)
  })
}

export async function pdfParsing (files) {

  let buffer = await readPDF(files)
  let typedarray = new Uint8Array(buffer)
  let pdf = await PDFJS.getDocument(typedarray)
  let allRows = []
  for (let i = 0; i < pdf._pdfInfo.numPages; i++){
    let page = await pdf.getPage(i+1)
    let text = await page.getTextContent()
    let rows = text.items.map(c => c.str)
    allRows = allRows.concat(rows)
  }
  return allRows
}

export default{
  pdfParsing
}
