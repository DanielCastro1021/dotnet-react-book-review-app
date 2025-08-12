import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { authorService, bookService, Author, Book } from "../../services/api";

interface AuthorDetailParams {
    id: string;
}

const AuthorDetail: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<AuthorDetailParams>();
    const [author, setAuthor] = useState<Author | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchAuthorDetails(parseInt(id));
        }
    }, [id]);

    const fetchAuthorDetails = async (authorId: number) => {
        try {
            setLoading(true);
            const [authorResponse, booksResponse] = await Promise.all([
                authorService.getById(authorId),
                bookService.getAll()
            ]);
            
            setAuthor(authorResponse.data);
            // Filter books by this author
            const authorBooks = booksResponse.data.filter(book => book.authorId === authorId);
            setBooks(authorBooks);
        } catch (error) {
            console.error('Error fetching author details:', error);
            alert('Author not found');
            history.push('/authors');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!author) return;
        
        if (window.confirm(`Are you sure you want to delete "${author.name}"?`)) {
            try {
                await authorService.delete(author.id);
                history.push('/authors');
            } catch (error) {
                console.error('Error deleting author:', error);
                alert('Failed to delete author. They may have associated books.');
            }
        }
    };

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!author) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Author not found</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">{author.name}</h2>
                            <div className="btn-group">
                                <Link 
                                    to={`/authors/edit/${author.id}`} 
                                    className="btn btn-outline-primary btn-sm"
                                >
                                    <i className="fas fa-edit me-1"></i>Edit
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-outline-danger btn-sm"
                                >
                                    <i className="fas fa-trash me-1"></i>Delete
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="mb-4">
                                <h5><i className="fas fa-calendar me-2 text-muted"></i>Birth Date</h5>
                                <p className="text-muted">{new Date(author.birthDate).toLocaleDateString()}</p>
                            </div>
                            
                            <div className="mb-4">
                                <h5><i className="fas fa-user me-2 text-muted"></i>Biography</h5>
                                <p className="text-muted" style={{ lineHeight: '1.6' }}>
                                    {author.biography}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <i className="fas fa-books me-2"></i>
                                Books by {author.name} ({books.length})
                            </h4>
                            <Link 
                                to="/books/create" 
                                className="btn btn-outline-primary btn-sm"
                            >
                                <i className="fas fa-plus me-1"></i>Add Book
                            </Link>
                        </div>
                        <div className="card-body">
                            {books.length > 0 ? (
                                <div className="row">
                                    {books.map((book) => (
                                        <div key={book.id} className="col-md-6 mb-3">
                                            <div className="card h-100 border-0 bg-light">
                                                <div className="card-body">
                                                    <h6 className="card-title">{book.title}</h6>
                                                    <p className="card-text small text-muted mb-2">
                                                        <i className="fas fa-tag me-1"></i>
                                                        {book.category?.name || 'Uncategorized'}
                                                    </p>
                                                    <p className="card-text small text-muted mb-2">
                                                        <i className="fas fa-calendar me-1"></i>
                                                        Published: {new Date(book.publicationDate).getFullYear()}
                                                    </p>
                                                    <p className="card-text small">
                                                        {book.description && book.description.length > 100 
                                                            ? `${book.description.substring(0, 100)}...` 
                                                            : book.description || 'No description available'
                                                        }
                                                    </p>
                                                    <Link 
                                                        to={`/books/${book.id}`} 
                                                        className="btn btn-sm btn-primary mt-2"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-book text-muted mb-3" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted">No books found for this author.</p>
                                    <Link to="/books/create" className="btn btn-primary">
                                        Add First Book
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link to="/authors" className="btn btn-outline-secondary">
                                    <i className="fas fa-arrow-left me-2"></i>Back to Authors
                                </Link>
                                <Link 
                                    to={`/authors/edit/${author.id}`} 
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-edit me-2"></i>Edit Author
                                </Link>
                                <Link to="/books/create" className="btn btn-success">
                                    <i className="fas fa-plus me-2"></i>Add New Book
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-header">
                            <h5 className="mb-0">Statistics</h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="border-end">
                                        <h4 className="text-primary mb-0">{books.length}</h4>
                                        <small className="text-muted">Books</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h4 className="text-success mb-0">
                                        {new Date().getFullYear() - new Date(author.birthDate).getFullYear()}
                                    </h4>
                                    <small className="text-muted">Years Old</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorDetail;
