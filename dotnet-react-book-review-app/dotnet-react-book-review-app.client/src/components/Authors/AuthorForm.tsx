import React, {useState, useEffect} from "react";
import {useHistory, useParams} from "react-router-dom";
import {authorService, Author} from "../../services/api";

interface AuthorFormParams {
    id?: string;
}

const AuthorForm: React.FC = () => {
    const history = useHistory();
    const {id} = useParams<AuthorFormParams>();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        biography: '',
        birthDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (isEditing && id) {
            fetchAuthor(parseInt(id));
        }
    }, [id, isEditing]);

    const fetchAuthor = async (authorId: number) => {
        try {
            setLoading(true);
            const response = await authorService.getById(authorId);
            const author = response.data;
            setFormData({
                firstName: author.firstName,
                lastName: author.lastName,
                biography: author.biography || '',
                birthDate: author.birthDate ? author.birthDate.split('T')[0] : '' // Convert to YYYY-MM-DD format
            });
        } catch (error) {
            console.error('Error fetching author:', error);
            alert('Author not found');
            history.push('/authors');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
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

            const submitData: Author = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                biography: formData.biography || undefined,
                birthDate: formData.birthDate || undefined,
                id: 0,
                fullName: ""
            };

            if (isEditing && id) {
                await authorService.update(parseInt(id), submitData);
            } else {
                await authorService.create(submitData);
            }

            history.push('/authors');
        } catch (error) {
            console.error('Error saving author:', error);
            alert('Failed to save author. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
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
                                <i className="fas fa-user-edit me-2"></i>
                                {isEditing ? 'Edit Author' : 'Add New Author'}
                            </h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="firstName" className="form-label">
                                            First Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="Enter first name"
                                        />
                                        {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="lastName" className="form-label">
                                            Last Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Enter last name"
                                        />
                                        {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="birthDate" className="form-label">
                                        Birth Date
                                    </label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.birthDate ? 'is-invalid' : ''}`}
                                        id="birthDate"
                                        name="birthDate"
                                        value={formData.birthDate}
                                        onChange={handleChange}
                                    />
                                    {errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="biography" className="form-label">
                                        Biography
                                    </label>
                                    <textarea
                                        className={`form-control ${errors.biography ? 'is-invalid' : ''}`}
                                        id="biography"
                                        name="biography"
                                        rows={5}
                                        value={formData.biography}
                                        onChange={handleChange}
                                        placeholder="Enter author's biography..."
                                    />
                                    {errors.biography && <div className="invalid-feedback">{errors.biography}</div>}
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary flex-fill"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"
                                                      role="status"></span>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-save me-2"></i>
                                                {isEditing ? 'Update Author' : 'Create Author'}
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => history.push('/authors')}
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

export default AuthorForm;
