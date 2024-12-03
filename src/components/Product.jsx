import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Product.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2';  // Import SweetAlert2

const Products = () => {
    const initialFormState = {
        name: '',
        price: '',
        deletedPrice: '',
        image: null,
        stock: '',
        description: '',
        category: '', // Keep this as the category ID
    };

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // New state for categories
    const [productForm, setProductForm] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true); // Set loading state
            setError(null); // Clear previous errors
            try {
                const response = await fetch('http://localhost:8080/api/products'); // Your API endpoint
                console.log('Response status:', response.status); // Log status code for debugging
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`); // Throw error for non-2xx responses
                }
        
                const data = await response.json(); // Parse JSON response
                console.log('Products fetched:', data); // Log fetched data
                setProducts(data); // Update products state
            } catch (error) {
                console.error('Error fetching products:', error); // Log error
                setError(error.message); // Set error state to display
            } finally {
                setLoading(false); // Reset loading state
            }
        };
        
        

        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCategories(response.data); // Store categories
            } catch (err) {
                console.error('Failed to fetch categories', err);
            }
        };

        fetchProducts();
        fetchCategories(); // Call the fetchCategories function
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductForm({ ...productForm, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProductForm({ ...productForm, image: file });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        // Basic validation to ensure the required fields are filled
        if (!productForm.name || !productForm.price || !productForm.stock || !productForm.deletedPrice || !productForm.category) {
            Swal.fire('Error', 'All required fields must be filled.', 'error');
            return;
        }

        const formData = new FormData();

        // Append form data fields, including required ones
        formData.append('name', productForm.name);
        formData.append('price', parseFloat(productForm.price));  // Ensure price is a float
        formData.append('deletedPrice', parseFloat(productForm.deletedPrice)); // Add deletedPrice here
        formData.append('stock', parseInt(productForm.stock));    // Ensure stock is an integer
        formData.append('description', productForm.description);
        formData.append('category', productForm.category); // Category ID to be sent here
        formData.append('newPrice', parseFloat(productForm.price)); // Add newPrice here

        // Uncomment this line to include image again
        if (productForm.image) {
            formData.append('image', productForm.image);
        }

        // Log formData content for debugging
        formData.forEach((value, key) => {
            console.log(key, value);
        });

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8080/api/products', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProducts([...products, response.data]);
            setProductForm(initialFormState);
            document.getElementById('image').value = '';  // Reset the image input field

            Swal.fire('Success', 'Product added successfully!', 'success');
        } catch (err) {
            if (err.response) {
                console.error('Error response:', err.response.data);
                Swal.fire('Error', `Failed to add product: ${err.response.data.error || 'Server error'}`, 'error');
            } else {
                console.error('Error:', err);
                Swal.fire('Error', 'An unexpected error occurred', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditProduct = (product) => {
        setIsEditing(true);
        setCurrentProductId(product._id);
        setProductForm({
            name: product.name,
            price: product.price,
            deletedPrice: product.deletedPrice,
            image: null,
            stock: product.stock,
            description: product.description,
            category: product.category, // Store the category ID
        });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        if (!productForm.name || !productForm.price || !productForm.stock || !productForm.category) {
            Swal.fire('Error', 'All required fields must be filled.', 'error');
            return;
        }
    
        let formData;
        let headers = {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        };
    
        if (productForm.image) {
            formData = new FormData();
            formData.append('name', productForm.name);
            formData.append('price', parseFloat(productForm.price));
            formData.append('deletedPrice', parseFloat(productForm.deletedPrice));
            formData.append('stock', parseInt(productForm.stock));
            formData.append('description', productForm.description);
            formData.append('category', productForm.category);
            formData.append('image', productForm.image);
            headers['Content-Type'] = 'multipart/form-data';  // Set content type for file upload
        } else {
            formData = {
                name: productForm.name,
                price: parseFloat(productForm.price),
                deletedPrice: parseFloat(productForm.deletedPrice),
                stock: parseInt(productForm.stock),
                description: productForm.description,
                category: productForm.category,
            };
            headers['Content-Type'] = 'application/json';  // JSON content type
        }
    
        setSubmitting(true);
    
        try {
            const response = await axios.put(
                `http://localhost:8080/api/products/${currentProductId}`,
                formData,
                { headers }
            );
    
            setProducts(products.map((prod) => (prod._id === currentProductId ? response.data : prod)));
    
            setIsEditing(false);
            setCurrentProductId(null);
            setProductForm(initialFormState);
            document.getElementById('image').value = '';  // Clear the image input field
    
            Swal.fire('Success', 'Product updated successfully!', 'success');
        } catch (err) {
            // Log detailed error response
            if (err.response) {
                console.error('Error response:', err.response.data);
                Swal.fire('Error', `Failed to update product: ${err.response.data.error || 'Server error'}`, 'error');
            } else {
                console.error('Error:', err);
                Swal.fire('Error', 'An unexpected error occurred', 'error');
            }
        } finally {
            setSubmitting(false);
        }
    };
    
    

    const handleDeleteProduct = async (productId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = localStorage.getItem('token');
                    await axios.delete(`http://localhost:8080/api/products/${productId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setProducts(products.filter(prod => prod._id !== productId));

                    Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
                } catch (err) {
                    Swal.fire('Error', 'Failed to delete product', 'error');
                    console.error(err);
                }
            }
        });
    };


    // Filter products based on the search term
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Log the filtered products for debugging
    console.log('Filtered Products:', filteredProducts);

    if (loading) {
        return <div>Loading products...</div>;
    }

    if (error) {
        return <div className="text-danger">{error}</div>;
    }

    return (
        <div className="container">
            <h1 className='text-center mb-5'>ادارة المنتجات</h1>
            <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input mb-5" // Optional styling class
            />
            <h2 className='text-center mb-3'>اضف منتج جديد </h2>
            <form onSubmit={isEditing ? handleUpdateProduct : handleAddProduct} className="product-form">
                {/* Form fields */}
                <div className="form-group">
                    <label htmlFor="name">اسم المنتج:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={productForm.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">سعر المنتج:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={productForm.price}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="deletedPrice">السعر القديم:</label>
                    <input
                        type="number"
                        id="deletedPrice"
                        name="deletedPrice"
                        value={productForm.deletedPrice}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="stock">الكمية المتاحة:</label>
                    <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={productForm.stock}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">صورة المنتج:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">وصف المنتج:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={productForm.description}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">اختر الفئة:</label>
                    <select
                        id="category"
                        name="category"
                        value={productForm.category}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">-- اختر الفئة --</option>
                        {categories.map(category => (
                            <option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="submit-btn" disabled={submitting}>
                    {isEditing ? 'تحديث المنتج' : 'اضف منتج'}
                </button>
            </form>
            <h2 className='text-center mb-3'>المنتجات</h2>
            <div className="product-list">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div key={product._id} className="product-card">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>{product.price}ج.م</p>
                            <p> رقم الفئة:{product.category}</p>
                            <div className="product-actions">
                                <button className="edit-btn" onClick={() => handleEditProduct(product)}>تعديل</button>
                                <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)}>حذف</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>لا توجد منتجات للعرض</p> 
                )}
            </div>
        </div>
    );
};

export default Products;
