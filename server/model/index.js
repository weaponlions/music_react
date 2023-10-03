import mysql from 'mysql';

const sqlDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'MUSIC_PLAYER'
})

sqlDB.connect((err) => {
    if (err) throw err;
    console.log("Connected!");

    let query = `CREATE DATABASE IF NOT EXISTS MUSIC_PLAYER`
    sqlDB.query(query, (err, res) => {
        if (err) throw err; 
    })

    query = `CREATE TABLE IF NOT EXISTS SONGS(songId int NOT NULL AUTO_INCREMENT, songName VARCHAR(255) NOT NULL, artistName VARCHAR(255) NOT NULL, songURL VARCHAR(255) NOT NULL, imgURL VARCHAR(255) NOT NULL, created_At TIMESTAMP DEFAULT NOW(), PRIMARY KEY (songId))`

    sqlDB.query(query, (err, res) => {
        if (err) throw err;
    })

    // query = `SHOW TABLES`
    // sqlDB.query(query, (err, res) => {
    //     if (err) throw err;
    //     console.log("Tables -> ", res[0]['Tables_in_music_player']);
    // })
})


export default sqlDB;

