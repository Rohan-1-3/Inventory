import dotenv from "dotenv";
import { Client } from "pg";
import { v4 as uuid } from "uuid";

dotenv.config();

const sql = `
        CREATE TABLE IF NOT EXISTS Developers (
            developer_id CHAR(36) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            country VARCHAR(100),
            description TEXT,
            logo_url TEXT
        );

        CREATE TABLE IF NOT EXISTS Genres (
            genre_id CHAR(36) PRIMARY KEY,
            genre_name VARCHAR(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Platforms (
            platform_id CHAR(36) PRIMARY KEY,
            platform_name VARCHAR(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Games (
            game_id CHAR(36) PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            release_date DATE,
            completed_date DATE,
            rating DECIMAL(3, 1),
            status VARCHAR(50),
            developer_id CHAR(36),
            description TEXT,
            cover_page_url TEXT,
            FOREIGN KEY (developer_id) REFERENCES Developers(developer_id)
        );

        CREATE TABLE IF NOT EXISTS GameGenres (
            game_id CHAR(36),
            genre_id CHAR(36),
            PRIMARY KEY (game_id, genre_id),
            FOREIGN KEY (game_id) REFERENCES Games(game_id),
            FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
        );

        CREATE TABLE IF NOT EXISTS GamePlatforms (
            game_id CHAR(36),
            platform_id CHAR(36),
            PRIMARY KEY (game_id, platform_id),
            FOREIGN KEY (game_id) REFERENCES Games(game_id),
            FOREIGN KEY (platform_id) REFERENCES Platforms(platform_id)
        );

        INSERT INTO Developers VALUES
        ('${uuid()}', 'Naughty Dog', 'USA', 'Famous for narrative-driven games.', 'https://download.logo.wine/logo/Naughty_Dog/Naughty_Dog-Logo.wine.png'),
        ('${uuid()}', 'CD Projekt Red', 'Poland', 'Known for immersive RPGs.', 'https://www.cdprojekt.com/en/wp-content/uploads-en/2016/01/cdp_004-1024x760-1024x760.jpg');

        INSERT INTO Genres VALUES
        ('${uuid()}', 'Action-Adventure'),
        ('${uuid()}', 'RPG'),
        ('${uuid()}', 'Shooter');


        INSERT INTO Platforms VALUES
        ('${uuid()}', 'PlayStation 5'),
        ('${uuid()}', 'PC'),
        ('${uuid()}', 'Xbox Series X');

        INSERT INTO Games VALUES
        ('${uuid()}', 'The Last of Us Part II', '2020-06-19', '2020-07-10', 9.5, 'Completed',
        (SELECT developer_id FROM Developers WHERE name = 'Naughty Dog'),
        'A narrative post-apocalyptic game.', 'https://upload.wikimedia.org/wikipedia/en/4/4f/TLOU_P2_Box_Art_2.png'),

        ('${uuid()}', 'Cyberpunk 2077', '2020-12-10', NULL, 8.0, 'Playing',
        (SELECT developer_id FROM Developers WHERE name = 'CD Projekt Red'),
        'Futuristic open-world RPG.', 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/Cyberpunk_2077_box_art.jpg/250px-Cyberpunk_2077_box_art.jpg');


        INSERT INTO GameGenres (game_id, genre_id)
        SELECT g.game_id, gen.genre_id FROM Games g, Genres gen
        WHERE (g.title = 'The Last of Us Part II' AND gen.genre_name = 'Action-Adventure')
        OR (g.title = 'Cyberpunk 2077' AND gen.genre_name IN ('RPG', 'Shooter'));

        INSERT INTO GamePlatforms (game_id, platform_id)
        SELECT g.game_id, p.platform_id FROM Games g, Platforms p
        WHERE (g.title = 'The Last of Us Part II' AND p.platform_name = 'PlayStation 5')
        OR (g.title = 'Cyberpunk 2077' AND p.platform_name IN ('PC', 'Xbox Series X'));
`

const main = async()=>{
    const client = new Client({
        connectionString: process.env.DB_URI_CLIENT
    })

    console.log("Connecting...");

    try{
        await client.connect();
        console.log("Connected.");

        await client.query(sql);
    }catch(err){
        console.log("Problem in connecting. Error: ",err)
    }finally{
        await client.end();
    }
    console.log("Connection Ended.");
};

main();
