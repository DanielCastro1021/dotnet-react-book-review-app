import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookService, Book } from "../../services/api";

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await bookService.getAll();
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await bookService.delete(id);
                setBooks(books.filter(book => book.id !== id));
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book. It may have associated reviews.');
            }
        }
    };

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Books</h2>
                <Link to="/books/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Book
                </Link>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="input-group">
                        <span className="input-group-text">
                            <i className="fas fa-search"></i>
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search books, authors, or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {filteredBooks.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-book text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <h4 className="text-muted">No books found</h4>
                    <p className="text-muted">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first book!'}
                    </p>
                    {!searchTerm && (
                        <Link to="/books/create" className="btn btn-primary">Add First Book</Link>
                    )}
                </div>
            ) : (
                <div className="row">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title text-truncate" title={book.title}>
                                        {book.title}
                                    </h5>
                                    <p className="text-muted small mb-2">
                                        <i className="fas fa-user me-1"></i>
                                        by {book.author?.fullName || 'Unknown Author'}
                                    </p>
                                    <p className="text-muted small mb-2">
                                        <i className="fas fa-tag me-1"></i>
                                        {book.category?.name || 'Uncategorized'}
                                    </p>
                                    <p className="text-muted small mb-2">
                                        <i className="fas fa-calendar me-1"></i>
                                        {new Date(book.publishedDate).getFullYear()}
                                    </p>
                                    <p className="text-muted small mb-2">
                                        <i className="fas fa-barcode me-1"></i>
                                        ISBN: {book.isbn || 'N/A'}
                                    </p>
                                    <p className="card-text text-muted small">
                                        {book.description && book.description.length > 100 
                                            ? `${book.description.substring(0, 100)}...` 
                                            : book.description || 'No description available.'
                                        }
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="btn-group w-100" role="group">
                                        <Link 
                                            to={`/books/${book.id}`} 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            View
                                        </Link>
                                        <Link 
                                            to={`/books/edit/${book.id}`} 
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(book.id, book.title)}
                                            className="btn btn-outline-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BookList;
