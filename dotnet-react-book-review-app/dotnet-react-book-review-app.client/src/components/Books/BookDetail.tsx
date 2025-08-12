import React, { useState, useEffect } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import { bookService, reviewService, Book, Review } from "../../services/api";

interface BookDetailParams {
    id: string;
}

const BookDetail: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<BookDetailParams>();
    const [book, setBook] = useState<Book | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchBookDetails(parseInt(id));
        }
    }, [id]);

    const fetchBookDetails = async (bookId: number) => {
        try {
            setLoading(true);
            const [bookResponse, reviewsResponse] = await Promise.all([
                bookService.getById(bookId),
                reviewService.getByBookId(bookId).catch(() => ({ data: [] }))
            ]);
            
            setBook(bookResponse.data);
            setReviews(reviewsResponse.data);
        } catch (error) {
            console.error('Error fetching book details:', error);
            alert('Book not found');
            history.push('/books');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!book) return;
        
        if (window.confirm(`Are you sure you want to delete "${book.title}"?`)) {
            try {
                await bookService.delete(book.id);
                history.push('/books');
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book. It may have associated reviews.');
            }
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={`text-${i < rating ? 'warning' : 'muted'}`}>★</span>
        ));
    };

    const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0;

    if (loading) {
        return (
            <div className="container text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Book not found</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">{book.title}</h2>
                            <div className="btn-group">
                                <Link 
                                    to={`/books/edit/${book.id}`} 
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
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6><i className="fas fa-user me-2 text-muted"></i>Author</h6>
                                    <p className="text-muted">
                                        <Link to={`/authors/${book.author?.id}`} className="text-decoration-none">
                                            {book.author?.name || 'Unknown Author'}
                                        </Link>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h6><i className="fas fa-tag me-2 text-muted"></i>Category</h6>
                                    <p className="text-muted">
                                        <Link to={`/categories/${book.category?.id}`} className="text-decoration-none">
                                            {book.category?.name || 'Uncategorized'}
                                        </Link>
                                    </p>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <h6><i className="fas fa-barcode me-2 text-muted"></i>ISBN</h6>
                                    <p className="text-muted">{book.isbn}</p>
                                </div>
                                <div className="col-md-6">
                                    <h6><i className="fas fa-calendar me-2 text-muted"></i>Publication Date</h6>
                                    <p className="text-muted">{new Date(book.publicationDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6><i className="fas fa-info-circle me-2 text-muted"></i>Description</h6>
                                <p className="text-muted" style={{ lineHeight: '1.6' }}>
                                    {book.description}
                                </p>
                            </div>

                            {reviews.length > 0 && (
                                <div className="mb-4">
                                    <h6><i className="fas fa-star me-2 text-muted"></i>Average Rating</h6>
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            {renderStars(Math.round(averageRating))}
                                        </div>
                                        <span className="text-muted">
                                            {averageRating.toFixed(1)} out of 5 ({reviews.length} reviews)
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="card shadow-sm mt-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <i className="fas fa-comments me-2"></i>
                                Reviews ({reviews.length})
                            </h4>
                            <Link 
                                to={`/reviews/create?bookId=${book.id}`}
                                className="btn btn-outline-primary btn-sm"
                            >
                                <i className="fas fa-plus me-1"></i>Add Review
                            </Link>
                        </div>
                        <div className="card-body">
                            {reviews.length > 0 ? (
                                <div className="row">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="col-12 mb-4">
                                            <div className="card border-0 bg-light">
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 className="card-title mb-1">{review.reviewerName}</h6>
                                                            <div className="mb-2">
                                                                {renderStars(review.rating)}
                                                                <span className="text-muted ms-2">({review.rating}/5)</span>
                                                            </div>
                                                        </div>
                                                        <small className="text-muted">
                                                            {new Date(review.reviewDate).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                    <p className="card-text">{review.comment}</p>
                                                    <div className="btn-group btn-group-sm">
                                                        <Link 
                                                            to={`/reviews/edit/${review.id}`}
                                                            className="btn btn-outline-secondary"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <Link 
                                                            to={`/reviews/${review.id}`}
                                                            className="btn btn-outline-primary"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-comment text-muted mb-3" style={{ fontSize: '2rem' }}></i>
                                    <p className="text-muted">No reviews yet for this book.</p>
                                    <Link 
                                        to={`/reviews/create?bookId=${book.id}`}
                                        className="btn btn-primary"
                                    >
                                        Write First Review
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
                                <Link to="/books" className="btn btn-outline-secondary">
                                    <i className="fas fa-arrow-left me-2"></i>Back to Books
                                </Link>
                                <Link 
                                    to={`/books/edit/${book.id}`} 
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-edit me-2"></i>Edit Book
                                </Link>
                                <Link 
                                    to={`/reviews/create?bookId=${book.id}`}
                                    className="btn btn-success"
                                >
                                    <i className="fas fa-plus me-2"></i>Write Review
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-header">
                            <h5 className="mb-0">Book Statistics</h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="border-end">
                                        <h4 className="text-primary mb-0">{reviews.length}</h4>
                                        <small className="text-muted">Reviews</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <h4 className="text-warning mb-0">
                                        {reviews.length > 0 ? averageRating.toFixed(1) : 'N/A'}
                                    </h4>
                                    <small className="text-muted">Avg Rating</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetail;
