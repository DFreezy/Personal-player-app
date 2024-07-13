// Get references to the HTML elements
const playlistSongs = document.getElementById("playlist-songs");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");

// Define the list of songs
const allSongs = [
  {
    id: 0,
    title: "I hate you",
    artist: "D Freezy",
    duration: "3:31",
    src: "Songs/I hate you.mp3",
  },
  {
    id: 1,
    title: "Frozen wings",
    artist: "D Freezy",
    duration: "4:00",
    src: "Songs/Frozen wings.mp3",
  },
  {
    id: 2,
    title: "Walls collapsing",
    artist: "D Freezy",
    duration: "4:00",
    src: "Songs/Walls collapsing.mp3",
  },
  {
    id: 3,
    title: "Her name",
    artist: "D Freezy",
    duration: "4:00",
    src: "Songs/Qaiylah.mp3",
  },
  {
    id: 4,
    title: "SAD!",
    artist: "D Freezy",
    duration: "3:21",
    src: "Songs/SAD.mp3",
  },
  {
    id: 5,
    title: "World without chances",
    artist: "D Freezy",
    duration: "3:54",
    src: "Songs/World without chances.mp3",
  },
  {
    id: 6,
    title: "Do you?",
    artist: "D Freezy",
    duration: "4:00",
    src: "Songs/Do you_.mp3",
  },
  {
    id: 7,
    title: "First shooting star",
    artist: "D Freezy",
    duration: "4:00",
    src: "Songs/First shooting star.mp3",
  },
  {
    id: 8,
    title: "Wild side",
    artist: "D Freezy",
    duration: "4:00",
    src: "Songs/Wild side.mp3",
  },
  {
    id: 9,
    title: "My love forever grows",
    artist: "D Freezy",
    duration: "3:23",
    src: "Songs/My love forever grows.mp3",
  },
  {
    id:10,
    title: "Moving on",
    artist: "D Freezy",
    duration: "3:15",
    src: "Songs/Moving on.mp3"
  }
];

// Initialize audio object and user data
const audio = new Audio();
let userData = {
  songs: [...allSongs], // All songs available
  currentSong: null, // Currently playing song
  songCurrentTime: 0, // Time at which song was paused
};

// Function to play a song by its id
const playSong = (id) => {
  const song = userData?.songs.find((song) => song.id === id);
  audio.src = song.src;
  audio.title = song.title;

  // Check if the song is new or resuming
  if (userData?.currentSong === null || userData?.currentSong.id !== song.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = userData?.songCurrentTime;
  }

  userData.currentSong = song; // Set current song
  playButton.classList.add("playing"); // Update play button state

  highlightCurrentSong(); // Highlight the current song in the playlist
  setPlayerDisplay(); // Update player display with song info
  setPlayButtonAccessibleText(); // Set accessible text for play button
  audio.play(); // Play the song
};

// Function to pause the song
const pauseSong = () => {
  userData.songCurrentTime = audio.currentTime; // Save the current time of the song
  playButton.classList.remove("playing"); // Update play button state
  audio.pause(); // Pause the song
};

// Function to play the next song in the list
const playNextSong = () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id); // Play the first song if none is currently playing
  } else {
    const currentSongIndex = getCurrentSongIndex();
    const nextSong = userData?.songs[currentSongIndex + 1];

    playSong(nextSong.id); // Play the next song
  }
};

// Function to play the previous song in the list
const playPreviousSong = () => {
  if (userData?.currentSong === null) return;
  else {
    const currentSongIndex = getCurrentSongIndex();
    const previousSong = userData?.songs[currentSongIndex - 1];

    playSong(previousSong.id); // Play the previous song
  }
};

// Function to shuffle the playlist
const shuffle = () => {
  userData?.songs.sort(() => Math.random() - 0.5); // Randomize song order
  userData.currentSong = null; // Reset current song
  userData.songCurrentTime = 0; // Reset song current time

  renderSongs(userData?.songs); // Render shuffled songs
  pauseSong(); // Pause the audio
  setPlayerDisplay(); // Update player display
  setPlayButtonAccessibleText(); // Set accessible text for play button
};

// Function to delete a song by its id
const deleteSong = (id) => {
  if (userData?.currentSong?.id === id) {
    userData.currentSong = null;
    userData.songCurrentTime = 0;

    pauseSong(); // Pause the song if it's currently playing
    setPlayerDisplay(); // Update player display
  }

  userData.songs = userData?.songs.filter((song) => song.id !== id); // Remove song from the list
  renderSongs(userData?.songs); // Render the updated list
  highlightCurrentSong(); // Highlight the current song
  setPlayButtonAccessibleText(); // Set accessible text for play button

  if (userData?.songs.length === 0) { // If no songs left, show reset button
    const resetButton = document.createElement("button");
    const resetText = document.createTextNode("Reset Playlist");

    resetButton.id = "reset";
    resetButton.ariaLabel = "Reset playlist";
    resetButton.appendChild(resetText);
    playlistSongs.appendChild(resetButton);

    resetButton.addEventListener("click", () => {
      userData.songs = [...allSongs];

      renderSongs(sortSongs()); // Reset to original song list
      setPlayButtonAccessibleText();
      resetButton.remove();
    });
  }
};

// Function to set player display with current song info
const setPlayerDisplay = () => {
  const playingSong = document.getElementById("player-song-title");
  const songArtist = document.getElementById("player-song-artist");
  const currentTitle = userData?.currentSong?.title;
  const currentArtist = userData?.currentSong?.artist;

  playingSong.textContent = currentTitle ? currentTitle : ""; // Update song title
  songArtist.textContent = currentArtist ? currentArtist : ""; // Update song artist
};

// Function to highlight the currently playing song in the playlist
const highlightCurrentSong = () => {
  const playlistSongElements = document.querySelectorAll(".playlist-song");
  const songToHighlight = document.getElementById(`song-${userData?.currentSong?.id}`);

  playlistSongElements.forEach((songEl) => {
    songEl.removeAttribute("aria-current");
  });

  if (songToHighlight) songToHighlight.setAttribute("aria-current", "true");
};

// Function to render songs in the playlist
const renderSongs = (array) => {
  const songsHTML = array
    .map((song) => {
      return `
      <li id="song-${song.id}" class="playlist-song">
      <button class="playlist-song-info" onclick="playSong(${song.id})">
          <span class="playlist-song-title">${song.title}</span>
          <span class="playlist-song-artist">${song.artist}</span>
          <span class="playlist-song-duration">${song.duration}</span>
      </button>
      <button onclick="deleteSong(${song.id})" class="playlist-song-delete" aria-label="Delete ${song.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    })
    .join("");

  playlistSongs.innerHTML = songsHTML; // Set the HTML for the playlist
};

// Function to set accessible text for the play button
const setPlayButtonAccessibleText = () => {
  const song = userData?.currentSong || userData?.songs[0];

  playButton.setAttribute(
    "aria-label",
    song?.title ? `Play ${song.title}` : "Play"
  );
};

// Function to get the index of the current song in the list
const getCurrentSongIndex = () => userData?.songs.indexOf(userData?.currentSong);

// Event listeners for control buttons
playButton.addEventListener("click", () => {
  if (userData?.currentSong === null) {
    playSong(userData?.songs[0].id); // Play first song if none is playing
  } else {
    playSong(userData?.currentSong.id); // Play the current song
  }
});

pauseButton.addEventListener("click", pauseSong); // Pause the song
nextButton.addEventListener("click", playNextSong); // Play the next song
previousButton.addEventListener("click", playPreviousSong); // Play the previous song
shuffleButton.addEventListener("click", shuffle); // Shuffle the playlist

// Event listener for when the current song ends
audio.addEventListener("ended", () => {
  const currentSongIndex = getCurrentSongIndex();
  const nextSongExists = userData?.songs[currentSongIndex + 1] !== undefined;

  if (nextSongExists) {
    playNextSong(); // Play the next song if it exists
  } else {
    userData.currentSong = null;
    userData.songCurrentTime = 0;
    pauseSong(); // Pause the song if no next song exists
    setPlayerDisplay(); // Update player display
    highlightCurrentSong(); // Highlight the current song
    setPlayButtonAccessibleText(); // Set accessible text for play button
  }
});

// Function to sort songs alphabetically by title
const sortSongs = () => {
  userData?.songs.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return userData?.songs;
};

// Initial render of the sorted songs
renderSongs(sortSongs());
setPlayButtonAccessibleText(); // Set accessible text for play button
