import React, {useState, useEffect} from "react";
import {useHistory, useParams, Link} from "react-router-dom";
import {reviewService, Review} from "../../services/api";

interface ReviewDetailParams {
    id: string;
}

const ReviewDetail: React.FC = () => {
    const history = useHistory();
    const {id} = useParams<ReviewDetailParams>();
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchReviewDetails(parseInt(id));
        }
    }, [id]);

    const fetchReviewDetails = async (reviewId: number) => {
        try {
            setLoading(true);
            const response = await reviewService.getById(reviewId);
            setReview(response.data);
        } catch (error) {
            console.error('Error fetching review details:', error);
            alert('Review not found');
            history.push('/reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!review) return;

        if (window.confirm(`Are you sure you want to delete this review by "${review.user?.userName || 'Anonymous User'}"?`)) {
            try {
                await reviewService.delete(review.id);
                history.push('/reviews');
            } catch (error) {
                console.error('Error deleting review:', error);
                alert('Failed to delete review.');
            }
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({length: 5}, (_, i) => (
            <span key={i} className={`text-${i < rating ? 'warning' : 'muted'} fs-4`}>★</span>
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

    if (!review) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Review not found</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">Review by {review.user?.userName || 'Anonymous User'}</h2>
                            <div className="btn-group">
                                <Link
                                    to={`/reviews/edit/${review.id}`}
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
                                    <h6><i className="fas fa-book me-2 text-muted"></i>Book</h6>
                                    <p className="text-muted">
                                        <Link to={`/books/${review.book?.id}`} className="text-decoration-none">
                                            {review.book?.title || 'Unknown Book'}
                                        </Link>
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <h6><i className="fas fa-calendar me-2 text-muted"></i>Review Date</h6>
                                    <p className="text-muted">{new Date(review.createdDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6><i className="fas fa-star me-2 text-muted"></i>Rating</h6>
                                <div className="d-flex align-items-center mb-3">
                                    {renderStars(review.rating)}
                                    <span className="ms-3 text-muted">({review.rating}/5)</span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6><i className="fas fa-comment me-2 text-muted"></i>Review Content</h6>
                                <p className="text-muted" style={{lineHeight: '1.6', whiteSpace: 'pre-wrap'}}>
                                    {review.content}
                                </p>
                            </div>
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
                                <Link to="/reviews" className="btn btn-outline-secondary">
                                    <i className="fas fa-arrow-left me-2"></i>Back to Reviews
                                </Link>
                                <Link
                                    to={`/reviews/edit/${review.id}`}
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-edit me-2"></i>Edit Review
                                </Link>
                                <Link
                                    to={`/books/${review.book?.id}`}
                                    className="btn btn-success"
                                >
                                    <i className="fas fa-book me-2"></i>View Book
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-3">
                        <div className="card-header">
                            <h5 className="mb-0">Review Details</h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-12 mb-3">
                                    <div className="border-bottom pb-2 mb-2">
                                        <h4 className="text-warning mb-0">{review.rating}/5</h4>
                                        <small className="text-muted">Rating</small>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <h6 className="text-primary mb-0">{review.user?.userName || 'Anonymous'}</h6>
                                    <small className="text-muted">Reviewer</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetail;
