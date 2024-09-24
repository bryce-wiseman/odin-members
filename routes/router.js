import express from 'express'
import passport from 'passport'
import { getHomepage, getSignUp, postSignUp, getLogIn, logOut, getNewPost, postNewPost, deletePost } from '../controllers/controller.js'

export const router = express.Router()

router.get("/", getHomepage)
router.get("/sign-up", getSignUp)
router.post("/sign-up", postSignUp)
router.get("/log-in", getLogIn)
router.get("/log-out", logOut)
router.get("/new-post", getNewPost)
router.post("/new-post", postNewPost)
router.post("/delete", deletePost)