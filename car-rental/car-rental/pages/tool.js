import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router'; // Import useRouter for navigation
import styles from '../styles/Tool.module.css';

const ToolPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [toolName, setToolName] = useState('');
  const [rate, setRate] = useState('');
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState('');
  const router = useRouter(); 

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!toolName) {
      validationErrors.toolName = 'Tool name is required';
    }
    if (!rate) {
      validationErrors.rate = 'Rate is required';
    } else if (isNaN(rate)) {
      validationErrors.rate = 'Rate must be a number';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post('https://localhost:7072/api/Tool/addtool', {
        name: toolName,
        rate: parseFloat(rate),
      });
      // Reset form fields, close the form, and show success alert
      setToolName('');
      setRate('');
      setShowForm(false);
      setErrors({});
      setAlert('Tool added successfully!');
    } catch (error) {
      console.error('Failed to add tool:', error);
      setAlert('Failed to add tool.');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setToolName('');
    setRate('');
    setErrors({});
  };

  return (
    <div className={styles.toolPage}>
      <nav className={styles.navbar}>
        <button className={styles.addToolButton} onClick={() => setShowForm(true)}>Add Tool</button>
        <button className={styles.backButton} onClick={() => router.push('/home')}>Back to Home</button>
        <button className={styles.viewToolsButton} onClick={() => router.push('/viewToolsPage')}>View Added Tools</button>
        <button className={styles.toolBookingReportButton} onClick={() => router.push('/tool-booking-report')}>Tool Booking Report</button>
      </nav>
      <h1 className={styles.heading}>Welcome to the Tool Page</h1>
      {alert && <div className={styles.alert}>{alert}</div>}
      {showForm && (
        <div className={styles.popupForm}>
          <form onSubmit={handleFormSubmit}>
            <div className={styles.formGroup}>
              <label>
                Tool Name:
                <input
                  type="text"
                  value={toolName}
                  onChange={(e) => setToolName(e.target.value)}
                  className={errors.toolName ? styles.inputError : ''}
                />
              </label>
              {errors.toolName && <span className={styles.error}>{errors.toolName}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>
                Rate:
                <input
                  type="text"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className={errors.rate ? styles.inputError : ''}
                />
              </label>
              {errors.rate && <span className={styles.error}>{errors.rate}</span>}
            </div>
            <div className={styles.buttonGroup}>
              <button type="submit" className={styles.submitButton}>Submit</button>
              <button type="button" className={styles.cancelButton} onClick={handleCancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ToolPage;
