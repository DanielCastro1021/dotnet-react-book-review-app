import axios from 'axios';

// Use relative URL since Vite proxy will handle routing to the backend
const API_BASE_URL = '';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Types
export interface Author {
    id: number;
    name: string;
    biography: string;
    birthDate: string;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Book {
    id: number;
    title: string;
    isbn: string;
    publicationDate: string;
    authorId: number;
    categoryId: number;
    author?: Author;
    category?: Category;
    description: string;
}

export interface Review {
    id: number;
    bookId: number;
    reviewerName: string;
    rating: number;
    comment: string;
    reviewDate: string;
    book?: Book;
}

export interface Statistics {
    totalBooks: number;
    totalAuthors: number;
    totalReviews: number;
    averageRating: number;
}

// API Services
export const authorService = {
    getAll: () => api.get<Author[]>('/api/Author'),
    getById: (id: number) => api.get<Author>(`/api/Author/${id}`),
    create: (author: Omit<Author, 'id'>) => api.post<Author>('/api/Author', author),
    update: (id: number, author: Omit<Author, 'id'>) => api.put<Author>(`/api/Author/${id}`, author),
    delete: (id: number) => api.delete(`/api/Author/${id}`),
    count: () => api.get<number>('/api/Author/count'),
};

export const categoryService = {
    getAll: () => api.get<Category[]>('/api/Category'),
    getById: (id: number) => api.get<Category>(`/api/Category/${id}`),
    create: (category: Omit<Category, 'id'>) => api.post<Category>('/api/Category', category),
    update: (id: number, category: Omit<Category, 'id'>) => api.put<Category>(`/api/Category/${id}`, category),
    delete: (id: number) => api.delete(`/api/Category/${id}`),
    count: () => api.get<number>('/api/Category/count'),
};

export const bookService = {
    getAll: () => api.get<Book[]>('/api/Book'),
    getById: (id: number) => api.get<Book>(`/api/Book/${id}`),
    create: (book: Omit<Book, 'id'>) => api.post<Book>('/api/Book', book),
    update: (id: number, book: Omit<Book, 'id'>) => api.put<Book>(`/api/Book/${id}`, book),
    delete: (id: number) => api.delete(`/api/Book/${id}`),
    getRecent: () => api.get<Book[]>('/api/Book/recent'),
    count: () => api.get<number>('/api/Book/count'),
};

export const reviewService = {
    getAll: () => api.get<Review[]>('/api/Review'),
    getById: (id: number) => api.get<Review>(`/api/Review/${id}`),
    getByBookId: (bookId: number) => api.get<Review[]>(`/api/Review/book/${bookId}`),
    create: (review: Omit<Review, 'id'>) => api.post<Review>('/api/Review', review),
    update: (id: number, review: Omit<Review, 'id'>) => api.put<Review>(`/api/Review/${id}`, review),
    delete: (id: number) => api.delete(`/api/Review/${id}`),
    count: () => api.get<number>('/api/Review/count'),
    getAverageRating: () => api.get<number>('/api/Review/average-rating'),
};
