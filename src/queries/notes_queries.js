import { pool } from '../../app.js';

export async function getNotes(user_id) {
    const [rows] = await pool.query('SELECT * FROM notes where user_id = ?', [user_id]); // Assuming user_id is 1 for demo purposes
    return rows;
}



export async function createNote(title, content, user_id) {
    const [createNote] = await pool.query(`INSERT INTO notes (title, content,user_id) 
    VALUES (?, ? , ?)`, 
    [title, content , user_id]);
    return createNote;
}


export async function deleteNote(noteId, userId) {
    // Ensure IDs are numbers
    noteId = Number(noteId);
    userId = Number(userId);
    if (isNaN(noteId) || isNaN(userId)) {
        return false;
    }
    const [rows] = await pool.query("SELECT * FROM notes WHERE id = ? AND user_id = ?", [noteId, userId]);
    if (rows.length === 0) {
        return false;
    }
    const deletion = await pool.query("DELETE FROM notes WHERE id = ?", [noteId]);
    if (deletion) {
        return rows[0];
    }
}

// Fix argument order and ID validation
export async function updateNote(title, content, userId, noteId) {
    noteId = Number(noteId);
    userId = Number(userId);
    if (isNaN(noteId) || isNaN(userId)) {
        return false;
    }
    const [rows] = await pool.query(
        "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
        [title, content, noteId, userId]
    );
    if (rows.affectedRows === 0) {
        return false; // No rows updated, note not found or user mismatch
    }
    return { id: noteId, title, content, userId };
} 
