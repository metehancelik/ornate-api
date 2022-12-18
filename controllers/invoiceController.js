const path = require('path');
const pdf = require('html-pdf');
const pdfTemplate = require('../utils/pdfTemplate');
const catchAsync = require("../utils/catchAsync");

exports.createPDF = catchAsync(async (req, res) => {
  pdf.create(pdfTemplate(req.body), {}).toFile('public/result.pdf', (err) => {
    if (err) {
      res.send(Promise.reject());
    }
    res.send(Promise.resolve());
  });

})

exports.getPDF = catchAsync(async (req, res) => {

  const opt = {
    root: path.join(__dirname, '../public')
  }
  res.sendFile(`result.pdf`, opt)
})
