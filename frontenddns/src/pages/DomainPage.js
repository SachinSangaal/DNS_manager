import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DomainDistributionChart from '../components/DomainDistributionChart';
import '../styles/DomainPage.css';

const DomainPage = () => {
  const [domains, setDomains] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [domainDistribution, setDomainDistribution] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await axios.get('http://localhost:3000/route53/zones');
      setDomains(response.data);

      // Calculate domain distribution
      const distribution = response.data.reduce((acc, domain) => {
        const domainName = domain.Name.split('.').slice(-2).join('.');
        acc[domainName] = (acc[domainName] || 0) + 1;
        return acc;
      }, {});

      setDomainDistribution(distribution);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to add record';
      console.error('Error adding record:', error);
      setError(errorMessage);
      setSuccess(null);
    }
  };

  return (
    <div className="domain-page">
      {error && <div className="notification error">Error: {error}</div>}
      {success && <div className="notification success">Operation successful!</div>}
      <h2>Domains</h2>
      <table>
        <thead>
          <tr>
            <th>Domain Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {domains.map(domain => (
            <tr key={domain.Id}>
              <td>{domain.Name}</td>
              <td>
                <button onClick={() =>navigate(`/records/${domain.Id}`)}>View Records</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DomainDistributionChart domainDistribution={domainDistribution} />
    </div>
  );
};

export default DomainPage;
