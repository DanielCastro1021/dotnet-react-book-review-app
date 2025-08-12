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
    firstName: string;
    lastName: string;
    fullName: string; // Computed property from backend
    biography?: string;
    birthDate?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Book {
    id: number;
    title: string;
    isbn?: string;
    description?: string;
    publishedDate: string; // Changed from publicationDate to match backend
    authorId: number;
    categoryId?: number; // Made optional as it can be null
    author?: Author;
    category?: Category;
}

export interface Review {
    id: number;
    content: string; // Changed from comment to match backend
    rating: number;
    createdDate: string; // Changed from reviewDate to match backend
    bookId: number;
    userId: string; // Identity user ID is a string
    book?: Book;
    user?: {
        id: string;
        userName: string;
        email: string;
    };
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
