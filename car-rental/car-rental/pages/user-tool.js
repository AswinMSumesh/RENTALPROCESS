import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/UserTool.module.css';

const UserTool = () => {
  const [liveTools, setLiveTools] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);
  const [formData, setFormData] = useState({
    fromDate: '',
    toDate: '',
    phoneNumber: '',
    aadhar: '',
    rent: 0
  });
  const [alert, setAlert] = useState('');
  const [history, setHistory] = useState([]);
  const [view, setView] = useState('liveTools'); // State to toggle views
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null; // Get userId from localStorage
  const router = useRouter();

  const fetchLiveTools = async () => {
    try {
      const response = await axios.get('https://localhost:7072/api/Tool/livetools');
      setLiveTools(response.data);
      setView('liveTools');
    } catch (error) {
      console.error('Failed to fetch live tools:', error);
      setAlert('Failed to fetch live tools.');
    }
  };

  const fetchHistory = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`https://localhost:7072/api/Tool/userPageToolBookingReport?userId=${userId}`);
      const bookingDetails = response.data.bookingDetails.map(booking => ({
        ...booking,
        username: response.data.user.username
      }));
      setHistory(bookingDetails);
      setView('history');
    } catch (error) {
      console.error('Failed to fetch booking history:', error);
      setAlert('Failed to fetch booking history.');
    }
  };

  const handleRentNow = (tool) => {
    setSelectedTool(tool);
    setShowForm(true);
    setFormData({
      ...formData,
      rent: tool.rate
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    const days = (toDate - fromDate) / (1000 * 3600 * 24);
    const payment = days * selectedTool.rate;

    try {
      await axios.post('https://localhost:7072/api/Tool/booktool', {
        userId, // Pass userId from localStorage
        toolId: selectedTool.id,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        payment,
        phoneNumber: formData.phoneNumber,
        aadhar: formData.aadhar,
        bookingDate: new Date().toISOString()
      });
      setAlert('Tool booked successfully!');
      setShowForm(false);
      router.reload(); // Refresh the page after form submission
    } catch (error) {
      console.error('Failed to book tool:', error);
      setAlert('Failed to book tool.');
    }
  };

  const calculateTotalRent = () => {
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    const days = (toDate - fromDate) / (1000 * 3600 * 24);
    const totalRent = days * selectedTool.rate;
    setFormData({ ...formData, rent: totalRent });
  };

  useEffect(() => {
    if (formData.fromDate && formData.toDate && selectedTool) {
      calculateTotalRent();
    }
  }, [formData.fromDate, formData.toDate, selectedTool]);

  return (
    <div className={styles.userTool}>
      <nav className={styles.navbar}>
        <button className={styles.liveToolsButton} onClick={fetchLiveTools}>Live Tools</button>
        <button className={styles.historyButton} onClick={fetchHistory}>History</button>
      </nav>
      <h1 className={styles.heading}>Welcome</h1>
      {alert && <div className={styles.alert}>{alert}</div>}
      {view === 'liveTools' && (
        <div className={styles.cardContainer}>
          {liveTools.map(tool => (
            <div key={tool.id} className={styles.card}>
              <h2>{tool.name}</h2>
              <p>Rate: {tool.rate}</p>
              <button className={styles.rentNowButton} onClick={() => handleRentNow(tool)}>Rent Now</button>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className={styles.popupForm}>
          <form onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
              <label>
                From Date:
                <input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                To Date:
                <input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                Phone Number:
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                Aadhar Number:
                <input
                  type="text"
                  value={formData.aadhar}
                  onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                  required
                />
              </label>
            </div>
            <div className={styles.formGroup}>
              <label>
                Rent:
                <input
                  type="text"
                  value={formData.rent}
                  readOnly
                />
              </label>
            </div>
            <button type="submit" className={styles.submitButton}>Submit</button>
            <button type="button" className={styles.cancelButton} onClick={() => setShowForm(false)}>Cancel</button>
          </form>
        </div>
      )}
      {view === 'history' && (
        <div className={styles.historyContainer}>
          <h2 className={styles.historyHeading}>Booking History</h2>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Payment</th>
                <th>Phone Number</th>
                <th>Aadhar Number</th>
              </tr>
            </thead>
            <tbody>
              {history.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.username}</td>
                  <td>{booking.fromDate}</td>
                  <td>{booking.toDate}</td>
                  <td>{booking.payment}</td>
                  <td>{booking.phoneNumber}</td>
                  <td>{booking.aadhar}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserTool;
