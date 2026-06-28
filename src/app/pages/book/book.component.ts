import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BooksService } from '../../services/books.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css', '../home/home.component.css']
})
export class BookComponent {
  bookTitle = '';
  book: any;
  private defaultPoster = 'assets/default.png';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private booksService: BooksService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookTitle = params.get('bookTitle') ?? '';

      this.booksService.loadData().subscribe(() => {
        this.book = this.booksService.getBooksDetailsByTitle(this.bookTitle);

        if (!this.book) {
          this.router.navigate(['/books']);
        }
      });
    });
  }

  setDefaultPoster(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultPoster;
  }

  formatReadingDate(date: string): string {
    if (!date) {
      return '';
    }

    const [year, month] = date.split('-');

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    return `${months[Number(month) - 1]} ${year}`;
  }
}
