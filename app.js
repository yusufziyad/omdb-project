const apiKey = "f6110961";

const searchBtn = document.getElementById("searchBtn");
const movieInput = document.getElementById("movieInput");
const movieResult = document.getElementById("movieResult");
const errorMsg = document.getElementById("errorMsg");

// buton
searchBtn.addEventListener("click", () => {
    const movieName = movieInput.value.trim(); // Boşlukları silip film adını alıyoruz
    
    if (movieName !== "") { // Eğer kutu boş değilse aramayı başlat
        searchMovie(movieName);
    } else {
        errorMsg.innerText = "Please enter a movie name."; // Kutu boşsa uyar
    }
});

// Filmi API'den Getiren Fonksiyon
async function searchMovie(movieName) {
    errorMsg.innerText = "";
    movieResult.innerHTML = "";
    movieResult.classList.add("hidden"); 

    try {
        // OMDB sunucusuna gidip filmi soruyoruz 
        const response = await fetch(`https://www.omdbapi.com/?t=${movieName}&apikey=${apiKey}`);
        const data = await response.json(); // Cevabı json'a çevirme

        // Eğer film bulunduysa
        if (data.Response === "True") {
            
            // Filmin afişi yoksa yerine boş bir resim koymak için kontrol yapıyoruz
            const poster = data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/150x220?text=No+Poster";

            movieResult.innerHTML = `
                <img src="${poster}" alt="${data.Title}">
                <div class="movie-info">
                    <h2>${data.Title} (${data.Year})</h2>
                    <p><strong>Genre:</strong> ${data.Genre}</p>
                    <p><strong>Director:</strong> ${data.Director}</p>
                </div>
            `;
            
            movieResult.classList.remove("hidden"); // Kutuyu görünür yap

            // sayfa yenilendiğinde kaybolmaması için
            localStorage.setItem("lastSearchedMovie", movieName);

        } else {
            errorMsg.innerText = data.Error; 
        }
    } catch (error) {
        errorMsg.innerText = "Something went wrong. Please check your connection.";
    }
}

// Sayfa ilk açıldığında veya yenilendiğinde ne olacak
window.onload = () => {
    // Tarayıcının hafızasında kayıtlı bir film var mı diye bakıyoruz
    const lastSearched = localStorage.getItem("lastSearchedMovie");
    
    // Eğer varsa arama kutusuna yazıp otomatik olarak o filmi tekrar aratıyoruz
    if (lastSearched) {
        movieInput.value = lastSearched;
        searchMovie(lastSearched);
    }
};