import express from 'express'
import session from 'express-session'
import flash from 'express-flash'
import passport from 'passport'
import LocalStrategy from 'passport-local'
import bcrypt from 'bcryptjs'
import url from 'url'
import path from 'path'
import { router } from './routes/router.js'
import { pool } from './database/pool.js'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")

app.use(express.static(__dirname + '/public'))
app.use(flash())
app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.session())
app.use(express.urlencoded({extended: false}))
app.use("/", router)

app.post("/log-in", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/log-in',
    failureFlash: true
}))

async function connectDB() {
    const test = await pool.query("SELECT * FROM members")
    if(test.rows[0]) {
        console.log("connected to database: success")
    }
}
connectDB()

passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM members WHERE username = $1", [username]);
        const user = rows[0];
  
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" })
        } 

        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [id]);
      const user = rows[0];
  
      done(null, user);
    } catch(err) {
      done(err);
    }
  });

app.listen(3000, () => console.log("app listening on port 3000"))