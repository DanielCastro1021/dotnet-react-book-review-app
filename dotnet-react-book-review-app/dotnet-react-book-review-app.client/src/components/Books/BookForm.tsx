import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { bookService, authorService, categoryService, Book, Author, Category } from "../../services/api";

interface BookFormParams {
    id?: string;
}

const BookForm: React.FC = () => {
    const history = useHistory();
    const { id } = useParams<BookFormParams>();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        isbn: '',
        publicationDate: '',
        authorId: '',
        categoryId: '',
        description: ''
    });
    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [errors, setErrors] = useState<{[key: string]: string}>({});

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (isEditing && id && authors.length > 0 && categories.length > 0) {
            fetchBook(parseInt(id));
        }
    }, [id, isEditing, authors, categories]);

    const fetchInitialData = async () => {
        try {
            setInitialLoading(true);
            const [authorsResponse, categoriesResponse] = await Promise.all([
                authorService.getAll(),
                categoryService.getAll()
            ]);
            setAuthors(authorsResponse.data);
            setCategories(categoriesResponse.data);
        } catch (error) {
            console.error('Error fetching initial data:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    const fetchBook = async (bookId: number) => {
        try {
            setLoading(true);
            const response = await bookService.getById(bookId);
            const book = response.data;
            setFormData({
                title: book.title,
                isbn: book.isbn,
                publicationDate: book.publicationDate.split('T')[0],
                authorId: book.authorId.toString(),
                categoryId: book.categoryId.toString(),
                description: book.description || ''
            });
        } catch (error) {
            console.error('Error fetching book:', error);
            alert('Book not found');
            history.push('/books');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!formData.isbn.trim()) {
            newErrors.isbn = 'ISBN is required';
        }

        if (!formData.publicationDate) {
            newErrors.publicationDate = 'Publication date is required';
        }

        if (!formData.authorId) {
            newErrors.authorId = 'Author is required';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
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
            
            const bookData = {
                ...formData,
                authorId: parseInt(formData.authorId),
                categoryId: parseInt(formData.categoryId)
            };
            
            if (isEditing && id) {
                await bookService.update(parseInt(id), bookData);
            } else {
                await bookService.create(bookData);
            }
            
            history.push('/books');
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Failed to save book. Please try again.');
        } finally {
            setLoading(false);
        }
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
                                <i className="fas fa-book me-2"></i>
                                {isEditing ? 'Edit Book' : 'Add New Book'}
                            </h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">
                                        Title <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter book title"
                                    />
                                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="isbn" className="form-label">
                                                ISBN <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
                                                id="isbn"
                                                name="isbn"
                                                value={formData.isbn}
                                                onChange={handleChange}
                                                placeholder="Enter ISBN"
                                            />
                                            {errors.isbn && <div className="invalid-feedback">{errors.isbn}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="publicationDate" className="form-label">
                                                Publication Date <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                className={`form-control ${errors.publicationDate ? 'is-invalid' : ''}`}
                                                id="publicationDate"
                                                name="publicationDate"
                                                value={formData.publicationDate}
                                                onChange={handleChange}
                                            />
                                            {errors.publicationDate && <div className="invalid-feedback">{errors.publicationDate}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="authorId" className="form-label">
                                                Author <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.authorId ? 'is-invalid' : ''}`}
                                                id="authorId"
                                                name="authorId"
                                                value={formData.authorId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select an author</option>
                                                {authors.map(author => (
                                                    <option key={author.id} value={author.id}>
                                                        {author.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.authorId && <div className="invalid-feedback">{errors.authorId}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label htmlFor="categoryId" className="form-label">
                                                Category <span className="text-danger">*</span>
                                            </label>
                                            <select
                                                className={`form-select ${errors.categoryId ? 'is-invalid' : ''}`}
                                                id="categoryId"
                                                name="categoryId"
                                                value={formData.categoryId}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.categoryId && <div className="invalid-feedback">{errors.categoryId}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">
                                        Description <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        id="description"
                                        name="description"
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter book description..."
                                    />
                                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
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
                                                {isEditing ? 'Update Book' : 'Create Book'}
                                            </>
                                        )}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => history.push('/books')}
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

export default BookForm;
