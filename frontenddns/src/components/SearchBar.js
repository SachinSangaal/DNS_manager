import React from 'react';
import '../styles/SearchBar.css';

const SearchBar = ({ searchTerm, filterType, handleSearchChange, handleFilterChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <select value={filterType} onChange={handleFilterChange}>
        <option value="">All Types</option>
        <option value="A">A</option>
        <option value="AAAA">AAAA</option>
        <option value="CNAME">CNAME</option>
        <option value="MX">MX</option>
        <option value="NS">NS</option>
        <option value="PTR">PTR</option>
        <option value="SOA">SOA</option>
        <option value="SRV">SRV</option>
        <option value="TXT">TXT</option>
        <option value="DNSSEC">DNSSEC</option>
      </select>
    </div>
  );
};

export default SearchBar;
