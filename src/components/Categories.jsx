import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './css/category.css';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [newCategoryId, setNewCategoryId] = useState(''); // New input for category ID
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories from the API
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const categoriesWithId = response.data.map(cat => ({
                    _id: cat._id,
                    name: cat.name,
                    categoryId: cat.categoryId
                }));

                setCategories(categoriesWithId);
                // Calculate the next categoryId automatically
                const maxCategoryId = Math.max(0, ...categoriesWithId.map(cat => cat.categoryId));
                setNewCategoryId(maxCategoryId + 1);
            } catch (err) {
                setError('Failed to fetch categories');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (newCategory.trim() === '') {
            return Swal.fire({
                icon: 'error',
                title: 'خطأ في الإدخال',
                text: 'الرجاء إدخال اسم تصنيف.'
            });
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/categories', { name: newCategory, categoryId: newCategoryId }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCategories([...categories, response.data]);
            setNewCategory('');
            // Update the categoryId for the next category
            setNewCategoryId(newCategoryId + 1);

            Swal.fire({
                icon: 'success',
                title: 'تمت الإضافة!',
                text: 'تمت إضافة التصنيف بنجاح.',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (err) {
            setError('Failed to add category');
            console.error(err);
        }
    };

    const handleEditCategory = async (id) => {
        const { value: updatedName } = await Swal.fire({
            title: 'تعديل التصنيف',
            input: 'text',
            inputLabel: 'ادخل الاسم الجديد للتصنيف:',
            inputValue: '',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'الرجاء إدخال اسم التصنيف!';
                }
            }
        });

        if (updatedName) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.put(`http://localhost:8080/api/categories/${id}`, { name: updatedName }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(categories.map(cat => (cat._id === id ? { ...cat, name: response.data.name } : cat)));

                Swal.fire({
                    icon: 'success',
                    title: 'تم التعديل!',
                    text: 'تم تعديل التصنيف بنجاح.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                setError('Failed to edit category');
                console.error(err);
            }
        }
    };

    const handleDeleteCategory = async (id) => {
        const result = await Swal.fire({
            title: 'هل أنت متأكد؟',
            text: 'لن تتمكن من استعادة هذا التصنيف!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احذفه!',
            cancelButtonText: 'إلغاء'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:8080/api/categories/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(categories.filter(cat => cat._id !== id));

                Swal.fire({
                    icon: 'success',
                    title: 'تم الحذف!',
                    text: 'تم حذف التصنيف بنجاح.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            } catch (err) {
                setError('Failed to delete category');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div>Loading categories...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <div className='container'>
            <h1>ادارة التصنيفات</h1>
            <form onSubmit={handleAddCategory} className="category-form">
                <div className="form-group">
                    <label htmlFor="categoryName">اسم التصنيف:</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="categoryId">رقم الفئة:</label>
                    <input
                        type="number"
                        id="categoryId"
                        value={newCategoryId}
                        disabled // Disable input as it's auto-generated
                        required
                    />
                </div>
                <button type="submit" className="add-category-btn">اضافة تصنيف</button>
            </form>

            <div className="category-grid">
                {categories.map(cat => (
                    <div className="category-card" key={cat._id}>
                        <div className="category-details">
                            <h3>{cat.name}</h3>
                            <p>رقم الفئة: {cat.categoryId}</p>
                        </div>
                        <div className="category-actions">
                            <button onClick={() => handleEditCategory(cat._id)} className="edit-btn">
                                <i className="fas fa-edit"></i> تعديل
                            </button>
                            <button onClick={() => handleDeleteCategory(cat._id)} className="delete-btn">
                                <i className="fas fa-trash-alt"></i> حذف
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;
