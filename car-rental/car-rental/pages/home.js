import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Homee.module.css';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  const [cars, setCars] = useState([]);
  const [rentings, setRentings] = useState([]);
  const [allRentings, setAllRentings] = useState([]);
  const [carName, setCarName] = useState('');
  const [plateNum, setPlateNum] = useState('');
  const [regYear, setRegYear] = useState('');
  const [color, setColor] = useState('');
  const [mileage, setMileage] = useState('');
  const [seats, setSeats] = useState('');
  const [engineType, setEngineType] = useState('');
  const [rate, setRate] = useState('');
  const [image, setImage] = useState('');
  const [view, setView] = useState('');
  // const [viewRent, setViewRent] = useState('');
  const router = useRouter();

  const fetchAllCars = async () => {
    try {
      const response = await fetch('https://localhost:7072/api/Car/allCars');
      if (!response.ok) {
        throw new Error('Failed to fetch cars');
      }
      const data = await response.json();
      setCars(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const fetchAllRentings = async () => {
    try {
      const response = await fetch('https://localhost:7072/api/Renting/adminViewAllRentings');
      if (!response.ok) {
        throw new Error('Failed to fetch rentings');
      }
      const data = await response.json();
      setRentings(data);
    } catch (error) {
      alert(error.message);
    }
  };


  const fetchAllRentedCars = async () => {
    try {
      const response = await fetch('https://localhost:7072/api/Car/rentedCars');
      if (!response.ok) {
        throw new Error('Failed to fetch rentings');
      }
      const data = await response.json();
      setAllRentings(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      // const img = reader.result;
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7072/api/Car/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carName,
          plateNum,
          regYear,
          color,
          mileage,
          seats,
          engineType,
          rate,
          image,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add car');
      }

      alert('Car added successfully');
      setShowPopup(false);
      // Clear form fields
      setCarName('');
      setPlateNum('');
      setRegYear('');
      setColor('');
      setMileage('');
      setSeats('');
      setEngineType('');
      setRate('');
      setImage('');
      // Refresh the car list
      fetchAllCars();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://localhost:7072/api/Car/delete?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete car');
      }

      alert('Car deleted successfully');
      // Remove the car from the state
      setCars(cars.filter(car => car.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };


  const handleUpdate = async (rentId) => {
    try {
      const response = await fetch(`https://localhost:7072/api/Car/updateStatus?id=${rentId}&status=1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
  
      alert('Status changed successfully');
      // Remove the car from the state
      setCars(cars.filter(car => car.id !== rentId));
    } catch (error) {
      alert(error.message);
    }
  }
  
  const logOut  = () =>
  {
    alert('Are you sure want to logout?')
    router.push('/');
    localStorage.clear();
  }

  const tool = () =>
  {
    router.push('/tool');
  }

  return (
    <div>
      <nav className={styles.navbar}>
        <h1>Home Page</h1>
        <button className={styles.addButton} onClick={() => setShowPopup(true)}>Add Car</button>
        <button className={styles.viewButton} onClick={() => { fetchAllCars(); setView('cars'); }}>View All Cars</button>
        <button className={styles.viewButton} onClick={() => { fetchAllRentings(); setView('rentings'); }}>View All Rentings</button>
        <button className={styles.viewButton} onClick={() => { fetchAllRentedCars(); setView('allRentings'); }}>View Rented Cars</button>
        <button className={styles.viewButton} onClick={() => { tool();}}>Tool</button>
        <button className={styles.viewButton} onClick={() => { logOut();}}>Logout</button>
      </nav>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Add Car</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Car Name"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Number Plate"
                value={plateNum}
                onChange={(e) => setPlateNum(e.target.value)}
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Register Year"
                value={regYear}
                onChange={(e) => setRegYear(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Number of Seats"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                className={styles.input}
              />
              <input
                type="text"
                placeholder="Engine Type"
                value={engineType}
                onChange={(e) => setEngineType(e.target.value)}
                className={styles.input}
              />
              <input
                type="number"
                placeholder="Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className={styles.input}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.input}
              />
              <button type="submit" className={styles.button}>Submit</button>
              <button type="button" className={styles.button} onClick={() => setShowPopup(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
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
              <button className={styles.deleteButton} onClick={() => handleDelete(car.id)}>Delete</button>
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
                <th>User ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Car ID</th>
                <th>Car Name</th>
                <th>Plate Number</th>
                <th>From Date</th>
                <th>To Date</th>
                <th>Payment</th>
                <th>Booking Date</th>
                <th>Aadhar</th>
                <th>Phone Number</th>
              </tr>
            </thead>
            <tbody>
              {rentings.map((rent) => (
                <tr key={rent.rentId}>
                  <td>{rent.rentId}</td>
                  <td>{rent.userId}</td>
                  <td>{rent.username}</td>
                  <td>{rent.email}</td>
                  <td>{rent.carId}</td>
                  <td>{rent.carName}</td>
                  <td>{rent.plateNum}</td>
                  <td>{new Date(rent.fromDate).toLocaleDateString()}</td>
                  <td>{new Date(rent.toDate).toLocaleDateString()}</td>
                  <td>{rent.payment}</td>
                  <td>{new Date(rent.bookingDate).toLocaleDateString()}</td>
                  <td>{rent.aadhar}</td>
                  <td>{rent.phoneNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        {view === 'allRentings' && (
        <div className={styles.rentingList}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Car Name</th>
                <th>Plate Number</th>
                <th>Reg Year</th>
                <th>Color</th>
                <th>Mileage</th>
                <th>Seats</th>
                <th>Engine Type</th>
                <th>Rate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {allRentings.map((rent) => (
                <tr key={rent.rentId}>
                  <td>{rent.carName}</td>
                  <td>{rent.plateNum}</td>
                  <td>{rent.regYear}</td>
                  <td>{rent.color}</td>
                  <td>{rent.mileage}</td>
                  <td>{rent.seats}</td>
                  <td>{rent.engineType}</td>
                  <td>{rent.rate}</td>
                  <td>
                    <button className={styles.deleteButton} onClick={() => handleUpdate(rent.id, rent.status)}>Update</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
