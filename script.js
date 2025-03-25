let allAlbums = [];

async function fetchAlbums() {
    try {
        const response = await fetch("albums.json");
        allAlbums = await response.json();
        renderAlbums(allAlbums);
    } catch (error) {
        console.error("Failed to load album data:", error);
    }
}

function calculateScore(album) {
    if (album.songs.length === 0) return "0.0";
    const total = album.songs.reduce((sum, song) => sum + song.rating, 0);
    return (total / album.songs.length).toFixed(1);
}

function showArtistAlbums(artistName) {
    const filteredAlbums = allAlbums.filter(album => album.artists.includes(artistName));
    renderAlbums(filteredAlbums, true);
}

function getRatingClass(rating) {
    if (rating === 10) return "perfect-rating";   // Glowing Green & Gold for 10/10
    if (rating >= 7) return "high-rating";        // Green for 8-9.9
    if (rating >= 5) return "mid-rating";         // Yellow for 5-7.9
    return "low-rating";                          // Red for 1-4.9
}

function searchAlbums() {
    const query = document.getElementById("search").value.toLowerCase();
    const filteredAlbums = allAlbums.filter(album =>
        album.name.toLowerCase().includes(query) ||
        album.artists.some(artist => artist.toLowerCase().includes(query)) ||
        album.songs.some(song => song.name.toLowerCase().includes(query))
    );
    renderAlbums(filteredAlbums);
}

function renderAlbums(albums, isFiltered = false) {
    const albumContainer = document.getElementById("albums");
    albumContainer.innerHTML = "";

    if (isFiltered) {
        const backButton = document.createElement("button");
        backButton.textContent = "⬅ Back to All Albums";
        backButton.classList.add("back-button");
        backButton.onclick = () => render
        backButton.onclick = () => renderAlbums(allAlbums);
        albumContainer.appendChild(backButton);
    }

    albums.forEach(album => {
        const albumDiv = document.createElement("div");
        albumDiv.classList.add("album-card");

        albumDiv.innerHTML = `
            <img src="${album.cover}" alt="${album.name}" class="album-cover">
            <div class="album-content">
                <div class="album-header">
                    <h2>
                        ${album.artists.map(artist => `
                            <a href="#" class="artist-link" onclick="showArtistAlbums('${artist}')">${artist}</a>
                        `).join(", ")} - ${album.name}
                    </h2>
                    <span class="album-score">Avg. Score: ${calculateScore(album)}/10</span>
                </div>
                <p class="album-description">${album.description}</p>
                <div class="song-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Song</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${album.songs.map(song => `
                                <tr>
                                    <td>
                                        ${song.name} 
                                        ${song.features.length > 0 ? `(feat. ${song.features.map(feature => `<a href="#" class="feature-link" onclick="showArtistAlbums('${feature}')">${feature}</a>`).join(", ")})` : ""}
                                    </td>
                                    <td class="rating ${getRatingClass(song.rating)}">${song.rating}/10</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        albumContainer.appendChild(albumDiv);
    });
}

// Load all albums on page load
fetchAlbums();
