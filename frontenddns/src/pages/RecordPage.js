import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AddRecordModal from '../components/AddRecordModal';
import BulkUploadModal from '../components/BulkUploadModal';
import EditRecordModal from '../components/EditRecordModal';
import SearchBar from '../components/SearchBar';
import RecordTypeDistributionChart from '../components/RecordTypeDistributionChart';
import '../styles/RecordsPage.css';

const RecordsPage = () => {
  const { zoneId } = useParams();
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [recordTypeDistribution, setRecordTypeDistribution] = useState({});
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecords();
  }, [zoneId]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/route53/zones/hostedzone/${zoneId}/records`);
      const data = response.data;
      setRecords(data);
      setFilteredRecords(data);
      calculateRecordTypeDistribution(data);
      setSuccess(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch records';
      console.error('Error fetching records:', error);
      setError(errorMessage);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const calculateRecordTypeDistribution = (records) => {
    const distribution = records.reduce((acc, record) => {
      acc[record.Type] = (acc[record.Type] || 0) + 1;
      return acc;
    }, {});
    setRecordTypeDistribution(distribution);
  };

  const handleEditRecord = (record) => {
    setEditRecord(record);
  };

  const handleDeleteRecord = async (record) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/route53/zones/hostedzone/${zoneId}/records`, { data: record });
      await new Promise(resolve => setTimeout(resolve, 1000));
      fetchRecords();
      setSuccess(true);
    } catch (error) {
      console.error('Error deleting record:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value;
    setSearchTerm(searchValue);
    applyFilter(searchValue, filterType);
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value;
    setFilterType(filterValue);
    applyFilter(searchTerm, filterValue);
  };

  const applyFilter = (search, type) => {
    let filtered;
    if (search || type) {
      filtered = records.filter(record => {
        const nameMatch = !search || record.Name.toLowerCase().includes(search.toLowerCase());
        const typeMatch = !type || record.Type === type;
        return nameMatch && typeMatch;
      });
    } else {
      filtered = records;
    }
    setFilteredRecords(filtered);
  };

  return (
    <div className="records-page">
      {loading && <div className="notification">Loading...</div>}
      {error && <div className="notification error">Error: {error}</div>}
      {success && <div className="notification success">Operation successful!</div>}

      <h2>Records for Zone: {zoneId}</h2>
      <SearchBar
        searchTerm={searchTerm}
        filterType={filterType}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
      />
      <button onClick={() => setAddModalOpen(true)}>Add Single Record</button>
      <button onClick={() => setBulkUploadModalOpen(true)}>Add Bulk Records</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>TTL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record, index) => (
              <tr key={index}>
                <td>{record.Name}</td>
                <td>{record.Type}</td>
                <td>{record.ResourceRecords.map(r => r.Value).join(', ')}</td>
                <td>{record.TTL}</td>
                <td>
                  <button onClick={() => handleEditRecord(record)}>Edit</button>
                  <button onClick={() => handleDeleteRecord(record)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            records.map((record, index) => (
              <tr key={index}>
                <td>{record.Name}</td>
                <td>{record.Type}</td>
                <td>{record.ResourceRecords.map(r => r.Value).join(', ')}</td>
                <td>{record.TTL}</td>
                <td>
                  <button onClick={() => handleEditRecord(record)}>Edit</button>
                  <button onClick={() => handleDeleteRecord(record)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {isAddModalOpen && (
        <AddRecordModal
          isOpen={isAddModalOpen}
          onRequestClose={() => setAddModalOpen(false)}
          hostedZoneId={zoneId}
          fetchRecords={fetchRecords}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {isBulkUploadModalOpen && (
        <BulkUploadModal
          isOpen={isBulkUploadModalOpen}
          onRequestClose={() => setBulkUploadModalOpen(false)}
          hostedZoneId={zoneId}
          fetchRecords={fetchRecords}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      {editRecord && (
        <EditRecordModal
          isOpen={true}
          onRequestClose={() => setEditRecord(null)}
          record={editRecord}
          zoneId={zoneId}
          onUpdateRecord={fetchRecords}
          setError={setError}
          setSuccess={setSuccess}
        />
      )}
      <RecordTypeDistributionChart recordTypeDistribution={recordTypeDistribution} />
    </div>
  );
};

export default RecordsPage;
