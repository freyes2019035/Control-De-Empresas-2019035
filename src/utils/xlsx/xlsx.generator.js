'use strict'
const moment = require('moment')
const fs = require('fs')
const xls = require('json2xls')
exports.generateXLSX = (data) => {
    return new Promise((resolve, reject) => {
        let today = moment().format('YYYY-MM-DD HH:mm:ss');
        let xlsxPath = `./company_data/xlsx/companyReport_${data[0].company}_${today}.xlsx`
        let excel = xls(data, {fields: ['name', 'position', 'departament', 'company']});
        fs.writeFileSync(xlsxPath, excel, 'binary');
        resolve(xlsxPath);
    })
}