import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {reviewService, Review} from "../../services/api";

const ReviewList: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await reviewService.getAll();
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, userName: string) => {
        if (window.confirm(`Are you sure you want to delete the review by "${userName}"?`)) {
            try {
                await reviewService.delete(id);
                setReviews(reviews.filter(review => review.id !== id));
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Failed to delete review.');
            }
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({length: 5}, (_, i) => (
            <span key={i} className={`text-${i < rating ? 'warning' : 'muted'}`}>★</span>
        ));
    };

    const filteredReviews = reviews.filter(review =>
        (review.user?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        review.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (review.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
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
                <h2>Reviews</h2>
                <Link to="/reviews/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Review
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
                            placeholder="Search reviews, reviewers, or books..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {filteredReviews.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-comment text-muted mb-3" style={{fontSize: '3rem'}}></i>
                    <h4 className="text-muted">No reviews found</h4>
                    <p className="text-muted">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first review!'}
                    </p>
                    {!searchTerm && (
                        <Link to="/reviews/create" className="btn btn-primary">Add First Review</Link>
                    )}
                </div>
            ) : (
                <div className="row">
                    {filteredReviews.map((review) => (
                        <div key={review.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">{review.user?.userName}</h5>
                                        <small className="text-muted">
                                            {new Date(review.createdDate).toLocaleDateString()}
                                        </small>
                                    </div>

                                    <div className="mb-2">
                                        {renderStars(review.rating)}
                                        <span className="text-muted ms-2">({review.rating}/5)</span>
                                    </div>

                                    <p className="text-muted small mb-2">
                                        <i className="fas fa-book me-1"></i>
                                        <Link
                                            to={`/books/${review.book?.id}`}
                                            className="text-decoration-none"
                                        >
                                            {review.book?.title || 'Unknown Book'}
                                        </Link>
                                    </p>

                                    <p className="card-text text-muted small">
                                        {review.content.length > 120
                                            ? `${review.content.substring(0, 120)}...`
                                            : review.content
                                        }
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="btn-group w-100" role="group">
                                        <Link
                                            to={`/reviews/${review.id}`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            to={`/reviews/edit/${review.id}`}
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(review.id, review.user?.userName || '')}
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

export default ReviewList;
