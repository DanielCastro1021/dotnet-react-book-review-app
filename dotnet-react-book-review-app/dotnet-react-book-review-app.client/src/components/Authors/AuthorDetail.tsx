import React, {useState, useEffect} from "react";
import {useHistory, useParams, Link} from "react-router-dom";
import {authorService, bookService, Author, Book} from "../../services/api";

interface AuthorDetailParams {
    id: string;
}

const AuthorDetail: React.FC = () => {
    const history = useHistory();
    const {id} = useParams<AuthorDetailParams>();
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

        if (window.confirm(`Are you sure you want to delete "${author.fullName}"?`)) {
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
                            <h2 className="mb-0">{author.fullName}</h2>
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
                            {author.birthDate && (
                                <p className="text-muted mb-3">
                                    <i className="fas fa-calendar me-2"></i>
                                    <strong>Born:</strong> {new Date(author.birthDate).toLocaleDateString()}
                                </p>
                            )}

                            {author.biography && (
                                <div>
                                    <h5>Biography</h5>
                                    <p className="text-muted">{author.biography}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Author's Books */}
                    <div className="card shadow-sm mt-4">
                        <div className="card-header">
                            <h4 className="mb-0">
                                <i className="fas fa-book me-2"></i>
                                Books by {author.fullName} ({books.length})
                            </h4>
                        </div>
                        <div className="card-body">
                            {books.length === 0 ? (
                                <p className="text-muted text-center py-3">
                                    No books found for this author.
                                </p>
                            ) : (
                                <div className="row">
                                    {books.map((book) => (
                                        <div key={book.id} className="col-md-6 mb-3">
                                            <div className="card h-100">
                                                <div className="card-body">
                                                    <h6 className="card-title">{book.title}</h6>
                                                    <p className="card-text small text-muted">
                                                        Published: {new Date(book.publishedDate).toLocaleDateString()}
                                                    </p>
                                                    {book.description && (
                                                        <p className="card-text small">
                                                            {book.description.length > 100
                                                                ? `${book.description.substring(0, 100)}...`
                                                                : book.description
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="card-footer bg-transparent">
                                                    <Link
                                                        to={`/books/${book.id}`}
                                                        className="btn btn-sm btn-outline-primary w-100"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-header">
                            <h5 className="mb-0">Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="d-grid gap-2">
                                <Link
                                    to="/authors"
                                    className="btn btn-outline-secondary"
                                >
                                    <i className="fas fa-arrow-left me-1"></i>Back to Authors
                                </Link>
                                <Link
                                    to={`/authors/edit/${author.id}`}
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-edit me-1"></i>Edit Author
                                </Link>
                                <Link
                                    to="/books/create"
                                    className="btn btn-success"
                                >
                                    <i className="fas fa-plus me-1"></i>Add New Book
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorDetail;
