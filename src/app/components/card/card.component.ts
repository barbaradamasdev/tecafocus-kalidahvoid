import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { MoviedbService } from '../../services/moviedb.service';
import { BooksService } from '../../services/books.service';
import { GamesService } from '../../services/games.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit  {
  @Input() movieTitle: string = '';
  @Input() movieDirector: string = '';
  @Input() movieYear: number = 0;
  @Input() movieGenre: string = '';
  @Input() moviePoster: string = '';
  @Input() movieimdbRating: string = '';
  @Input() tecaNota?: string;

  @Input() bookTitle: string = '';
  @Input() bookAuthor: string = '';
  @Input() bookGenre: string = '';
  @Input() bookImageUrl: string = '';
  @Input() bookYear: number = 0;
  @Input() bookPageCount: number = 0;
  @Input() bookReadingDate: string = '';
  @Input() bookSynopsis: string = '';

  @Input() gameTitle: string = '';
  @Input() gameDeveloper: string = '';
  @Input() gameGenre: string = '';
  @Input() gameReleaseYear: string = '';
  @Input() gameSynopsis: number = 0;
  @Input() gameImageUrl: number = 0;
  @Input() gameAwards: string[] = [];
  @Input() gameRating: string = '';
  @Input() gameYear: string = '';

  isMovie: boolean = false;
  isBook: boolean = false;
  isGame: boolean = false;

  private defaultPoster: string = 'assets/default.png';

  constructor(
    private MoviedbService: MoviedbService,
    private BooksService: BooksService,
    private GamesService: GamesService,
    private CategoryService: CategoryService) {}

  ngOnInit() {
    this.loadDetails();
  }

  loadDetails() {
    this.isMovie = !!this.movieTitle && this.movieTitle.trim() !== '' && (!this.bookTitle || this.bookTitle.trim() === '');
    this.isBook = !!this.bookTitle && this.bookTitle.trim() !== '';
    this.isGame = !this.isMovie && !this.isBook;

    if (this.isMovie) {
      this.loadMovieDetails();
    } else if (this.isBook) {
      this.loadBookDetails();
    } else {
      this.loadGamesDetails();
    }
  }

  loadMovieDetails() {
    let movieDetails = this.CategoryService.getMovieDetailsByTitle(this.movieTitle);

    if (!movieDetails) {
      movieDetails = this.MoviedbService.getMovieByTitle(this.movieTitle)
    }

    this.movieYear = movieDetails.Year;
    this.movieDirector = movieDetails.Director;
    this.moviePoster = (movieDetails?.Poster && movieDetails.Poster !== 'N/A')
    ? movieDetails.Poster
    : this.defaultPoster;
    this.movieimdbRating = movieDetails.imdbRating;
    this.tecaNota = movieDetails.TecaNota;
  }

  setDefaultPoster(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultPoster;

    this.MoviedbService.getMovieByTitle(this.movieTitle).subscribe(
      (movie) => {
        this.moviePoster = movie.Poster;
      }
    );
  }

  loadBookDetails() {
    let bookDetails = this.BooksService.getBooksDetailsByTitle(this.bookTitle);

    this.bookAuthor = bookDetails.author;
    this.bookGenre = bookDetails.genre;
    this.bookImageUrl = (bookDetails?.image_url && bookDetails.image_url !== 'N/A')
      ? bookDetails.image_url
      : this.defaultPoster;
    this.bookYear = bookDetails.release_year;
    this.bookPageCount = bookDetails.page_count;
    const [year, month] = bookDetails.reading_date.split('-');
    this.bookReadingDate = year;
    this.bookSynopsis = bookDetails.synopsis;
    this.tecaNota = bookDetails.TecaNota;
  }

  loadGamesDetails() {
    let gameDetails = this.GamesService.getGamesDetailsByTitle(this.gameTitle);
    console.log(gameDetails)

    this.gameDeveloper = gameDetails.developer;
    this.gameGenre = gameDetails.genre;
    this.gameReleaseYear = gameDetails.release_year;
    this.gameSynopsis = gameDetails.description;

    this.gameImageUrl = (gameDetails?.image_url && gameDetails.image_url !== 'N/A')
      ? gameDetails.image_url
      : this.defaultPoster;

    this.gameAwards = gameDetails.awards;
    this.gameRating = gameDetails.rating;
    this.gameYear = gameDetails.release_year;
    this.tecaNota = gameDetails.TecaNota;
  }
}
