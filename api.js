const api = require("express").Router()
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const inquiryRoutes = require("./routes/inquiryRoutes")
const saleRoutes = require("./routes/saleRoutes")
const invoiceRoutes = require("./routes/invoiceRoutes")
const commissionRoutes = require("./routes/commissionRoutes")
const callRoutes = require("./routes/callRoutes")
const isLoggedIn = require("./middleware/isLoggedIn")

api
    .use('/auth', authRoutes)
    .use('/users', isLoggedIn, userRoutes)
    .use('/inquiries', isLoggedIn, inquiryRoutes)
    .use('/sales', isLoggedIn, saleRoutes)
    .use('/calls', isLoggedIn, callRoutes)
    .use('/invoice', isLoggedIn, invoiceRoutes)
    .use('/commission', isLoggedIn, commissionRoutes)

module.exports = api