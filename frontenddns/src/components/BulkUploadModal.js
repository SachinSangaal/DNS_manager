import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../styles/BulkUploadModal.css';

const BulkUploadModal = ({ isOpen, onRequestClose, hostedZoneId, fetchRecords }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:3000/route53/zones/hostedzone/${hostedZoneId}/bulk-upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchRecords();
      onRequestClose();
    } catch (error) {
      console.error('Error uploading bulk file:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} contentLabel="Bulk Upload">
      <h2>Bulk Upload DNS Records</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} accept=".csv, .json" />
        <button type="submit">Upload</button>
      </form>
    </Modal>
  );
};

export default BulkUploadModal;
