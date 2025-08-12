import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {
    Book,
    bookService,
    authorService,
    reviewService
} from "../../services/api";

// Define Statistics interface locally
interface Statistics {
    totalBooks: number;
    totalAuthors: number;
    totalReviews: number;
    averageRating: number;
}

const HomeIndex: React.FC = () => {
    const [stats, setStats] = useState<Statistics | null>(null);
    const [recentBooks, setRecentBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [authorsCountResponse, booksCountResponse, reviewsCountResponse, averageRatingResponse, recentBooksResponse] = await Promise.all([
                    authorService.count(),
                    bookService.count(),
                    reviewService.count(),
                    reviewService.getAverageRating(),
                    bookService.getRecent().catch(() => ({data: []}))
                ]);

                setStats({
                    totalAuthors: authorsCountResponse.data,
                    totalBooks: booksCountResponse.data,
                    totalReviews: reviewsCountResponse.data,
                    averageRating: averageRatingResponse.data
                });
                setRecentBooks(recentBooksResponse.data);
            } catch (error) {
                console.error('Error fetching home data:', error);
                // Set default values if API calls fail
                setStats({totalBooks: 0, totalAuthors: 0, totalReviews: 0, averageRating: 0});
                setRecentBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const renderStars = (rating: number) => {
        return Array.from({length: 5}, (_, i) => (
            <span key={i} className={`text-${i < rating ? 'warning' : 'muted'}`}>★</span>
        ));
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

    return (
        <div>
            {/* Hero Section */}
            <section className="hero-section bg-primary text-white py-5 mb-5">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <h1 className="display-4 fw-bold mb-4">Discover Your Next Great Read</h1>
                            <p className="lead mb-4">
                                Explore thousands of books, read reviews from fellow readers, and share your own
                                literary adventures
                                in our vibrant book review community.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/books" className="btn btn-light btn-lg">Browse Books</Link>
                                <Link to="/reviews" className="btn btn-outline-light btn-lg">Read Reviews</Link>
                            </div>
                        </div>
                        <div className="col-md-6 text-center">
                            <div className="hero-icon">
                                <i className="fas fa-book-open" style={{fontSize: '8rem', opacity: 0.8}}></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container">
                {/* Statistics Section */}
                <section className="stats-section mb-5">
                    <div className="row text-center">
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="text-primary mb-2">
                                        <i className="fas fa-book" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="display-6 fw-bold text-primary">{stats?.totalBooks || 0}</h3>
                                    <p className="text-muted mb-0">Books</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="text-success mb-2">
                                        <i className="fas fa-user-edit" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="display-6 fw-bold text-success">{stats?.totalAuthors || 0}</h3>
                                    <p className="text-muted mb-0">Authors</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="text-info mb-2">
                                        <i className="fas fa-comment" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <h3 className="display-6 fw-bold text-info">{stats?.totalReviews || 0}</h3>
                                    <p className="text-muted mb-0">Reviews</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 mb-4">
                            <div className="card h-100 border-0 shadow-sm">
                                <div className="card-body">
                                    <div className="text-warning mb-3">
                                        <i className="fas fa-star" style={{fontSize: '2.5rem'}}></i>
                                    </div>
                                    <div className="mb-2">
                                        <div className="d-flex justify-content-center align-items-center">
                                            <div style={{fontSize: '1.5rem'}}>
                                                {renderStars(Math.round(stats?.averageRating || 0))}
                                            </div>
                                        </div>
                                    </div>
                                    <h4 className="fw-bold text-warning mb-1">{stats?.averageRating?.toFixed(1) || '0.0'}/5</h4>
                                    <p className="text-muted mb-0">Avg Rating</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Books Section */}
                <section className="recent-books-section mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="h3 mb-0">Recently Added Books</h2>
                        <Link to="/books" className="btn btn-outline-primary">View All Books</Link>
                    </div>

                    {recentBooks.length > 0 ? (
                        <div className="row">
                            {recentBooks.slice(0, 3).map((book) => (
                                <div key={book.id} className="col-md-4 mb-4">
                                    <div className="card h-100 shadow-sm book-card">
                                        <div className="card-body">
                                            <h5 className="card-title text-truncate" title={book.title}>
                                                {book.title}
                                            </h5>
                                            <p className="text-muted small mb-2">
                                                by {book.author?.fullName || 'Unknown Author'}
                                            </p>
                                            <p className="text-muted small mb-2">
                                                <i className="fas fa-tag me-1"></i>
                                                {book.category?.name || 'Uncategorized'}
                                            </p>
                                            <p className="card-text small text-muted">
                                                {book.description && book.description.length > 100
                                                    ? `${book.description.substring(0, 100)}...`
                                                    : book.description || 'No description available.'
                                                }
                                            </p>
                                            <div className="d-flex justify-content-between align-items-center mt-3">
                                                <small className="text-muted">
                                                    {new Date(book.publishedDate).getFullYear()}
                                                </small>
                                                <Link to={`/books/${book.id}`} className="btn btn-sm btn-primary">
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-book-open text-muted mb-3" style={{fontSize: '3rem'}}></i>
                            <h4 className="text-muted">No books available yet</h4>
                            <p className="text-muted">Be the first to add a book to our collection!</p>
                            <Link to="/books/create" className="btn btn-primary">Add First Book</Link>
                        </div>
                    )}
                </section>

                {/* Features Section */}
                <section className="features-section mb-5">
                    <h2 className="text-center mb-5">Why Choose Our Book Review Platform?</h2>
                    <div className="row">
                        <div className="col-md-4 mb-4 text-center">
                            <div className="feature-icon text-primary mb-3">
                                <i className="fas fa-users" style={{fontSize: '3rem'}}></i>
                            </div>
                            <h4>Community Driven</h4>
                            <p className="text-muted">Connect with fellow book lovers and discover recommendations from
                                a passionate community.</p>
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <div className="feature-icon text-success mb-3">
                                <i className="fas fa-search" style={{fontSize: '3rem'}}></i>
                            </div>
                            <h4>Easy Discovery</h4>
                            <p className="text-muted">Find your next favorite book with our intuitive search and
                                categorization system.</p>
                        </div>
                        <div className="col-md-4 mb-4 text-center">
                            <div className="feature-icon text-info mb-3">
                                <i className="fas fa-star-half-alt" style={{fontSize: '3rem'}}></i>
                            </div>
                            <h4>Honest Reviews</h4>
                            <p className="text-muted">Read and write detailed reviews to help others make informed
                                reading choices.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomeIndex;