import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    const validUser = storedUsers.find(
      user => user.email === email && user.password === password
    );

    if (validUser) {
      localStorage.setItem('currentUser', JSON.stringify(validUser));
      toast.success('Logged in successfully!', {
        position: 'top-right',
        autoClose: 2000,
        onClose: () => navigate('/home')
      });
    } else {
      toast.error('Invalid credentials!', {
        position: 'top-right',
        autoClose: 2000
      });
    }
  };

  return (
    <div className="login-bg">
      <nav className="navbar navbar-dark bg-dark px-4 d-flex justify-content-between align-items-center">
        <span className="navbar-brand fs-4">NoteBuddy</span>
      </nav>

      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="login-card p-4 shadow">
          <h3 className="text-center mb-3">Login</h3>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Don't have an account? <Link to="/signup">Signup</Link>
          </div>
        </Card>
      </Container>

      {/* Toast container to show notifications */}
      <ToastContainer position="top-right" />
    </div>
  );
}

export default Login;
