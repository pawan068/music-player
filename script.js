
let songContainer = document.getElementById("songlists");
let likedsongs = document.getElementById("liked-songs");
let sidebar = document.getElementById("sidebar");
let cross = document.getElementById("cross");
let searchInput = document.getElementById("input");
let container = document.getElementById("container");
let musicplayer = document.getElementById("music-player");
let musicback = document.getElementById("music-back");
let coverimg = document.getElementById("cover-img");
let songTitle = document.getElementById("song-title");
let audio = document.getElementById("audio");
let playBtn = document.getElementById("play");
let progress = document.getElementById("progress");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let coverr=document.getElementById("coverr")

let songs = [];
let currentIndex = 0;
let isPlaying = false;

fetch("songs.json")
  .then(res => res.json())
  .then(data => {
    songs = data;
    renderSongs();
  });

function renderSongs() {
  songContainer.innerHTML = "";
  songs.forEach((song, index) => {
    let div = document.createElement("div");
    div.classList.add("list");
    div.setAttribute("data-index", index);
    div.setAttribute("data-src", song.src);
    div.innerHTML = `
      <div class="song-img"><img src="${song.cover}" alt=""></div> 
      <div class="song-name">${song.title}</div>
      <div class="song-action">
        <div class="like-song"><i class="fa-regular fa-heart"></i></div>
        <div class="play-song"><i class="fa-solid fa-play"></i></div>
      </div>`;
    songContainer.appendChild(div);
  });

  attachSongEvents();
  attachLikeEvents();
}

function attachSongEvents() {
  const songLists = document.querySelectorAll(".list");
  songLists.forEach(song => {
    song.addEventListener("click", e => {
      if (e.target.classList.contains("fa-heart")) return;

      currentIndex = parseInt(song.getAttribute("data-index"));
      loadSong(currentIndex);

      container.classList.add("container-action");
      sidebar.classList.remove("sidebar-action");
      musicplayer.classList.add("music-player-action");
    });
  });
}

function attachLikeEvents() {
  const likeButtons = document.querySelectorAll(".like-song");
  likeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const icon = btn.querySelector("i");
      const songDiv = btn.closest(".list");
      const songName = songDiv.querySelector(".song-name").textContent;
      const songImg = songDiv.querySelector("img").src;

      if (icon.classList.contains("fa-regular")) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        addSongToSidebar(songName, songImg);
      } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        removeSongFromSidebar(songName);
      }
      e.stopPropagation();
    });
  });
}

function addSongToSidebar(name, img) {
  const songObj = songs.find(s => s.title === name);
  if (!songObj) return;

  let sidebarItem = document.createElement("div");
  sidebarItem.classList.add("sidebar-list");
  sidebarItem.innerHTML = `
    <div class="sidebar-song-img"><img src="${img}" alt=""></div>
    <div class="sidebar-song-name">${name}</div>
    <div class="sidebar-song-action">
      <i class="fa-solid fa-play"></i>
      <i class="fa-solid fa-heart liked"></i>
    </div>`;


  sidebarItem.querySelector(".fa-heart").addEventListener("click", () => {
    sidebarItem.remove();
    let songLists = document.querySelectorAll(".list");
    songLists.forEach(s => {
      if (s.querySelector(".song-name").textContent === name) {
        let heartIcon = s.querySelector(".like-song i");
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
      }
    });
  });


  sidebarItem.addEventListener("click", e => {
    if (e.target.classList.contains("fa-heart")) return;

    coverimg.src = songObj.cover;
    songTitle.textContent = songObj.title;
    audio.src = songObj.src;
    audio.play();
    coverr.classList.add("cover-action")
    sidebar.classList.remove("sidebar-action")
    isPlaying = true;
    playBtn.innerText = "II";

    currentIndex = songs.indexOf(songObj);

    container.classList.add("container-action");
    musicplayer.classList.add("music-player-action");
  });

  sidebar.appendChild(sidebarItem);
}

function removeSongFromSidebar(name) {
  let sidebarSongs = sidebar.querySelectorAll(".sidebar-list");
  sidebarSongs.forEach(s => {
    if (s.querySelector(".sidebar-song-name").textContent === name) {
      s.remove();
    }
  });
}

function loadSong(index) {
  coverimg.src = songs[index].cover;
  songTitle.textContent = songs[index].title;
  audio.src = songs[index].src;
  playSong();
}


function playSong() {
  audio.play();
  isPlaying = true;
  coverr.classList.add("cover-action")
  sidebar.classList.remove("sidebar-action")
  playBtn.innerText = "II";
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playBtn.innerText = "▶";
  coverr.classList.remove("cover-action")
}

playBtn.addEventListener("click", () => {
  if (isPlaying) pauseSong();
  else playSong();
});


nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
});

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
});


audio.addEventListener("timeupdate", () => {
  
  progress.value = (audio.currentTime / audio.duration) * 100 || 0;
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;

});

likedsongs.addEventListener("click", e => {
  sidebar.style.zIndex = "1";
  sidebar.classList.toggle("sidebar-action");
  e.stopPropagation();
});

cross.addEventListener("click", () => {
  sidebar.classList.remove("sidebar-action");
});


musicback.addEventListener("click", () => {
  container.classList.remove("container-action");
  musicplayer.classList.remove("music-player-action");
});


searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const songLists = document.querySelectorAll(".list");
  songLists.forEach(song => {
    const name = song.querySelector(".song-name").textContent.toLowerCase();
    song.style.display = name.includes(query) ? "flex" : "none";
  });
});
