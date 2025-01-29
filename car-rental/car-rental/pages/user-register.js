// components/UserRegister.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Auth.module.css';

export default function UserRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('https://localhost:7072/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          type: 'USER',
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Handle successful registration (e.g., redirect to login page or display a success message)
      alert('Registration successful');
      router.push('/user-login');
    } catch (error) {
      setError(error.message);
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>User Register</h1>
      <form className={styles.form} onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.button}>Register</button>
      </form>
    </div>
  );
}
