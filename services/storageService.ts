import { Book } from '../types';
import { STORAGE } from '../constants';

const STORAGE_KEY = 'hizliokur_books';

const persist = (books: Book[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch {
    // Storage full — try again after dropping the oldest entry
    if (books.length > 1) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(books.slice(0, -1)));
      } catch {
        console.error('localStorage dolu, ilerleme kaydedilemedi.');
      }
    }
  }
};

export const saveBook = (book: Book): void => {
  const books = getBooks();
  const existingIndex = books.findIndex(b => b.id === book.id);

  if (existingIndex >= 0) {
    books[existingIndex] = { ...books[existingIndex], ...book, lastRead: Date.now() };
  } else {
    books.push({ ...book, lastRead: Date.now() });
  }

  books.sort((a, b) => b.lastRead - a.lastRead);

  if (books.length > STORAGE.maxBooks) {
    books.length = STORAGE.maxBooks;
  }

  persist(books);
};

export const getBooks = (): Book[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getBook = (id: string): Book | undefined =>
  getBooks().find(b => b.id === id);

export const deleteBook = (id: string): void => {
  persist(getBooks().filter(b => b.id !== id));
};

export const updateProgress = (id: string, progress: number): void => {
  const books = getBooks();
  const book = books.find(b => b.id === id);
  if (book) {
    book.progress = progress;
    book.lastRead = Date.now();
    saveBook(book);
  }
};
