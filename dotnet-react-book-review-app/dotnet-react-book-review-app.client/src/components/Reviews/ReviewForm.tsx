import React, { useState, useEffect } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { reviewService, bookService, Review, Book } from "../../services/api";

interface ReviewFormParams {
    id?: string;
}

const ReviewForm: React.FC = () => {
    const history = useHistory();
    const location = useLocation();
    const { id } = useParams<ReviewFormParams>();
    const isEditing = Boolean(id);

    // Get bookId from URL query params
    const queryParams = new URLSearchParams(location.search);
    const preselectedBookId = queryParams.get('bookId');

    const [formData, setFormData] = useState({
        bookId: preselectedBookId || '',
        reviewerName: '',
        rating: 1,
        comment: ''
    });
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        fetchBooks();
    }, []);

    useEffect(() => {
        if (isEditing && id && books.length > 0) {
            fetchReview(parseInt(id));
        }
    }, [id, isEditing, books]);

    const fetchBooks = async () => {
        try {
            setInitialLoading(true);
            const response = await bookService.getAll();
            setBooks(response.data);
        } catch (error) {
            console.error('Error fetching books:', error);
            setBooks([]);
        } finally {
            setInitialLoading(false);
        }
    };

    const fetchReview = async (reviewId: number) => {
        try {
            setLoading(true);
            const response = await reviewService.getById(reviewId);
            const review = response.data;
            setFormData({
                bookId: review.bookId.toString(),
                reviewerName: review.reviewerName,
                rating: review.rating,
                comment: review.comment
            });
        } catch (error) {
            console.error('Error fetching review:', error);
            alert('Review not found');
            history.push('/reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};

        if (!formData.bookId) {
            newErrors.bookId = 'Book is required';
        }

        if (!formData.reviewerName.trim()) {
            newErrors.reviewerName = 'Reviewer name is required';
        }

        if (formData.rating < 1 || formData.rating > 5) {
            newErrors.rating = 'Rating must be between 1 and 5';
        }

        if (!formData.comment.trim()) {
            newErrors.comment = 'Comment is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            
            const reviewData = {
                ...formData,
                bookId: parseInt(formData.bookId),
                reviewDate: new Date().toISOString()
            };
            
            if (isEditing && id) {
                await reviewService.update(parseInt(id), reviewData);
            } else {
                await reviewService.create(reviewData);
            }
            
            history.push('/reviews');
        } catch (error) {
            console.error('Error saving review:', error);
            alert('Failed to save review. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span 
                key={i} 
                className={`text-${i < rating ? 'warning' : 'muted'} fs-4 me-1`}
                style={{ cursor: 'pointer' }}
                onClick={() => setFormData(prev => ({ ...prev, rating: i + 1 }))}
            >
                ★
            </span>
        ));
    };

    if (initialLoading || (loading && isEditing)) {
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
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header">
                            <h3 className="mb-0">
                                <i className="fas fa-comment me-2"></i>
                                {isEditing ? 'Edit Review' : 'Add New Review'}
                            </h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="bookId" className="form-label">
                                        Book <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className={`form-select ${errors.bookId ? 'is-invalid' : ''}`}
                                        id="bookId"
                                        name="bookId"
                                        value={formData.bookId}
                                        onChange={handleChange}
                                        disabled={Boolean(preselectedBookId)}
                                    >
                                        <option value="">Select a book</option>
                                        {books.map(book => (
                                            <option key={book.id} value={book.id}>
                                                {book.title} - {book.author?.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.bookId && <div className="invalid-feedback">{errors.bookId}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="reviewerName" className="form-label">
                                        Your Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.reviewerName ? 'is-invalid' : ''}`}
                                        id="reviewerName"
                                        name="reviewerName"
                                        value={formData.reviewerName}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                    />
                                    {errors.reviewerName && <div className="invalid-feedback">{errors.reviewerName}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Rating <span className="text-danger">*</span>
                                    </label>
                                    <div className="d-flex align-items-center mb-2">
                                        {renderStars(formData.rating)}
                                        <span className="ms-3 text-muted">({formData.rating}/5)</span>
                                    </div>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="5"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                    />
                                    {errors.rating && <div className="text-danger small">{errors.rating}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="comment" className="form-label">
                                        Review Comment <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                                        id="comment"
                                        name="comment"
                                        rows={5}
                                        value={formData.comment}
                                        onChange={handleChange}
                                        placeholder="Write your review..."
                                    />
                                    {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary flex-fill"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                {isEditing ? 'Update Review' : 'Submit Review'}
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => history.push('/reviews')}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewForm;
