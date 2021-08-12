
const autoCompleteConfig ={
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
            return `
            <img src = "${imgSrc}">
            ${movie.Title} (<h4>${movie.Year}</h4>)
            
            `
            ;
        },
    inputValue(movie){
        return movie.Title;
    },
     async fetchData (searchTerm){
        
            const response = await axios.get('http://www.omdbapi.com/',{
            params :{
                apikey :'7ec0b6ab',
                s:searchTerm
            }
            });
        
            if(response.data.Error){
                return [];
            }
            return response.data.Search;
        }
};

createAutoComplete({
    ...autoCompleteConfig,
    root :document.querySelector('#left-autocomplete'),
    
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#left-summary'),'left');
    },
    
})

createAutoComplete({
    ...autoCompleteConfig,
    root :document.querySelector('#right-autocomplete'),
    
    onOptionSelect(movie){
        document.querySelector('.tutorial').classList.add('is-hidden');
        onMovieSelect(movie,document.querySelector('#right-summary'),'right');
    },
    
})



let leftMovie;
let rightMovie;
const onMovieSelect = async (movie,summaryElement,side) =>{

    const response = await axios.get('http://www.omdbapi.com/',{
        params :{
            apikey :'7ec0b6ab',
            i:movie.imdbID
        }
        });
        summaryElement.innerHTML = movieTemplate(response.data)
        
        if(side === 'left'){
            leftMovie = response.data
        }
        else{
            rightMovie = response.data
        }
        
        if(leftMovie && rightMovie){
            runComparison()
        }
    
};

const runComparison = ()=>{
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStats,index)=>{
        const rightStats = rightSideStats[index];
       
        const leftSideValue = parseInt(leftStats.dataset.value);
        const rightSideValue = parseInt(rightStats.dataset.value);

        if(leftSideValue > rightSideValue){
            rightStats.classList.remove('is-primary');
            rightStats.classList.add('is-danger');
        }
        else{
            leftStats.classList.remove('is-primary');
            leftStats.classList.add('is-danger');
        }
    });
    
}
   

const movieTemplate = (movieDetails) =>{

    const metascore = parseInt(movieDetails.Metascore);
    const imdbRating = parseFloat(movieDetails.imdbRating);
    const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ''));
    const BoxOffice = parseInt(movieDetails.BoxOffice.replace(/,/g,'').replace(/\$/g, ''));
  

    const award = movieDetails.Awards.split(' ').reduce((prev,word)=>{
        const value = parseInt(word);
        if(isNaN(value)){
            return prev;
        }else{
            return prev + value;
        }
    }, 0)


    return `
        <article class = "media">
            <figure class = "media-left>
                <p class = "image">
                    <img src = "${movieDetails.Poster}"
                </p>
            </figure>

            <div class = "media-content">
                <div class = "content">
                    <h1>${movieDetails.Title}</h1>
                    <h4>${movieDetails.Genre}</h4>
                    <p>${movieDetails.Plot}</p>

                </div>
            </div>
        </article>
        
        <article  data-value =${award} class = "notification is-primary">
            <p class ="title">${movieDetails.Awards}</p>
            <p class ="subtitle">Awards</p>
        </article>

        
        <article data-value =${BoxOffice} class = "notification is-primary">
            <p class ="title">${movieDetails.BoxOffice}</p>
            <p class ="subtitle">Box Office</p>
        </article>

        
        <article data-value =${metascore} class = "notification is-primary">
            <p class ="title">${movieDetails.Metascore}</p>
            <p class ="subtitle">Metascore</p>
        </article>

        
        <article data-value =${imdbRating} class= "notification is-primary">
            <p class ="title">${movieDetails.imdbRating}</p>
            <p class ="subtitle">IMDB</p>
        </article>

        
        <article data-value =${imdbVotes} class = "notification is-primary">
            <p class ="title">${movieDetails.imdbVotes}</p>
            <p class ="subtitle">IMDB votes</p>
        </article>


    `;
}
