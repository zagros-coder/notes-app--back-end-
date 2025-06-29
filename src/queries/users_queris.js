import { pool } from '../../app.js';


export async function createUser(username,password){
    const [user] = await pool.query(`INSERT INTO users (username, password) 
    VALUES (?, ?)`,[username, password]);
    return user;
}

export async function getUserByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0]; // Return the first user found
}

export async function getUsers() {
    const [rows] = await pool.query('SELECT id,username,role FROM users order by id');
    return rows;    
}


export async function updateUserName(username,id){
    id = Number(id);
    if (isNaN(id)) {
        return false;
    }
    const [rows] = await pool.query("update users set username = ? where id = ?" , [username,id]);
    return rows;
}

export async function getAdminByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ? ', [username]);
    if (rows.length === 0) {
        return false; // No admin found
    }
    return rows[0]; // Return the first admin found
}


export async function deleteUser(id){

    id = Number(id);
    
    if (isNaN(id)) {
        return false;
    }

    const [rows] =await pool.query("delete from users where id = ?", [id]);
    if (rows.affectedRows === 0) {
        return false; // No rows deleted, user not found
    }
    return true; // User deleted successfully

}

export async function changeUserRole(id,role){
    id = Number(id);
    if (isNaN(id)) {
        return false;
    }

    const [rows] = await pool.query("update users set role = ? where id = ?" , [role,id]);
    if (rows.affectedRows === 0) {
        return false; // No rows updated, user not found
    }
    return true; // User role updated successfully
}
