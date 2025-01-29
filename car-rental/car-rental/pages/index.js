import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Car Rental</h1>
      <div className={styles.links}>
        <Link href="/user-login" className={styles.link}>
          User Login
        </Link>
        <Link href="/admin-login" className={styles.link}>
          Admin Login
        </Link>
        <Link href="/user-register" className={styles.link}>
          User Register
        </Link>
      </div>
    </div>
  );
}
