import express from 'express';
import './model/index.js';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        if (file.mimetype.split('/')[0] == "audio") {
            cb(null, 'upload/songs/');
        }
        else if (file.mimetype.split('/')[0] == "image") {
            cb(null, 'public/imgs/');
        }
         
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
   

const app = express()
const formdata = multer({ storage: storage })

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json()) 
app.use(formdata.fields([{name:'songFile', maxCount: 1, }, {name:'imgFile', maxCount: 1}])) 
app.use('/music_player', express.static('public'))
app.use(cors({origin: '*'}))


app.use('/music_player', routes)

app.listen(4000, () => {
    console.log(`http://localhost:4000`);
})