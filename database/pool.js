import pg from 'pg'

const HOST = process.env.HOST
const USER = process.env.USERNAME
const PASS = process.env.PASSWORD
const DATABASE = process.env.DATABASE

export const pool = new pg.Pool({
    host: HOST,
    user: USER,
    password: PASS,
    database: DATABASE,
    port: 5432
})