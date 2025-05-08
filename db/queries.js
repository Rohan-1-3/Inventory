import { v4 as uuid } from "uuid";
import { pool } from "./pool.js";
import dotenv from "dotenv";

dotenv.config();

const adminPass = process.env.ADMIN_PASS

const getAllDevelopers = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM developers");
        return rows;
    } catch (err) {
        console.error("Error getting developers:", err);
        throw err;
    }
};

const getAllGenres = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM genres");
        return rows;
    } catch (err) {
        console.error("Error getting genres:", err);
        throw err;
    }
};

const getAllPlatforms = async () => {
    try {
        const { rows } = await pool.query("SELECT * FROM platforms");
        return rows;
    } catch (err) {
        console.error("Error getting platforms:", err);
        throw err;
    }
};

const getAllGames = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT game_id, title, release_date, completed_date,
                rating, status, g.description as game_description, cover_page_url,
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
            JOIN developers d ON g.developer_id = d.developer_id;
        `);
        return rows;
    } catch (err) {
        console.error("Error getting all games:", err);
        throw err;
    }
};

const getAGame = async (id) => {
    try {
        const { rows } = await pool.query(`
            SELECT game_id, title, release_date, completed_date,
                rating, status, g.description as game_description, cover_page_url,
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
            WHERE g.game_id = $1;
        `, [id]);

        if (rows.length > 0) {
            return rows[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error(`Error getting game with ID ${id}:`, err);
        throw err;
    }
};

const addAGame = async ({ title, release_date, completed_date, rating, status, developer_id, description, cover_page_url, genres, platforms }) => {
    try {
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
    } catch (err) {
        console.error("Error adding game:", err);
        throw err;
    }
};

const updateAGame = async (id, data) => {
    try {
        const { title, release_date, completed_date, rating, status, developer_id, description, cover_page_url, genres, platforms } = data;

        await pool.query(`
            UPDATE games 
            SET title = $1, release_date = $2, completed_date = $3, rating = $4,
                status = $5, developer_id = $6, description = $7, cover_page_url = $8
            WHERE games.game_id = $9
        `, [title, release_date, completed_date, rating, status, developer_id, description, cover_page_url, id]);

        await pool.query(`
            DELETE FROM gamegenres WHERE game_id = $1
        `, [id]);

        for (const genre of genres) {
            await pool.query(
                "INSERT INTO gamegenres (game_id, genre_id) VALUES ($1, $2)",
                [id, genre]
            );
        }

        await pool.query(`
            DELETE FROM gameplatforms WHERE game_id = $1
        `, [id]);

        for (const platform of platforms) {
            await pool.query(
                "INSERT INTO gameplatforms (game_id, platform_id) VALUES ($1, $2)",
                [id, platform]
            );
        }
    } catch (err) {
        console.error(`Error updating game with ID ${id}:`, err);
        throw err;
    }
};

const deleteAGame = async (id) => {
    try {
        await pool.query(`
            DELETE FROM gamegenres WHERE game_id = $1
        `, [id]);

        await pool.query(`
            DELETE FROM gameplatforms WHERE game_id = $1
        `, [id]);

        await pool.query("DELETE FROM games WHERE game_id = $1", [id]);
    } catch (err) {
        console.error(`Error deleting game with ID ${id}:`, err);
        throw err;
    }
};

const getADeveloper = async (id) => {
    try {
        const { rows } = await pool.query("SELECT * FROM developers WHERE developer_id = $1", [id]);
        return rows[0];
    } catch (err) {
        console.error(`Error getting developer with ID ${id}:`, err);
        throw err;
    }
};

const addADeveloper = async ({ name, country, description, logo_url }) => {
    try {
        const developerId = uuid();

        await pool.query(`
            INSERT INTO developers 
            (developer_id, name, country, description, logo_url)
            VALUES ($1, $2, $3, $4, $5)
        `, [developerId, name, country, description, logo_url]);

        return developerId;
    } catch (err) {
        console.error("Error adding developer:", err);
        throw err;
    }
};

const updateADeveloper = async (id, data) => {
    try {
        const { name, country, description, logo_url } = data;

        await pool.query(`
            UPDATE developers d
            SET name = $1, country = $2, description = $3, logo_url = $4
            WHERE d.developer_id = $5
        `, [name, country, description, logo_url, id]);
    } catch (err) {
        console.error(`Error updating developer with ID ${id}:`, err);
        throw err;
    }
};

const deleteDeveloper = async (id) => {
    try {
        await pool.query("DELETE FROM developers WHERE developer_id = $1", [id]);
    } catch (err) {
        console.error(`Error deleting developer with ID ${id}:`, err);
        throw err;
    }
    return null;
};

const getAGenre = async (id) => {
    try {
        const { rows } = await pool.query("SELECT * FROM genres WHERE genre_id = $1", [id]);
        return rows[0];
    } catch (err) {
        console.error(`Error getting genre with ID ${id}:`, err);
        throw err;
    }
};

const addAGenre = async (name) => {
    try {
        const genreId = uuid();

        await pool.query(`
            INSERT INTO genres (genre_id, genre_name)
            VALUES ($1, $2)
        `, [genreId, name]);

        return genreId;
    } catch (err) {
        console.error("Error adding genre:", err);
        throw err;
    }
};

const updateGenre = async (id, name) => {
    try {
        await pool.query(`
            UPDATE genres SET
            genre_name = $1 WHERE genre_id = $2
        `, [name, id]);
    } catch (err) {
        console.error(`Error updating genre with ID ${id}:`, err);
        throw err;
    }
};

const deleteAGenre = async (id) => {
    try {
        await pool.query(`
            DELETE FROM gamegenres WHERE genre_id = $1
        `, [id]);

        await pool.query("DELETE FROM genres WHERE genre_id = $1", [id]);
    } catch (err) {
        console.error(`Error deleting genre with ID ${id}:`, err);
        throw err;
    }
};

const getAPlatform = async (id) => {
    try {
        const { rows } = await pool.query("SELECT * FROM platforms WHERE platform_id = $1", [id]);
        return rows[0];
    } catch (err) {
        console.error(`Error getting platform with ID ${id}:`, err);
        throw err;
    }
};

const addAPlatform = async (name) => {
    try {
        const platformId = uuid();

        await pool.query(`
            INSERT INTO platforms (platform_id, platform_name)
            VALUES ($1, $2)
        `, [platformId, name]);

        return platformId;
    } catch (err) {
        console.error("Error adding platform:", err);
        throw err;
    }
};

const updatePlatform = async (id, name) => {
    try {
        await pool.query(`
            UPDATE platforms SET
            platform_name = $1 WHERE platform_id = $2
        `, [name, id]);
    } catch (err) {
        console.error(`Error updating platform with ID ${id}:`, err);
        throw err;
    }
};

const deleteAPlatform = async (id) => {
    try {
        await pool.query(`
            DELETE FROM gameplatforms WHERE platform_id = $1
        `, [id]);

        await pool.query("DELETE FROM platforms WHERE platform_id = $1", [id]);
    } catch (err) {
        console.error(`Error deleting platform with ID ${id}:`, err);
        throw err;
    }
};

export { 
    getAllDevelopers, getAllGenres, getAllPlatforms, getAllGames, 
    getAGame, addAGame, updateAGame, deleteAGame,
    getADeveloper, addADeveloper, updateADeveloper, deleteDeveloper,
    getAGenre, addAGenre, updateGenre, deleteAGenre,
    getAPlatform, addAPlatform, updatePlatform, deleteAPlatform 
};
