


//*this Loads the Libray Node.js library to talk to SQLite.
const Database=require("better-sqlite3")
//*this opens a new file-base DB, 'chat.db': Your database file (will be created automatically).
const db=new Database("chat.db")

// *this makes sure that the table exists, CREATE TABLE IF NOT EXISTS: This creates a new table if it doesn't exist yet.


db.prepare(`
    CREATE TABLE IF NOT EXISTS messages(
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL
    )
    `
).run();
module.exports=db




