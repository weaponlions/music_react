import axios from 'axios';

axios.defaults.baseURL = "http://localhost:4000/music_player/"


export const getSongList = async () => await axios.get('songs')

export const searchSong = async (songName=null, songId=null) => await axios.get(`songs?${songName != null ? `songName=${songName}` : `songId=${songId}`}`)


export const uploadSong = async (file) => {
    console.log(file);
    console.log(file.size);

    let chunkSize = 10000
}
