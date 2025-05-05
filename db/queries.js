import { pool } from "./pool";

const getAllGames = async ()=>{
    const { rows } = await pool.query("SELECT * FROM games");
    return rows;
}

export { getAllGames };