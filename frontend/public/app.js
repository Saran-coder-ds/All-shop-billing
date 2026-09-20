const { useState, useEffect, createContext, useContext } = React;

const API_URL = 'http://localhost:5000/api';

// Context for auth
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const register = async (email, password, name) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    }
    return { success: false, error: data.error };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return React.createElement(AuthContext.Provider, {
    value: { user, token, login, register, logout, isAuthenticated: !!token }
  }, children);
};

const useAuth = () => useContext(AuthContext);

// Login Component (UPDATED)
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (!isLogin && !name) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Submit
      const result = isLogin
        ? await login(email, password)
        : await register(email, password, name);

      if (!result.success) {
        setError(result.error || 'Authentication failed');
        setLoading(false);
      } else {
        setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!');
        // Redirect happens automatically via auth context
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return React.createElement('div', { className: 'auth-container' }, [
    React.createElement('div', { key: 'form', className: 'auth-form' }, [
      // Header
      React.createElement('div', { key: 'header', className: 'auth-header' }, [
        React.createElement('div', { key: 'logo', className: 'auth-logo' }, '🍵'),
        React.createElement('h1', { key: 'title', className: 'auth-title' }, 'Tea Shop'),
        React.createElement('p', { key: 'subtitle', className: 'auth-subtitle' }, 
          isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'
        )
      ]),

      // Toggle Buttons (Login/Register)
      React.createElement('div', { key: 'toggle', className: 'toggle-buttons' }, [
        React.createElement('button', {
          key: 'login-btn',
          className: `toggle-button ${isLogin ? 'active' : ''}`,
          onClick: () => {
            setIsLogin(true);
            setError('');
            setSuccess('');
            setName('');
          }
        }, 'Login'),
        React.createElement('button', {
          key: 'register-btn',
          className: `toggle-button ${!isLogin ? 'active' : ''}`,
          onClick: () => {
            setIsLogin(false);
            setError('');
            setSuccess('');
          }
        }, 'Register')
      ]),

      // Messages
      error && React.createElement('div', { key: 'error', className: 'error-message' }, error),
      success && React.createElement('div', { key: 'success', className: 'success-message' }, success),

      // Form
      React.createElement('form', { key: 'form', onSubmit: handleSubmit }, [
        // Name Field (Register Only)
        !isLogin && React.createElement('div', { key: 'name-group', className: 'form-group' }, [
          React.createElement('label', { key: 'label' }, 'Full Name'),
          React.createElement('input', {
            key: 'input',
            type: 'text',
            placeholder: 'Enter your full name',
            value: name,
            onChange: (e) => setName(e.target.value),
            disabled: loading
          })
        ]),

        // Email Field
        React.createElement('div', { key: 'email-group', className: 'form-group' }, [
          React.createElement('label', { key: 'label' }, 'Email Address'),
          React.createElement('input', {
            key: 'input',
            type: 'email',
            placeholder: 'your@email.com',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            disabled: loading
          })
        ]),

        // Password Field
        React.createElement('div', { key: 'password-group', className: 'form-group' }, [
          React.createElement('label', { key: 'label' }, 'Password'),
          React.createElement('input', {
            key: 'input',
            type: 'password',
            placeholder: 'Enter your password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            disabled: loading
          })
        ]),

        // Submit Button
        React.createElement('button', {
          key: 'submit',
          type: 'submit',
          className: `btn-login ${loading ? 'loading' : ''}`,
          disabled: loading
        }, loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account'))
      ]),

      // Demo Credentials (Optional)
      isLogin && React.createElement('div', {
        key: 'demo',
        style: {
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid #e8e4df',
          fontSize: '12px',
          color: '#999',
          textAlign: 'center'
        }
      }, [
        React.createElement('p', { key: 'text', style: { marginBottom: '8px' } }, 'Demo Credentials:'),
        React.createElement('p', { key: 'email' }, 'Email: test@example.com'),
        React.createElement('p', { key: 'password' }, 'Password: password123')
      ])
    ])
  ]);
};
// Dashboard Component
const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [todaysSummary, setTodaysSummary] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res1, res2] = await Promise.all([
        fetch(`${API_URL}/dashboard/sales-summary?days=7`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/dashboard/todays-summary`, { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (res1.ok) {
        const data = await res1.json();
        setSummary(data);
      }
      if (res2.ok) {
        const data = await res2.json();
        setTodaysSummary(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return React.createElement('div', null, [
    React.createElement('h2', { key: 'title' }, 'Dashboard'),
    React.createElement('div', { key: 'cards', className: 'dashboard-grid' }, [
      todaysSummary && React.createElement('div', { key: 'sales', className: 'card' }, [
        React.createElement('h3', { key: 'label' }, "Today's Sales"),
        React.createElement('div', { key: 'value', className: 'value' }, `₹${todaysSummary.dailyData.totalSales.toFixed(2)}`)
      ]),
      todaysSummary && React.createElement('div', { key: 'bills', className: 'card' }, [
        React.createElement('h3', { key: 'label' }, 'Bills Today'),
        React.createElement('div', { key: 'value', className: 'value' }, todaysSummary.billCount)
      ]),
      summary && React.createElement('div', { key: 'week', className: 'card' }, [
        React.createElement('h3', { key: 'label' }, 'Weekly Sales'),
        React.createElement('div', { key: 'value', className: 'value' }, `₹${summary.totals.totalSales.toFixed(2)}`)
      ]),
      summary && React.createElement('div', { key: 'profit', className: 'card' }, [
        React.createElement('h3', { key: 'label' }, 'Weekly Profit'),
        React.createElement('div', { key: 'value', className: 'value' }, `₹${summary.totals.totalProfit.toFixed(2)}`)
      ])
    ]),
    todaysSummary && todaysSummary.topProducts.length > 0 && React.createElement('div', { key: 'top-products', className: 'section' }, [
      React.createElement('h3', { key: 'title' }, 'Top Products Today'),
      React.createElement('table', { key: 'table' }, [
        React.createElement('thead', { key: 'head' }, React.createElement('tr', null, [
          React.createElement('th', { key: 'name' }, 'Product'),
          React.createElement('th', { key: 'qty' }, 'Quantity Sold'),
          React.createElement('th', { key: 'revenue' }, 'Revenue')
        ])),
        React.createElement('tbody', { key: 'body' }, todaysSummary.topProducts.map(item => 
          React.createElement('tr', { key: item.product.id }, [
            React.createElement('td', { key: 'name' }, item.product.name),
            React.createElement('td', { key: 'qty' }, item.quantity),
            React.createElement('td', { key: 'revenue' }, `₹${item.revenue.toFixed(2)}`)
          ])
        ))
      ])
    ])
  ]);
};

// Products Component
const Products = () => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', cost: '', category: 'tea' });
  const [editingId, setEditingId] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API_URL}/products/${editingId}` : `${API_URL}/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setFormData({ name: '', price: '', cost: '', category: 'tea' });
        setShowForm(false);
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, cost: product.cost, category: product.category });
    setEditingId(product.id);
    setShowForm(true);
  };

  return React.createElement('div', null, [
    React.createElement('div', { key: 'header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } }, [
      React.createElement('h2', { key: 'title' }, 'Products'),
      React.createElement('button', { key: 'btn', className: 'btn btn-success', onClick: () => { setShowForm(true); setEditingId(null); setFormData({ name: '', price: '', cost: '', category: 'tea' }); } }, '+ Add Product')
    ]),
    showForm && React.createElement('div', { key: 'form', className: 'modal active' }, React.createElement('div', { className: 'modal-content' }, [
      React.createElement('span', { key: 'close', className: 'close-modal', onClick: () => setShowForm(false) }, '×'),
      React.createElement('h3', { key: 'title' }, editingId ? 'Edit Product' : 'Add Product'),
      React.createElement('form', { key: 'form', onSubmit: handleSubmit }, [
        React.createElement('div', { key: 'name', className: 'form-group' }, [
          React.createElement('label', { key: 'label' }, 'Product Name'),
          React.createElement('input', { key: 'input', type: 'text', value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), required: true })
        ]),
        React.createElement('div', { key: 'price', className: 'form-group' }, [
          React.createElement('label', { key: 'label' }, 'Price'),
          React.createElement('input', { key: 'input', type: 'number', value: formData.price, onChange: (e) => setFormData({ ...formData, price: e.target.value }), required: true, step: '0.01' })
        ]),
        React.createElement('div', { key: 'cost', className: 'form-group' }, [
          React.createElement('label', { key: 'label' }, 'Cost Price'),
          React.createElement('input', { key: 'input', type: 'number', value: formData.cost, onChange: (e) => setFormData({ ...formData, cost: e.target.value }), required: true, step: '0.01' })
        ]),
        React.createElement('div', { key: 'category', className: 'form-group' }, [
          React.createElement('label', { key: 'label' }, 'Category'),
          React.createElement('select', { key: 'input', value: formData.category, onChange: (e) => setFormData({ ...formData, category: e.target.value }), style: { width: '100%', padding: '10px', border: '2px solid #e0e0e0', borderRadius: '5px' } }, [
            React.createElement('option', { key: 'tea', value: 'tea' }, 'Tea'),
            React.createElement('option', { key: 'snacks', value: 'snacks' }, 'Snacks'),
            React.createElement('option', { key: 'beverages', value: 'beverages' }, 'Beverages')
          ])
        ]),
        React.createElement('button', { key: 'submit', type: 'submit', className: 'btn-primary' }, 'Save Product')
      ])
    ])),
    React.createElement('table', { key: 'table' }, [
      React.createElement('thead', { key: 'head' }, React.createElement('tr', null, [
        React.createElement('th', { key: 'name' }, 'Name'),
        React.createElement('th', { key: 'price' }, 'Price'),
        React.createElement('th', { key: 'cost' }, 'Cost'),
        React.createElement('th', { key: 'category' }, 'Category'),
        React.createElement('th', { key: 'actions' }, 'Actions')
      ])),
      React.createElement('tbody', { key: 'body' }, products.map(product =>
        React.createElement('tr', { key: product.id }, [
          React.createElement('td', { key: 'name' }, product.name),
          React.createElement('td', { key: 'price' }, `₹${product.price.toFixed(2)}`),
          React.createElement('td', { key: 'cost' }, `₹${product.cost.toFixed(2)}`),
          React.createElement('td', { key: 'category' }, product.category),
          React.createElement('td', { key: 'actions', style: { display: 'flex', gap: '10px' } }, [
            React.createElement('button', { key: 'edit', className: 'btn btn-secondary', onClick: () => handleEdit(product) }, 'Edit'),
            React.createElement('button', { key: 'delete', className: 'btn btn-danger', onClick: () => handleDelete(product.id) }, 'Delete')
          ])
        ])
      ))
    ])
  ]);
};

// Inventory Component
const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_URL}/inventory`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setInventory(data);
        const low = data.filter(item => item.quantity <= item.minLevel);
        setLowStock(low);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const updateQuantity = async (productId, quantity, type) => {
    try {
      const res = await fetch(`${API_URL}/inventory/${productId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ quantity, type })
      });
      if (res.ok) {
        fetchInventory();
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  return React.createElement('div', null, [
    React.createElement('h2', { key: 'title' }, 'Inventory Management'),
    lowStock.length > 0 && React.createElement('div', { key: 'alerts', className: 'alert alert-warning' }, 
      React.createElement('strong', null, `⚠️ ${lowStock.length} product(s) below minimum stock level`)
    ),
    React.createElement('table', { key: 'table' }, [
      React.createElement('thead', { key: 'head' }, React.createElement('tr', null, [
        React.createElement('th', { key: 'product' }, 'Product'),
        React.createElement('th', { key: 'quantity' }, 'Quantity'),
        React.createElement('th', { key: 'minLevel' }, 'Min Level'),
        React.createElement('th', { key: 'maxLevel' }, 'Max Level'),
        React.createElement('th', { key: 'status' }, 'Status'),
        React.createElement('th', { key: 'actions' }, 'Actions')
      ])),
      React.createElement('tbody', { key: 'body' }, inventory.map(item =>
        React.createElement('tr', { key: item.id }, [
          React.createElement('td', { key: 'product' }, item.product.name),
          React.createElement('td', { key: 'quantity' }, item.quantity),
          React.createElement('td', { key: 'minLevel' }, item.minLevel),
          React.createElement('td', { key: 'maxLevel' }, item.maxLevel),
          React.createElement('td', { key: 'status' }, 
            React.createElement('span', { className: item.quantity <= item.minLevel ? 'badge badge-warning' : 'badge badge-success' }, 
              item.quantity <= item.minLevel ? 'Low Stock' : 'OK'
            )
          ),
          React.createElement('td', { key: 'actions', style: { display: 'flex', gap: '5px' } }, [
            React.createElement('button', { key: 'add', className: 'btn btn-success', onClick: () => updateQuantity(item.productId, 10, 'add') }, '+10'),
            React.createElement('button', { key: 'subtract', className: 'btn btn-danger', onClick: () => updateQuantity(item.productId, 5, 'subtract') }, '-5')
          ])
        ])
      ))
    ])
  ]);
};

// Bills Component
const Bills = () => {
  const [products, setProducts] = useState([]);
  const [bills, setBills] = useState([]);
  const [cart, setCart] = useState([]);
  const [showBillForm, setShowBillForm] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [searchTerm, setSearchTerm] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchBills();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchBills = async () => {
    try {
      const res = await fetch(`${API_URL}/bills`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setBills(data);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, quantity: 1, name: product.name, price: product.price }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => item.productId === productId ? { ...item, quantity } : item));
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const calculatedTax = (totalAmount * taxPercentage) / 100;
  const finalAmount = totalAmount - discount + calculatedTax;

  const createBill = async () => {
    if (cart.length === 0) {
      alert('Please add items to the cart!');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/bills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cart,
          discount,
          tax: calculatedTax,
          taxPercentage,
          paymentMethod,
          customerName
        })
      });
      if (res.ok) {
        setCart([]);
        setDiscount(0);
        setTaxPercentage(0);
        setCustomerName('Walk-in Customer');
        fetchBills();
        alert('Bill created successfully!');
      }
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Error creating bill. Please try again.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return React.createElement('div', null, [
    React.createElement('div', { key: 'title', className: 'page-title' }, [
      React.createElement('div', { key: 'h2' }, 'New Bill'),
      React.createElement('div', { key: 'admin' }, 'Shop Admin')
    ]),
    showBillForm && React.createElement('div', { key: 'billing-form', className: 'billing-container' }, [
      // Products Section
      React.createElement('div', { key: 'products-sec', className: 'products-section' }, [
        React.createElement('div', { key: 'title', className: 'section-title' }, 'Products'),
        React.createElement('div', { key: 'search', className: 'search-box' }, 
          React.createElement('input', {
            type: 'text',
            placeholder: 'Search products...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          })
        ),
        React.createElement('div', { key: 'grid', className: 'products-grid' },
          filteredProducts.map(product =>
            React.createElement('div', {
              key: product.id,
              className: 'product-card',
              onClick: () => addToCart(product)
            }, [
              React.createElement('div', { key: 'name', className: 'product-name' }, product.name),
              React.createElement('div', { key: 'stock', style: { fontSize: '11px', color: '#999', marginBottom: '6px' } }, `${product.quantity || 0} left`),
              React.createElement('div', { key: 'price', className: 'product-price' }, `₹${product.price.toFixed(2)}/${product.unit || 'pc'}`)
            ])
          )
        )
      ]),
      // Cart Section
      React.createElement('div', { key: 'cart-sec', className: 'cart-section' }, [
        React.createElement('div', { key: 'title', className: 'cart-title' }, 'Cart'),
        cart.length === 0 && React.createElement('div', { key: 'empty', className: 'cart-empty' }, 'No items added yet. Click a product to add it.'),
        cart.length > 0 && React.createElement('div', { key: 'cart-content' }, [
          React.createElement('div', { key: 'form-group-customer', className: 'form-group' }, [
            React.createElement('label', null, 'Customer Name'),
            React.createElement('input', {
              type: 'text',
              value: customerName,
              onChange: (e) => setCustomerName(e.target.value),
              placeholder: 'Walk-in Customer'
            })
          ]),
          React.createElement('div', { key: 'items', style: { marginBottom: '16px' } },
            cart.map(item =>
              React.createElement('div', { key: item.productId, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f0ebe5' } }, [
                React.createElement('div', { key: 'info' }, [
                  React.createElement('div', { key: 'name', style: { fontSize: '13px', fontWeight: '600', marginBottom: '2px' } }, item.name),
                  React.createElement('input', {
                    key: 'qty',
                    type: 'number',
                    value: item.quantity,
                    onChange: (e) => updateCartQuantity(item.productId, parseInt(e.target.value)),
                    style: { width: '50px', padding: '4px', fontSize: '12px', borderRadius: '4px', border: '1px solid #e8e4df' }
                  })
                ]),
                React.createElement('div', { key: 'price-action', style: { textAlign: 'right' } }, [
                  React.createElement('div', { key: 'price', style: { fontSize: '13px', fontWeight: '600', color: '#c98a2e' } }, `₹${(item.price * item.quantity).toFixed(2)}`),
                  React.createElement('button', {
                    key: 'remove',
                    className: 'btn btn-danger',
                    onClick: () => removeFromCart(item.productId),
                    style: { padding: '4px 8px', fontSize: '11px', marginTop: '4px' }
                  }, 'Remove')
                ])
              ])
            )
          ),
          React.createElement('div', { key: 'summary', style: { borderTop: '2px solid #f0ebe5', paddingTop: '12px' } }, [
            React.createElement('div', { key: 'subtotal', className: 'cart-row' }, [
              React.createElement('span', { key: 'label', className: 'cart-label' }, 'Subtotal'),
              React.createElement('span', { key: 'value', className: 'cart-value' }, `₹${totalAmount.toFixed(2)}`)
            ]),
            React.createElement('div', { key: 'tax-row', className: 'form-group', style: { marginBottom: '12px' } }, [
              React.createElement('label', null, 'Tax %'),
              React.createElement('input', {
                type: 'number',
                value: taxPercentage,
                onChange: (e) => setTaxPercentage(parseFloat(e.target.value) || 0),
                step: '0.1',
                min: '0'
              })
            ]),
            calculatedTax > 0 && React.createElement('div', { key: 'tax-amount', className: 'cart-row' }, [
              React.createElement('span', { key: 'label', className: 'cart-label' }, 'Tax'),
              React.createElement('span', { key: 'value', className: 'cart-value' }, `₹${calculatedTax.toFixed(2)}`)
            ]),
            React.createElement('div', { key: 'discount-row', className: 'form-group', style: { marginBottom: '12px' } }, [
              React.createElement('label', null, 'Discount (₹)'),
              React.createElement('input', {
                type: 'number',
                value: discount,
                onChange: (e) => setDiscount(parseFloat(e.target.value) || 0),
                step: '0.01',
                min: '0'
              })
            ]),
            discount > 0 && React.createElement('div', { key: 'discount-amount', className: 'cart-row' }, [
              React.createElement('span', { key: 'label', className: 'cart-label' }, 'Discount'),
              React.createElement('span', { key: 'value', className: 'cart-value', style: { color: '#ef4444' } }, `-₹${discount.toFixed(2)}`)
            ]),
            React.createElement('div', { key: 'payment-row', className: 'form-group', style: { marginBottom: '12px' } }, [
              React.createElement('label', null, 'Payment Mode'),
              React.createElement('select', {
                value: paymentMethod,
                onChange: (e) => setPaymentMethod(e.target.value),
                style: { width: '100%' }
              }, [
                React.createElement('option', { key: 'cash', value: 'Cash' }, 'Cash'),
                React.createElement('option', { key: 'card', value: 'Card' }, 'Card'),
                React.createElement('option', { key: 'upi', value: 'UPI' }, 'UPI')
              ])
            ]),
            React.createElement('div', { key: 'total', className: 'total-amount' }, `₹${finalAmount.toFixed(2)}`)
          ]),
          React.createElement('button', { key: 'submit', className: 'btn-gold', onClick: createBill }, 'Generate Bill')
        ])
      ])
    ]),
    React.createElement('div', { key: 'history-section', style: { marginTop: '32px' } }, [
      React.createElement('h3', { key: 'history-title', style: { fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#2d3436' } }, 'Recent Bills'),
      bills.length > 0 && React.createElement('div', { key: 'table-container', style: { background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e8e4df' } },
        React.createElement('table', null, [
          React.createElement('thead', { key: 'head' }, React.createElement('tr', null, [
            React.createElement('th', { key: 'billno' }, 'Bill No'),
            React.createElement('th', { key: 'customer' }, 'Customer'),
            React.createElement('th', { key: 'total' }, 'Amount'),
            React.createElement('th', { key: 'method' }, 'Payment'),
            React.createElement('th', { key: 'date' }, 'Date')
          ])),
          React.createElement('tbody', { key: 'body' }, bills.slice(0, 10).map(bill =>
            React.createElement('tr', { key: bill.id }, [
              React.createElement('td', { key: 'billno' }, bill.billNo || '-'),
              React.createElement('td', { key: 'customer' }, bill.customerName || '-'),
              React.createElement('td', { key: 'total' }, `₹${bill.finalAmount.toFixed(2)}`),
              React.createElement('td', { key: 'method' }, bill.paymentMethod),
              React.createElement('td', { key: 'date' }, new Date(bill.createdAt).toLocaleDateString())
            ])
          ))
        ])
      ),
      bills.length === 0 && React.createElement('div', { key: 'no-bills', style: { textAlign: 'center', padding: '40px', color: '#999' } }, 'No bills created yet')
    ])
  ]);
};

// Main App Component
const App = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isAuthenticated) {
    return React.createElement(Login);
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return React.createElement(Dashboard);
      case 'products':
        return React.createElement(Products);
      case 'inventory':
        return React.createElement(Inventory);
      case 'bills':
        return React.createElement(Bills);
      default:
        return React.createElement(Dashboard);
    }
  };

  return React.createElement('div', null, [
    React.createElement('div', { key: 'header', className: 'header' }, [
      React.createElement('div', { key: 'header-left', className: 'header-left' }, [
        React.createElement('h1', { key: 'title' }, '🍵 Tea Shop'),
        React.createElement('div', { key: 'nav', className: 'nav-links' }, [
          React.createElement('button', { 
            key: 'dashboard', 
            onClick: () => setCurrentPage('dashboard'),
            className: currentPage === 'dashboard' ? 'active' : ''
          }, 'Dashboard'),
          React.createElement('button', { 
            key: 'bills',
            onClick: () => setCurrentPage('bills'),
            className: currentPage === 'bills' ? 'active' : ''
          }, 'New Bill'),
          React.createElement('button', { 
            key: 'bill-history',
            onClick: () => setCurrentPage('bills'),
            style: { marginLeft: 'auto' }
          }, 'Bill History'),
          React.createElement('button', { 
            key: 'products', 
            onClick: () => setCurrentPage('products')
          }, 'Products'),
          React.createElement('button', { 
            key: 'inventory', 
            onClick: () => setCurrentPage('inventory')
          }, 'Inventory')
        ])
      ]),
      React.createElement('div', { key: 'header-right', className: 'header-right' }, [
        React.createElement('div', { key: 'admin', className: 'shop-admin' }, `Shop Admin`),
        React.createElement('button', { 
          key: 'logout', 
          className: 'btn btn-danger',
          onClick: logout,
          style: { padding: '8px 12px', fontSize: '12px' }
        }, `Logout`)
      ])
    ]),
    React.createElement('div', { key: 'container', className: 'container' }, React.createElement('div', { className: 'content' }, renderPage()))
  ]);
};

// Render the app
ReactDOM.render(
  React.createElement(AuthProvider, null, React.createElement(App)),
  document.getElementById('root')
);
