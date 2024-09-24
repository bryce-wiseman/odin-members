import { pool } from "./pool.js"

export async function showAllMembers () {
    console.log("All Members:")
    const { rows } = await pool.query("SELECT * FROM members")
    console.log(rows)
    return rows
}

export async function showAllPosts () {
    const { rows } = await pool.query("SELECT * FROM posts")
    return rows
}

export async function deletePostFromDB(id) {
    await pool.query(`DELETE FROM posts WHERE id = ` + id);
}