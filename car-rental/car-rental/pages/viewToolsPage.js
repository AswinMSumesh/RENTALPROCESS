import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/Tool.module.css';

const ViewToolsPage = () => {
  const [tools, setTools] = useState([]);
  const [alert, setAlert] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch the list of tools when the component mounts
    const fetchTools = async () => {
      try {
        const response = await axios.get('https://localhost:7072/api/Tool/allTools');
        setTools(response.data);
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      }
    };
    fetchTools();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7072/api/Tool/deletetool?id=${id}`);
      setTools(tools.filter((tool) => tool.id !== id));
      setAlert('Tool deleted successfully!');
    } catch (error) {
      console.error('Failed to delete tool:', error);
      setAlert('Failed to delete tool.');
    }
  };

  const handleStatus = async (id) => {
    try {
      const response = await axios.put(`https://localhost:7072/api/Tool/changetoolstatus?${id}`, {}, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        // Assuming you want to change the status locally for the tool without removing it
        setTools(tools.map((tool) => (tool.id === id ? { ...tool, status: 'changed' } : tool)));
        setAlert('Status changed successfully!');
      } else {
        setAlert('Failed to change tool status.');
      }
    } catch (error) {
      console.error('Failed to change tool status:', error);
      setAlert('Failed to change tool status.');
    }
  };

  return (
    <div className={styles.toolPage}>
      <nav className={styles.navbar}>
        <button className={styles.backButton} onClick={() => router.push('/home')}>Back to Home</button>
        <button className={styles.backButton} onClick={() => router.push('/tool')}>Back to Add Tool</button>
      </nav>
      <h1 className={styles.heading}>View Added Tools</h1>
      {alert && <div className={styles.alert}>{alert}</div>}
      <table className={styles.toolTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rate</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id}>
              <td>{tool.name}</td>
              <td>{tool.rate}</td>
              <td>
                <button className={styles.deleteButton} onClick={() => handleDelete(tool.id)}>Delete</button>
                {/* <button style={{ marginLeft: 20 }} className={styles.statusButton} onClick={() => handleStatus(tool.id)}>Change Status</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewToolsPage;
