import { v4 as uuid} from "uuid";
import { pool } from "./pool.js";

const getAllDevelopers = async()=>{
    const { rows } = await pool.query("SELECT * FROM developers");
    return rows;
}

const getAllGenres = async ()=>{
    const { rows } = await pool.query("SELECT * FROM genres"); 
    return rows;
}

const getAllPlatforms = async ()=>{
    const { rows }= await pool.query("SELECT * FROM platforms");
    return rows;
}

const getAllGames = async ()=>{
    const { rows } = await pool.query(`SELECT game_id,title, release_date, completed_date,
                                        rating, status,
                                        g.description as game_description, cover_page_url,
                                        d.name, d.country, d.description as developer_description,
                                        d.logo_url,
                                        (
                                            SELECT string_agg(gen.genre_name, ', ')
                                            FROM GameGenres gg
                                            JOIN Genres gen ON gg.genre_id = gen.genre_id
                                            WHERE gg.game_id = g.game_id
                                        ) AS genres,
                                        (
                                            SELECT string_agg(p.platform_name, ', ')
                                            FROM GamePlatforms gp
                                            JOIN Platforms p ON gp.platform_id = p.platform_id
                                            WHERE gp.game_id = g.game_id
                                        ) AS platforms
                                    FROM games g
                                    JOIN developers d ON g.developer_id = d.developer_id;`);
    
    return rows;
}

const getAGame = async(id)=>{
    const { rows } = await pool.query(`SELECT game_id,title, release_date, completed_date,
                                        rating, status,
                                        g.description as game_description, cover_page_url,
                                        d.name, d.country, d.description as developer_description,
                                        d.logo_url,
                                        (
                                            SELECT string_agg(gen.genre_name, ', ')
                                            FROM GameGenres gg
                                            JOIN Genres gen ON gg.genre_id = gen.genre_id
                                            WHERE gg.game_id = g.game_id
                                        ) AS genres,
                                        (
                                            SELECT string_agg(p.platform_name, ', ')
                                            FROM GamePlatforms gp
                                            JOIN Platforms p ON gp.platform_id = p.platform_id
                                            WHERE gp.game_id = g.game_id
                                        ) AS platforms
                                    FROM games g
                                    JOIN developers d ON g.developer_id = d.developer_id
                                    WHERE g.game_id = $1; `, [id])
        if(rows.length > 0){
            return rows[0];
        }else{
            return null;
        }
}

const addAGame = async({ title, release_date, completed_date, rating, status, developer_id, description, cover_page_url, genres, platforms })=>{
    const gameId = uuid();
    
    await pool.query(`
        INSERT INTO games (
            game_id, title, release_date, completed_date, rating,
            status, developer_id, description, cover_page_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
        gameId, title, release_date, completed_date, rating,
        status, developer_id, description, cover_page_url
    ]);

    for (const genre of genres) {
        await pool.query(
            "INSERT INTO gamegenres (game_id, genre_id) VALUES ($1, $2)",
            [gameId, genre]
        );
    }

    for (const platform of platforms) {
        await pool.query(
            "INSERT INTO gameplatforms (game_id, platform_id) VALUES ($1, $2)",
            [gameId, platform]
        );
    }

    return gameId;
}

const updateAGame = async(id, data)=>{
    const { title, release_date, completed_date, rating, status, developer_id, description, cover_page_url, genres, platforms } = data
    await pool.query(`
        UPDATE games 
        SET title = $1, release_date = $2, completed_date = $3, rating = $4,
            status = $5, developer_id = $6, description = $7, cover_page_url = $8
            WHERE games.game_id = $9
    `,[title, release_date, completed_date, rating, status, developer_id, description, cover_page_url, id])

    await pool.query(`
        DELETE FROM gamegenres WHERE game_id = $1
    `,[id])

    for (const genre of genres) {
        await pool.query(
            "INSERT INTO gamegenres (game_id, genre_id) VALUES ($1, $2)",
            [id, genre]
        );
    }

    await pool.query(`
        DELETE FROM gameplatforms WHERE game_id = $1
    `,[id])

    for (const platform of platforms) {
        await pool.query(
            "INSERT INTO gameplatforms (game_id, platform_id) VALUES ($1, $2)",
            [id, platform]
        );
    }

}

const deleteAGame = async(id)=>{
    await pool.query(`
        DELETE FROM gamegenres WHERE game_id = $1
    `,[id])

    await pool.query(`
        DELETE FROM gameplatforms WHERE game_id = $1
    `,[id])

    await pool.query("DELETE FROM games WHERE game_id = $1",[id]);
}

const getADeveloper = async(id)=>{
    const { rows } = await pool.query("SELECT * FROM developers WHERE developer_id = $1", [id]);
    return rows[0];
}

const addADeveloper = async({ name, country, description, logo_url })=>{
    const developerId = uuid();

    await pool.query(`INSERT INTO developers 
                      (developer_id, name, country, description, logo_url)
                      VALUES ($1, $2, $3, $4)`, [name, country, description, logo_url]);

    return developerId;
}

const updateADeveloper = async(id, data)=>{
    const { name, country, description, logo_url } = data;
    await pool.query(`UPDATE developers d
        SET name = $1, country = $2, description = $3, logo_url = $4
        WHERE d.developer_id = $5`,[ name, country, description, logo_url, id ]);
}

const deleteDeveloper = async(id) =>{
    try{
        await pool.query("DELETE FROM developers WHERE developer_id = $1", [id]);
    }catch(err){
        return err.code;
    }
    return null
}

export { getAllDevelopers, getAllGenres, getAllPlatforms, getAllGames, 
         getAGame, addAGame, updateAGame, deleteAGame,
         getADeveloper, addADeveloper, updateADeveloper, deleteDeveloper };