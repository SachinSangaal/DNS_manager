import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/AddRecordModal.css';

const AddRecordModal = ({ isOpen, onRequestClose, hostedZoneId, fetchRecords, setError, setSuccess }) => {
  // State variables for the form inputs
  const [type, setType] = useState('A');
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [ttl, setTTL] = useState(300);
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const record = {
      Type: type,
      Name: name,
      TTL: parseInt(ttl, 10), // Ensure TTL is an integer
      ResourceRecords: [{ Value: value }],
    };

    try {
      await axios.post(`http://localhost:3000/route53/zones/hostedzone/${hostedZoneId}/records`, record);
      fetchRecords();
      onRequestClose();
      setSuccess('Record added successfully');
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add record';
      console.error('Error adding record:', error);
      setError(errorMessage);
      setSuccess(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Add Record">
      <h2>Add DNS Record</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {['A', 'AAAA', 'CNAME', 'MX', 'NS', 'PTR', 'SOA', 'SRV', 'TXT'].map((recordType) => (
                <option key={recordType} value={recordType}>{recordType}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Value:
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            TTL:
            <input type="number" value={ttl} onChange={(e) => setTTL(e.target.value)} required />
          </label>
        </div>
        <div>
          <button type="submit">Add Record</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRecordModal;
