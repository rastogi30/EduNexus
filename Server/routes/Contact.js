const express = require("express")
const router = express.Router()
const  {contactUsController}  = require("../controllers/contactkaro")

router.post("/contact", contactUsController)

module.exports = router