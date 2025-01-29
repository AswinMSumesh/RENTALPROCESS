import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Tool.module.css';

const ToolBookingReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [alert, setAlert] = useState('');
  const router = useRouter(); 


  useEffect(() => {
    const fetchToolBookingReport = async () => {
      try {
        const response = await axios.get('https://localhost:7072/api/Tool/allUsersToolBookingReport');
        setReportData(response.data);
      } catch (error) {
        console.error('Failed to fetch tool booking report:', error);
        setAlert('Failed to fetch tool booking report.');
      }
    };
    fetchToolBookingReport();
  }, []);

  return (
    <div className={styles.toolPage}>
      <nav className={styles.navbar}>
        <button className={styles.backButton} onClick={() => router.push('/home')}>Back to Home</button>
        <button className={styles.backButton} onClick={() => router.push('/tool')}>Back to Tool Page</button>
      </nav>
      <h1 className={styles.heading}>Tool Booking Report</h1>
      {alert && <div className={styles.alert}>{alert}</div>}
      <table className={styles.toolTable}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Type</th>
            {/* <th>Booking Details</th> */}
          </tr>
        </thead>
        <tbody>
          {reportData.map((entry, index) => (
            <tr key={index}>
              <td>{entry.user.username}</td>
              <td>{entry.user.email}</td>
              <td>{entry.user.type}</td>
              {/* <td>
                {entry.bookingDetails.length > 0 ? (
                  entry.bookingDetails.map((booking, idx) => (
                    <div key={idx}>
                      <p>Booking ID: {booking.id}</p>
                      <p>Tool Name: {booking.toolName}</p>
                      <p>Rate: {booking.rate}</p>
                      <hr />
                    </div>
                  ))
                ) : (
                  <p>No bookings</p>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ToolBookingReportPage;
