import { body, validationResult } from 'express-validator'
import passport from 'passport'
import bcrypt from 'bcryptjs'
import { pool } from '../database/pool.js'
import { showAllMembers, showAllPosts, deletePostFromDB } from '../database/queries.js'
import { render } from 'ejs'

export async function getHomepage (req, res) {
        console.log(req.user)
        const allPosts = await showAllPosts()
        res.render("index", {user: req.user, posts: allPosts})
    }

export async function getSignUp (req, res) {
    res.render("sign-up")
}

export async function postSignUp (req, res, next) {
    let membershipState;
    if(req.body.membership === "secret") {
        membershipState = 'yes'
    } else {
        membershipState = 'no'
    }
    let adminState;
    if(req.body.isadmin === "iamadmin") {
        adminState = 'yes'
    } else {
        adminState = 'no'
    }
    let password = req.body.password
    let confirmedPassword = req.body.passwordConfirm
    if(password == confirmedPassword) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                return next(err)
                }
                await pool.query("INSERT INTO members (first_name, last_name, username, password, membership, admin) VALUES ($1, $2, $3, $4, $5, $6)", [ req.body.firstName, req.body.lastName, req.body.username, hashedPassword, membershipState, adminState]);
                console.log("Adding New User:", req.body.firstName, req.body.lastName, req.body.username, hashedPassword, membershipState, adminState)
                res.redirect('/')
              }); 
    } else {
        console.log('password error')
        res.redirect('/sign-up')
    }
}

export async function logOut (req, res, next) {
    req.logout((err) => {
        if(err) {
            return next(err)
        }
        res.redirect("/")
    })
}

export async function getLogIn (req, res, next) {
    res.render("log-in", {user: req.user})
}


export async function getNewPost (req, res, next) {
    res.render("new-post", {user: req.user})
}

export async function postNewPost(req, res, next) {
    if(req.user) {
        let timestamp = new Date()

        console.log("Creating New Post:", req.body.title, req.body.content, req.user.username, timestamp)

        await pool.query("INSERT INTO posts (title, content, author, posted) VALUES ($1, $2, $3, $4)", [ req.body.title, req.body.content, req.user.username, timestamp]);
        res.redirect('/')
    } else {
        return next(null, false, { message: "Must be signed in to post!" });
    }
}

export async function deletePost(req, res, next) {
    const postID = req.body.delete
    await deletePostFromDB(postID)
    res.redirect('/')
}