import React from 'react';
import { uploadSong } from './api';

const Upload = () => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        let ele = document.getElementById('file')
        if (ele.files && ele.files.length == 1) { 
            await uploadSong(ele.files[0])
        }
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input type='file' id='file' name='file' ></input>
            <input type='submit' />
        </form>

    </div>
  )
}

export default Upload
