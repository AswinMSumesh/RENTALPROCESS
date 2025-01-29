import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Feed.module.css';

export default function Feed() {
  const [rentings, setRentings] = useState([]);
  const [cars, setCars] = useState([]);
  const [view, setView] = useState('');
  const [showRentPopup, setShowRentPopup] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [totalRent, setTotalRent] = useState(0);
  const router = useRouter();

  const fetchUserRentings = async () => {
    try {
      const userId = localStorage.getItem('userId');
      console.log('Fetching rentings for userId:', userId);
      const response = await fetch(`https://localhost:7072/api/Renting/userViewTheirRentings?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch rentings');
      }
      const data = await response.json();
      console.log('Fetched rentings data:', data);
      setRentings(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error fetching rentings:', error);
      alert(error.message);
    }
  };

  const fetchInStockCars = async () => {
    try {
      const response = await fetch('https://localhost:7072/api/Car/instockCars');
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();
      console.log('Fetched cars data:', data);
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
      alert(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    router.push('/');
  };

  const userTools = () =>
  {
    router.push('user-tool');
  }

  const calculateTotalRent = (baseRent) => {
    const from = new Date(fromDate);
    const to = new Date(toDate);
    const diffTime = Math.abs(to - from);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    setTotalRent(diffDays * baseRent);
  };

  const handleRentNow = (car) => {
    setSelectedCar(car);
    setShowRentPopup(true);
    setTotalRent(0); // Reset total rent
  };

  const handleSubmitRent = async () => {
    if (!fromDate || !toDate || !phoneNumber || !aadhar) {
      alert('Please fill in all the required fields.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      const bookingDate = new Date().toISOString();
      const rentData = {
        userId,
        carId: selectedCar.id,
        fromDate,
        toDate,
        payment: totalRent,
        phoneNumber,
        aadhar,
        bookingDate
      };
      const response = await fetch('https://localhost:7072/api/Renting/rentCar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(rentData)
      });

      if (!response.ok) {
        throw new Error('Failed to rent car');
      }

      alert('Car rented successfully');
      setShowRentPopup(false);
      setSelectedCar(null);
      setFromDate('');
      setToDate('');
      setPhoneNumber('');
      setAadhar('');
      setTotalRent(0);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('No userId found in local storage. Please log in.');
    }
  }, []);

  useEffect(() => {
    if (fromDate && toDate && selectedCar) {
      calculateTotalRent(selectedCar.rate);
    }
  }, [fromDate, toDate, selectedCar]);

  const handleViewChange = (newView) => {
    setView(newView);
    if (newView === 'rentings') {
      fetchUserRentings();
    } else if (newView === 'cars') {
      fetchInStockCars();
    }
  };

  return (
    <div>
      <nav className={styles.navbar}>
        <h1>Feed Page</h1>
        <div>
          <button className={styles.navButton} onClick={() => handleViewChange('cars')}>Cars</button>
          <button className={styles.navButton} onClick={() => handleViewChange('rentings')}>My Rentings</button>
          <button className={styles.navButton} onClick={userTools}>Tools</button>
          <button className={styles.navButton} onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      {view === 'cars' && (
        <div className={styles.carList}>
          {cars.map((car) => (
            <div className={styles.card} key={car.id}>
              <img src={car.image} alt={car.carName} className={styles.carImage} />
              <h3>{car.carName}</h3>
              <p>Plate Number: {car.plateNum}</p>
              <p>Registration Year: {car.regYear}</p>
              <p>Color: {car.color}</p>
              <p>Mileage: {car.mileage}</p>
              <p>Seats: {car.seats}</p>
              <p>Engine Type: {car.engineType}</p>
              <p>Rate: {car.rate}</p>
              <button className={styles.rentButton} onClick={() => handleRentNow(car)}>Rent Now</button>
            </div>
          ))}
        </div>
      )}
      {view === 'rentings' && (
        <div className={styles.rentingList}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Rent ID</th>
                <th>Car Name</th>
                <th>Plate Number</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Payment</th>
                <th>Booking Date</th>
              </tr>
            </thead>
            <tbody>
              {rentings.map((rent) => (
                <tr key={rent.rentId}>
                  <td>{rent.rentId}</td>
                  <td>{rent.carName || 'N/A'}</td>
                  <td>{rent.plateNum || 'N/A'}</td>
                  <td>{new Date(rent.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(rent.toDate).toLocaleDateString()}</td>
                  <td>{rent.payment.toFixed(2)}</td>
                  <td>{new Date(rent.bookingDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showRentPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Rent Car</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitRent(); }}>
              <p><strong>Car Name:</strong> {selectedCar.carName}</p>
              <p><strong>Base Rent:</strong> {selectedCar.rate}</p>
              <input
                type="date"
                placeholder="From Date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="date"
                placeholder="To Date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={styles.input}
                required
              />
              <input
                type="text"
                placeholder="Aadhar Number"
                value={aadhar}
                onChange={(e) => setAadhar(e.target.value)}
                className={styles.input}
                required
              />
              <p><strong>Total Rent:</strong> {totalRent}</p>
              <button type="submit" className={styles.button}>Submit</button>
              <button type="button" className={styles.button} onClick={() => setShowRentPopup(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
