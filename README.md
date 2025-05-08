
# Game Inventory Management System 🎮

A simple web application to manage and explore a collection of video games along with their developers, genres, and supported platforms.

## 🚀 Features

- View all games with cover images, descriptions, and release dates  
- Explore developers and their games  
- Filter games by genre or platform  
- Responsive UI using EJS + CSS  
- Optional admin functionality for adding/editing/deleting entries  

## 💾 Technologies Used

- Node.js + Express
- EJS Templating Engine
- POSTGRESQL
- CSS3 for Styling
- HTML5 for Markup

## 🛠 How to Run

1. Clone this repository:
    ```bash
    git clone https://github.com/yourusername/game-inventory.git
    cd game-inventory
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Create a `.env` file and connect to your SQL database and add a port:
    ```
    MONGODB_URI=postgresql://<username>:********@ep-curly-bird-a10wp0ys-pooler.ap-southeast-1.aws.neon.tech/<database_name>?sslmode=require
    ```

4. Start the development server:
    ```bash
    npm start
    ```

5. Open your browser and visit:
    ```
    http://localhost:3000
    ```

## 📜 Future Enhancements

- User authentication (login/register)
- Admin panel for managing inventory
- Sorting and filtering by platform, genre, release date
- Ratings and reviews
- API endpoints for mobile consumption

## 👨‍💻 Author

Developed by: [Your Name or Team Name]

## 📝 License

[MIT License](LICENSE)
