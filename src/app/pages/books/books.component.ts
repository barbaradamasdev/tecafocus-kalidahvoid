import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent } from "../../components/card/card.component";
import { BooksService } from '../../services/books.service';
import { BannerComponent } from '../../components/banner/banner.component';

@Component({
    selector: 'app-list',
    standalone: true,
    templateUrl: './books.component.html',
    styleUrls: ['../home/home.component.css', '../list/list.component.css'],
    imports: [CommonModule, CardComponent, BannerComponent]
})
export class BooksComponent {
  books : any[] = [];
  totalBooks: number = 0;

  constructor(
    private booksService: BooksService,
  ) {}

  ngOnInit(): void {
    this.booksService.loadData().subscribe(() => {
    this.books = this.booksService.books;

    this.books.sort((a, b) => {
      const notaA = typeof a.TecaNota === 'number' ? a.TecaNota : -1;
      const notaB = typeof b.TecaNota === 'number' ? b.TecaNota : -1;

      return notaB - notaA;
    });

    this.totalBooks = this.books.length;
    });
  }
}
