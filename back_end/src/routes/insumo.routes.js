const express = require("express")
const router = express.Router()
const insumo = require("../controllers/insumo.controller")

router.get('/da', insumo)

module.exports = router