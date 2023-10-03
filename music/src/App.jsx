import { useState, useEffect } from "react";
import "./assets/style.css";
import { getSongList, searchSong } from "./api";

function App() {
  const [openlist, setOpenlist] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duationTime, setDuationTime] = useState("0:00");

  const [playIcon, setPlayIcon] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [songList, setSongList] = useState([]);
  const [searchList, setSearchList] = useState([]);

  const [imgURL, setImgURL] = useState("");
  const [songURL, setSongURL] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState(0);

  useEffect(() => {
    const fetchSong = async () => {
      const list = await getSongList();
      setSongList(list.data.result);
    };

    fetchSong();
    const myElement = document.querySelector(".progress-area");

    myElement.addEventListener("click", (event) => {
      const audio = document.getElementById("main-audio");
      const offsetX = event.offsetX;
      let progressWidth = myElement.clientWidth;
      let songDuration = audio.duration;
      audio.currentTime = (offsetX / progressWidth) * songDuration;
      audio.play();
      setPlayIcon(true);
    });
  }, []);

  useEffect(() => {
    if (songList.length != 0) {
      setImgURL(
        "http://localhost:4000/music_player/imgs/" +
          songList[currentIndex].imgURL
      );
      setSongURL(
        "http://localhost:4000/music_player/stream/?songId=" +
          songList[currentIndex].songId
      );
    }
  }, [songList, currentIndex]);

  const handleDuration = (e) => {
    // set Current Song Durration Time
    let durrMin = Math.floor(e.target.duration / 60);
    let durrSec = Math.floor(e.target.duration % 60);
    if (durrSec < 10) {
      //if sec is less than 10 then add 0 before it
      durrSec = `0${durrSec}`;
    }
    setDuationTime(`${durrMin}:${durrSec}`);
    setPlayIcon(true);
    e.target.play().catch((e) => {
      setPlayIcon(false);
    });
  };

  useEffect(() => {
    if (playIcon) {
      document
        .getElementById("main-audio")
        .play()
        .catch((e) => {
          setPlayIcon(false);
        });
    } else {
      document.getElementById("main-audio").pause();
    }
  }, [playIcon]);

  const handleSearch = async (e) => {
    setSearchValue(e.target.value);
    if (e.target.value != "") {
      const { data } = await searchSong(e.target.value, null);
      if (data.data && data.data.length > 0) {
        setSearchList(data.data);
      } else {
        setSearchList([]);
      }
    }
  };

  const playSearchSong = async (Id) => {
    const { data } = await searchSong(null, Id);
    if (data.data && data.data.length > 0) {
      setSearchValue("");
      setSearchList([]);
      const index = songList.findIndex((e, i) => {
        if (e.songId == data.data[0].songId) {
          playSong(i);
          return true;
        }
      });
      if (index == -1) {
        songList.push(data.data[0]);
        playSong(songList.length - 1);
      } else {
        playSong(index);
      }
    }
  };

  const nextSong = () => {
    if (currentIndex < songList.length - 1) {
      playSong(currentIndex + 1);
    } else if (currentIndex == songList.length - 1) {
      playSong(0);
    }
  };

  const prevSong = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else if (currentIndex == 0) {
      setCurrentIndex(songList.length - 1);
    }
  };

  const playSong = (Id) => {
    if (currentIndex == Id) {
    } else {
      setCurrentIndex(Id);
    }
    setOpenlist(false);
  };

  const handleProgress = (e) => {
    // handle Current Song Running Time
    let currentMin = Math.floor(e.target.currentTime / 60);
    let currentSec = Math.floor(e.target.currentTime % 60);
    if (currentSec < 10) {
      //if sec is less than 10 then add 0 before it
      currentSec = `0${currentSec}`;
    }
    setCurrentTime(`${currentMin}:${currentSec}`);

    setProgress((e.target.currentTime / e.target.duration) * 100);

    if (e.target.currentTime == e.target.duration) {
      if (mode == 0) {
        nextSong();
      } else if (mode == 1) {
        e.target.currentTime = 0;
        e.target.play();
      } else if (mode == 2) {
        if (songList.length == 1) {
          e.target.currentTime = 0;
          e.target.play();
          return;
        } else shuffle(e);
      }
    }
  };

  const handleMode = () => {
    // 0 => 'Repeat' | 1 => 'Repeat One' | 2 => 'Shuffle
    if (mode == 0) {
      setMode((prev) => prev + 1);
    } else if (mode == 1) {
      setMode((prev) => prev + 1);
    } else {
      setMode(0);
    }
  };

  const shuffle = () => {
    while (true) {
      let num = Math.floor(Math.random() * (songList.length - 1));
      if (num != currentIndex) {
        playSong(num);
        return;
      }
    }
  };

  return (
    <>
      <div className="wrapper">
        {/* <!-- search bar --> */}
        <div className="container">
          <div
            className={`searchInput ${(searchValue != '' && searchList.length > 0) ? "active" : ""}`}
          >
            <input
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search songs.."
            />
            <div className="resultBox">
              { searchList.length > 0 &&
                searchList.map((e, i) => {
                  return (
                    <li key={i} onClick={() => playSearchSong(e.songId)}>
                      {e.songName}
                    </li>
                  );
                })} 
            </div>
            <div className="icon">
              <i className="fas fa-search"></i>
            </div>
          </div>
        </div>
        {/* <!-- end search bar  --> */}
        {/* <div className="top-bar">
          <i className="material-icons">expand_more</i>
          <span>Now Playing</span>
          <i className="material-icons">more_horiz</i>
        </div> */}
        <div className="img-area">
          <img src={imgURL} alt="" />
        </div>
        <div className="song-details">
          <p className="name">
            {songList.length > 0 && songList[currentIndex].songName}
          </p>
          <p className="artist">
            {songList.length > 0 && songList[currentIndex].artistName}
          </p>
        </div>
        <div className="progress-area">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <audio
              onLoadedData={(e) => handleDuration(e)}
              id="main-audio"
              src={songURL}
              onTimeUpdate={(e) => handleProgress(e)}
              onLoad={(e) => handleDuration(e)}
            ></audio>
          </div>
          <div className="song-timer" style={{pointerEvents: 'none', marginTop: '5px', userSelect: 'none'}}>
            <span className="current-time">{currentTime}</span>
            <span className="max-duration">{duationTime}</span>
          </div>
        </div>
        <div className="controls">
          <i
            id="repeat-plist"
            onClick={handleMode}
            className="material-icons"
            title="Playlist looped"
          >
            {mode == 0
              ? "repeat"
              : mode == 1
              ? "repeat_one"
              : mode == 2
              ? "shuffle"
              : ""}
          </i>
          <i id="prev" className="material-icons" onClick={prevSong}>
            skip_previous
          </i>
          <div
            className="play-pause"
            onClick={() => setPlayIcon((prev) => !prev)}
          >
            <i className="material-icons play">
              {playIcon ? "pause" : "play_arrow"}
            </i>
          </div>
          <i id="next" className="material-icons" onClick={nextSong}>
            skip_next
          </i>
          <i
            id="more-music"
            className="material-icons"
            onClick={() => setOpenlist((prev) => !prev)}
          >
            {openlist ? "close" : "queue_music"}
          </i>
        </div>
        <div className={`music-list2 ${openlist ? "show" : ""}`}>
          <div className="header" style={{display: 'flex', justifyContent: 'space-between'}}>
            <div className="row">
              <i className="list material-icons">queue_music</i>
              <span>Music list</span>
            </div>
            <i
              id="close"
              className="material-icons"
              onClick={() => setOpenlist(false)}
            >
              close
            </i>
          </div>
          <ul>
            {songList &&
              songList.length != 0 &&
              songList.map((e, i) => {
                return (
                  <li
                    key={i}
                    className={currentIndex == i ? "playing" : ""}
                    onClick={() => playSong(i)}
                  >
                    <div>{e.songName}</div>
                    <div>{currentIndex == i ? "Playing" : ""}</div>
                  </li>
                );
              })}
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
              <li>dfv</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
