"use strict";
var moviesGlobal = {};
const url = "https://obtainable-scrawny-cactus.glitch.me/movies";

//gathers information about each movie, then appends to html
function refreshMovies (){
    $(".insert-movie-cards").html('<h1>Loading</h1>');
    fetch(url).then( response => {
        response.json().then(movies => {
            clearOutForms();
            //create global movies object to access in other parts of the script
            //without having to do more fetches
            moviesGlobal = movies;
            console.log(moviesGlobal);
            movies.forEach(movie => {
                //gets additional information about each movie using its name
                fetch(`https://api.themoviedb.org/3/search/movie?api_key=${MOVIES_APP_API_KEY}&query=${movie.title}`).then(response => {
                    response.json().then(movies => {
                        console.log(movies);
                        //add stars to movie card
                        var movieStars = "";
                        for (var i = 0; i < movie.rating; i++) {
                            //if 5 or more, break at 5
                            if (i >= 5){
                                break;
                            }
                            movieStars += `<img src="images/star.png" style="height: 15px; width: 15px">`
                        }
                        //tries to find poster from database
                        //if cannot access poster, posts a generic one
                        try {
                            var overview = movies.results[0].overview;
                            var fullPosterPath = `<img  class="mb-auto" src="https://image.tmdb.org/t/p/w500${movies.results[0].poster_path}">`;
                        }
                        catch(err) {
                            overview = "Movie not found";
                            fullPosterPath = `<img class="mb-auto" src="images/image-reel.png">`;
                        }
                        //build the movie card
                        var html =
                            `<div class="text-center mb-3 col-6 col-md-4 col-lg-3"> 
                                <div class="movie-card card btn-outline-dark">
                                    ${fullPosterPath}
                                    ${movie.title} 
                                    <div class="card-body font-weight-light overview">${overview}</div>
                                    <div class="stars">${movieStars}</div>
                                    <div class="delete-btn" id="${movie.id}"></div>
                                </div>
                            </div>`
                        $(".insert-movie-cards").append(html);
                    }).catch(console.error);
                });
            });
            //refresh list of movies in dropdown
            var editMoviesDropdown = "";
            moviesGlobal.forEach(movie => {
                editMoviesDropdown += `<option value="${movie.id}">${movie.title}</option>`
            });
            $("#movies_dropdown").html(editMoviesDropdown);
        });
    }).catch(console.error);
}
//clears out movie cards and all inputs
function clearOutForms(){
    $(".insert-movie-cards").html("");
    $("#edit_movie_name").val("");
    $("#edit_rating").val("");
    $("#movie_name").val("");
    $("#rating").val("");
}
//on submit, create movie and post to server
$("#submit_button").click(e => {
    e.preventDefault();
    const movieObj = {
        //This line does not work
        //ID cannot be duplicate
        // id: moviesGlobal.length + 1,
        id: createRandomId(),
        title: $("#movie_name").val(),
        rating: $("#rating").val()
    };
    const postOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieObj),
    };
    //send data to server, if successful, refresh movies
    fetch(url, postOptions)
        .then((response) =>
            refreshMovies()
        )
        .catch(console.error);
});
//when adding a movie, creates a unique ID that does not conflict with existing movie id
function createRandomId(){
    for (var i = 1; i >= 0; i++){
        if (isUniqueId(i)){
            return i;
        }
    }
}
//Checks if the generated number matches any existing ids
//If it matches one, return false to get a new number
function isUniqueId (iterator) {
    for (var i = 0; i < moviesGlobal.length; i++) {
        if (iterator === moviesGlobal[i].id) {
            return false;
        }
    }
    //if no matches, then it's unique
    return true;
}
//finds the rating of the movie by searching the global movie object by ID
function findRating(movieId){
    // moviesGlobal.forEach(movie=>{
    //     // console.log(movie)
    //     if (movie.id.toString() === movieId.toString()){
    //         console.log("found movie")
    //         return movie.rating;
    //     }
    // });
    for (var i = 0; i < moviesGlobal.length; i++){
        if (moviesGlobal[i].id.toString() === movieId.toString()) {
            return moviesGlobal[i].rating;
        }
    }
}
//on edit change selection, populate form input
$("#movies_dropdown").change(()=>{
    var originalMovieName = $('#movies_dropdown option:selected').text();
    var selectedMovieId = $('#movies_dropdown option:selected').val();
    //Change form input to movie values
    $("#edit_movie_name").val(originalMovieName);
    $("#edit_rating").val(findRating(selectedMovieId));
});
//Send an edit request to the server based off form inputs
$("#edit_submit_button").click(e => {
    e.preventDefault();
    const editMovieObj = {
        id: $('#movies_dropdown option:selected').val(),
        title: $("#edit_movie_name").val(),
        rating: $("#edit_rating").val()
    };
    fetch(`${url}/${$('#movies_dropdown option:selected').val()}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editMovieObj)
    }).then(() => {
        refreshMovies();
    })
        .catch(console.error);
});
//on click of red button, delete movie
$(document).on("click", ".delete-btn",((e)=> {
    //ID is stored in the html
    let deleteMovieId = (e.target.attributes.id.value);
    const deleteOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    };
    //send data to server, if successful, refresh movies
    fetch(`${url}/${deleteMovieId}`, deleteOptions)
        .then(() => refreshMovies())
        .catch(error => console.error(error));

}));
//toggles description on mouse enter for movie cards
$(document).on({
    mouseenter: function (e) {
        $(this.childNodes[3]).toggle();
    },
    mouseleave: function (e) {
        $(this.childNodes[3]).toggle();
    }
}, ".movie-card");
//initialization
refreshMovies();

