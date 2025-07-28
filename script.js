const API_KEY = 'dca61bcc';
const API_URL = 'https://www.omdbapi.com/';


$('.search-button').on('click', function () {
  const keyword = $('.input-keyword').val().trim();
  if (!keyword) {
    showCustomAlert("Masukkan judul film terlebih dahulu.");
    return;
  }
  searchMovies(keyword);
});

function showCustomAlert(message) {
  $('#customAlertMessage').html(message);
  $('#customAlertModal').modal('show');
}

document.querySelector('.reset-button').addEventListener('click', function () {
  document.querySelector('.input-keyword').value = '';
  document.querySelector('.movie-container').innerHTML = '';
});

$(document).on('click', '.modal-detail-button', function () {
  const imdbID = $(this).data('imdbid');
  getMovieDetail(imdbID);
});

function searchMovies(keyword) {
  $.ajax({
    url: `${API_URL}?apikey=${API_KEY}&s=${keyword}`,
    success: (results) => {
      if (results.Response === "True") {
        renderMovieCards(results.Search);
      } else {
        showError(results.Error);
      }
    },
    error: (e) => console.error("Search Error:", e.responseText)
  });
}

function getMovieDetail(imdbID) {
  $.ajax({
    url: `${API_URL}?apikey=${API_KEY}&i=${imdbID}`,
    success: (movie) => {
      $('.modal-body').html(showMovieDetail(movie));
      $('#movieDetailModalLabel').text(movie.Title);
    },
    error: (e) => console.error("Detail Error:", e.responseText)
  });
}

function renderMovieCards(movies) {
  const cardsHTML = movies.map(showCards).join('');
  $('.movie-container').html(cardsHTML);
}

function showError(message) {
  $('.movie-container').html(`
    <div class="col text-center text-danger">
      <h5>${message}</h5>
    </div>`);
}

function showCards(movie) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image';
  return `
    <div class="col-md-2 my-4">
      <div class="card h-100 shadow-sm">
        <img src="${poster}" class="card-img-top" alt="${movie.Title}">
        <div class="card-body d-flex flex-column">
          <h6 class="card-title">${movie.Title}</h6>
          <h6 class="card-subtitle mb-2 text-muted">${movie.Year}</h6>
          <a href="#" class="btn btn-primary btn-sm mt-auto modal-detail-button"
             data-toggle="modal" data-target="#movieDetailModal"
             data-imdbid="${movie.imdbID}">
             Show Detail
          </a>
        </div>
      </div>
    </div>`;
}

function showMovieDetail(movie) {
  const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x445?text=No+Image';
  return `
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-5">
          <img src="${poster}" class="img-fluid rounded w-100" alt="${movie.Title}">
        </div>
        <div class="col-md">
          <ul class="list-group list-group-flush">
            <li class="list-group-item"><h4>${movie.Title} (${movie.Year})</h4></li>
            <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
            <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
            <li class="list-group-item"><strong>Plot:</strong><br>${movie.Plot}</li>
            <li class="list-group-item"><strong>Runtime:</strong><br>${movie.Runtime}</li>
          </ul>
        </div>
      </div>
    </div>`;
}

