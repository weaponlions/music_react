import { insertSong, removeSong, getSong, streamSong } from "../controller/index.js";
import { Router } from "express";

const routes = Router();

routes.post('/insert', insertSong);
routes.post('/remove', removeSong);
routes.get('/songs', getSong);
routes.get('/stream', streamSong);


export default routes;