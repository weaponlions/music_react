import sqlDB from "../model/index.js"; 
import fs from 'fs';

export const insertSong = async (req, res) => {
    try {
        const { songName, artistName } = req.body;
        const { songFile, imgFile } = req.files;

        const query = "INSERT INTO SONGS(songName, artistName, songURL, imgURL) VALUES((?), (?), (?), (?))";
        
        sqlDB.query(query, [songName, artistName, songFile[0].filename, imgFile[0].filename], (err, res) => {
            if (err) throw err;
        })

        return res.json({'result': 'done', 'message': 'song inserted successfully'})
    } catch (err) {
        console.log(err); 
        return res.json({'result': 'failed', 'message': err.message})
    }
}



export const removeSong = async (req, res) => {
    try {
        const { songId } = req.body; 
        let query = `SELECT * FROM SONGS WHERE songId=${songId}`
        sqlDB.query(query, (err, result) => { 
            if (err) throw err;
            if (result.lenth == 1) {
                fs.rm(`upload/songs/${result[0].songURL}`, (err) => {
                    if (err) throw err
                })
                fs.rm(`public/imgs/${result[0].imgURL}`, (err) => {
                    if (err) throw err
                })
                query = `DELETE FROM SONGS WHERE songId=${songId}`;
                sqlDB.query(query, (err, result) => {
                    if (err) throw err;
                })
                res.json({'result': 'done', 'message': 'song delete successfully'})
            }
            else return res.json({'result': 'failed', 'message': 'Song Not Found'})
        })
        
    } catch (err) {
        console.log(err.message);
        return res.json({'result': 'failed', 'message': err.message})
    }
}


export const getSong = async (req, res) => {
    try { 
        const { songId, songName } = req.query; 
        if (songId || songName) {
            if (songId && isNaN(songId)) { 
                return res.json({'result': 'failed', 'message': 'Not a ID'});
            }
            return searchSong(req, res);
        }
        let query = "SELECT * FROM SONGS LIMIT 10";
        sqlDB.query(query, (err, result) => {
            if (err) throw err; 
            return res.json({'result': result})
        })
    } catch (err) {
        console.log(err.message);
        return res.json({'result': 'failed', 'message': err.message})
    }
}


const searchSong = async (req, res) => {
    try {
        const { songId, songName } = req.query;
        let query = '';
        if (songId) {
            query = `SELECT * FROM SONGS WHERE songId=${songId}`;
        }
        else{
            query = `SELECT * FROM SONGS WHERE songName LIKE '%${songName}%' LIMIT 10`;  
        }
        sqlDB.query(query, (err, result) => {
            if (err) throw err; 
            return res.json({'result': 'done', 'data': result})
        })
    } catch (err) {
        console.log(err.message);
        return res.json({'result': 'failed', 'message': err.message})
    }
}


export const streamSong = (req, res) => {
    try {
        const { songId } = req.query; 
        if (songId && isNaN(songId))
            return res.json({'result': 'failed', 'message': 'Not Valid ID'})
        
        let query = `SELECT * FROM SONGS WHERE songId=${songId}`;
        sqlDB.query(query, (err, result) => {
            if (err) throw err;
            if (result.lenth != 0) { 
                const songPath = `upload/songs/${result[0].songURL}`
                const songSize = fs.statSync(songPath).size; 
                console.log({songSize});
                const range = req.headers.range;
                console.log({range});
                const parts = range.replace(/bytes=/, '').split('-');
                console.log({parts});
                const start = parseInt(parts[0], 10);
                console.log({start});
                const end = parts[1] ? parseInt(parts[1], 10) : songSize - 1;
                console.log({end});

                const chunkSize = 500000;

                res.writeHead(206, {
                    'Content-Range': `bytes ${start}-${end}/${songSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunkSize,
                    'Content-Type': 'video/mp4'
                });

                const stream = fs.createReadStream(songPath, { start, end });
                stream.pipe(res);
                // return res.json({'result': 'done', 'data': []})
            }
            else
                return res.json({'result': 'failed', 'message': 'Not Valid ID'})
        })

    } catch (err) {
        console.log(err.message);
        return res.json({'result': 'failed', 'message': err.message})
    }
}

export const uploadSong = async () => {
    try {
        console.log(req.files);
        res.json({})
    } catch (err) {
        console.log(err);
    }
}