'use strict'
const xlsx = require('exceljs');
// const moment = require('moment');
let workbook = new xlsx.Workbook();
let worksheet = workbook.addWorksheet('Empleados')
// let today = moment().format('D MMM, YYYY');
// const obj = [
//     {
//         "_id": "602ad2d03a21c12bff34b8cc",
//         "name": "Maria",
//         "position": "police",
//         "departament": "security",
//         "company": "6026f2bf2480af24793ce209",
//         "__v": 0
//     },
//     {
//         "_id": "602c1d5986d3a33b5c18f765",
//         "name": "Jhonny",
//         "position": "police Boss",
//         "departament": "security",
//         "company": "6026f2bf2480af24793ce209",
//         "__v": 0
//     }
// ]
worksheet.columns = [
    {header: 'Name', key: 'name'},
    {header: 'Position', key: 'position'},
    {header: 'Departament', key: 'departament'},
    {header: 'Company ID', key: 'company'},
]
worksheet.columns.forEach(column => {
    column.width = column.header.length < 23 ? 23 : column.header.length
})
worksheet.getRow(1).font = {bold: true}

exports.generateXLSX = (data) => {
    return new Promise((resolve, reject) => {
        let xlsxPath = `./company_data/xlsx/companyReport_${data[0].company}.xlsx`
        
        data.forEach((e, index) => {
            const rowIndex = index + 2
            worksheet.addRow({
            ...e,
            amountRemaining: {
                formula: `=C${rowIndex}-D${rowIndex}`
            },
            percentRemaining: {
                formula: `=E${rowIndex}/C${rowIndex}`
            }
            })
        });
        workbook.xlsx.writeFile(xlsxPath)
        resolve(xlsxPath)
    })
}
