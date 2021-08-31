"use strict";
var moviesGlobal = {};
const url = "https://obtainable-scrawny-cactus.glitch.me/movies";
//gathers all movie objects and displays on html
function refreshMovies (){
    $(".insert-movie-cards").html("loading");
    fetch(url).then( response => {
        response.json().then(movies => {
            //create global movies object
            moviesGlobal = movies;
            console.log(moviesGlobal);
            //clear html, if any
            var html = "";
            movies.forEach(movie => {
                html+= `<div class="card text-center col-4">${movie.title} 
                <div class="delete-btn" id=${movie.id}></div>
                </div>`;
            });
            //change html to movies
            $(".insert-movie-cards").html(html);

            //refresh list of movies in dropdown
            var editMoviesDropdown = "";
            moviesGlobal.forEach(movie => {
                editMoviesDropdown += `<option value="${movie.id}">${movie.title}</option>`
            });
            $("#movies_dropdown").html(editMoviesDropdown);
        });
    });
}
//on submit, create movie and post to server
$("#submit_button").click(e => {
    e.preventDefault();

    //movie object creation based off values
    const movieObj = {
        id: moviesGlobal.length + 1,
        title: $("#movie_name").val(),
        rating: $("#rating").val()
    };
    //posting to server
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieObj),
    };
    //send data to server, if successful, refresh movies
    fetch(url, options)
        .then(() => refreshMovies())
        .catch( error => console.error(error) );
});
//edit movies
//on change selection, populate form input
$("#movies_dropdown").change(()=>{
    //grabs text of option selection
    var originalMovieName = $('#movies_dropdown option:selected').text();
    var selectedMovieId = $('#movies_dropdown option:selected').val();
    console.log($('#movies_dropdown option:selected').val())
    //changes form input text to selected option
    $("#edit_movie_name").val(originalMovieName);
    $("#edit_rating").val(findRating(selectedMovieId));
});
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
$("#edit_submit_button").click(e => {
    e.preventDefault();
    const movieObj = {
        id: $('#movies_dropdown option:selected').val(),
        title: $("#edit_movie_name").val(),
        rating: $("#edit_rating").val()
    };
    fetch(`${url}/${$('#movies_dropdown option:selected').val()}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieObj)
    }).then(() => {
        refreshMovies();
    })
        .catch(console.error);

});
$(".delete-btn").mousedown(()=>{
    console.log("button clicked");
    let deleteMovieId = $('.delete-btn').data("id")
    console.log(deleteMovieId);
});
//initialization
refreshMovies();

