import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authorService, Author } from "../../services/api";

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            setLoading(true);
            const response = await authorService.getAll();
            setAuthors(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
            setAuthors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                await authorService.delete(id);
                setAuthors(authors.filter(author => author.id !== id));
            } catch (error) {
                console.error('Error deleting author:', error);
                alert('Failed to delete author. They may have associated books.');
            }
        }
    };

    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.biography.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h2>Authors</h2>
                <Link to="/authors/create" className="btn btn-primary">
                    <i className="fas fa-plus me-2"></i>Add New Author
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
                            placeholder="Search authors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {filteredAuthors.length === 0 ? (
                <div className="text-center py-5">
                    <i className="fas fa-user-edit text-muted mb-3" style={{ fontSize: '3rem' }}></i>
                    <h4 className="text-muted">No authors found</h4>
                    <p className="text-muted">
                        {searchTerm ? 'Try adjusting your search criteria' : 'Start by adding your first author!'}
                    </p>
                    {!searchTerm && (
                        <Link to="/authors/create" className="btn btn-primary">Add First Author</Link>
                    )}
                </div>
            ) : (
                <div className="row">
                    {filteredAuthors.map((author) => (
                        <div key={author.id} className="col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{author.name}</h5>
                                    <p className="card-text text-muted small">
                                        {author.biography.length > 150 
                                            ? `${author.biography.substring(0, 150)}...` 
                                            : author.biography
                                        }
                                    </p>
                                    <p className="text-muted small mb-3">
                                        <i className="fas fa-calendar me-1"></i>
                                        Born: {new Date(author.birthDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="card-footer bg-transparent">
                                    <div className="btn-group w-100" role="group">
                                        <Link 
                                            to={`/authors/${author.id}`} 
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            View
                                        </Link>
                                        <Link 
                                            to={`/authors/edit/${author.id}`} 
                                            className="btn btn-outline-secondary btn-sm"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(author.id, author.name)}
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

export default AuthorList;
