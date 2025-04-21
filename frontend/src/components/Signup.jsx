import React, { useState } from 'react';
import { Form, Button, Container, Card } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const newUser = { name, email, password };

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const alreadyExists = users.some(user => user.email === email);

    if (alreadyExists) {
      toast.error('User already exists with this email');
      return;
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    toast.success('Registered Successfully!');
    
    setTimeout(() => navigate('/login'), 1500);
  };

  return (
    <div className="signup-bg">
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fs-4">NoteBuddy</span>
      </nav>

      <Container className="flex-grow-1 d-flex justify-content-center align-items-center vh-100">
        <Card className="p-4 shadow card">
          <h3 className="text-center mb-3">Signup</h3>
          <Form onSubmit={handleSignup}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

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
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              Signup
            </Button>
          </Form>
          <div className="mt-3 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Card>
      </Container>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default Signup;
