import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { categoryService, Category } from "../../services/api";

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await categoryService.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await categoryService.delete(id);
                setCategories(categories.filter(category => category.id !== id));
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Failed to delete category. It may have associated books.');
            }
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
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
                <h2>Categories</h2>
                <Link to="/categories/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Category
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
                            placeholder="Search categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {filteredCategories.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-tags text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <h4 className="text-muted">No categories found</h4>
                    <p className="text-muted">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first category!'}
                    </p>
                    {!searchTerm && (
                        <Link to="/categories/create" className="btn btn-primary">Add First Category</Link>
                    )}
                </div>
            ) : (
                <div className="row">
                    {filteredCategories.map((category) => (
                        <div key={category.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title d-flex align-items-center">
                                        <i className="fas fa-tag text-primary me-2"></i>
                                        {category.name}
                                    </h5>
                                    <p className="card-text text-muted">
                                        {category.description && category.description.length > 120 
                                            ? `${category.description.substring(0, 120)}...` 
                                            : category.description || 'No description available'
                                        }
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="btn-group w-100" role="group">
                                        <Link 
                                            to={`/categories/${category.id}`} 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            View
                                        </Link>
                                        <Link 
                                            to={`/categories/edit/${category.id}`} 
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category.id, category.name)}
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

export default CategoryList;
