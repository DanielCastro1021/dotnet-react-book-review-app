import React, {useState, useEffect} from "react";
import {useHistory, useParams, Link} from "react-router-dom";
import {categoryService, bookService, Category, Book} from "../../services/api";

interface CategoryDetailParams {
    id: string;
}

const CategoryDetail: React.FC = () => {
    const history = useHistory();
    const {id} = useParams<CategoryDetailParams>();
    const [category, setCategory] = useState<Category | null>(null);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchCategoryDetails(parseInt(id));
        }
    }, [id]);

    const fetchCategoryDetails = async (categoryId: number) => {
        try {
            setLoading(true);
            const [categoryResponse, booksResponse] = await Promise.all([
                categoryService.getById(categoryId),
                bookService.getAll()
            ]);

            setCategory(categoryResponse.data);
            const categoryBooks = booksResponse.data.filter(book => book.categoryId === categoryId);
            setBooks(categoryBooks);
        } catch (error) {
            console.error('Error fetching category details:', error);
            alert('Category not found');
            history.push('/categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!category) return;

        if (window.confirm(`Are you sure you want to delete "${category.name}"?`)) {
            try {
                await categoryService.delete(category.id);
                history.push('/categories');
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category. It may have associated books.');
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

    if (!category) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">Category not found</div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h2 className="mb-0 d-flex align-items-center">
                                <i className="fas fa-tag text-primary me-2"></i>
                                {category.name}
                            </h2>
                            <div className="btn-group">
                                <Link
                                    to={`/categories/edit/${category.id}`}
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
                                <h5><i className="fas fa-info-circle me-2 text-muted"></i>Description</h5>
                                <p className="text-muted" style={{lineHeight: '1.6'}}>
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mt-4">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <i className="fas fa-books me-2"></i>
                                Books in {category.name} ({books.length})
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
                                                        <i className="fas fa-user me-1"></i>
                                                        by {book.author?.fullName || 'Unknown Author'}
                                                    </p>
                                                    <p className="card-text small text-muted mb-2">
                                                        <i className="fas fa-calendar me-1"></i>
                                                        Published: {new Date(book.publishedDate).getFullYear()}
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
                                    <i className="fas fa-book text-muted mb-3" style={{fontSize: '2rem'}}></i>
                                    <p className="text-muted">No books found in this category.</p>
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
                                <Link to="/categories" className="btn btn-outline-secondary">
                                    <i className="fas fa-arrow-left me-2"></i>Back to Categories
                                </Link>
                                <Link
                                    to={`/categories/edit/${category.id}`}
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-edit me-2"></i>Edit Category
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
                        <div className="card-body text-center">
                            <h3 className="text-primary mb-0">{books.length}</h3>
                            <p className="text-muted mb-0">Books in Category</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryDetail;
