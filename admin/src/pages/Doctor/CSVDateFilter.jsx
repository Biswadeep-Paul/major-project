import React, { useState, useRef } from 'react';
import { parse } from 'papaparse';
import { Download, Upload, Filter, X, Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const CSVDateFilter = () => {
  const [csvData, setCsvData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateColumn, setDateColumn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    
    parse(file, {
      header: true,
      complete: (results) => {
        if (results.data.length === 0) {
          toast.error('CSV file is empty');
          setIsLoading(false);
          return;
        }
        
        setCsvData(results.data);
        setFilteredData(results.data);
        
        // Try to auto-detect date column
        const firstRow = results.data[0];
        const possibleDateColumns = Object.keys(firstRow).filter(key => 
          key.toLowerCase().includes('date') || 
          key.toLowerCase().includes('time') ||
          firstRow[key].match(/\d{1,4}[\/\-]\d{1,2}[\/\-]\d{1,4}/)
        );
        
        if (possibleDateColumns.length > 0) {
          setDateColumn(possibleDateColumns[0]);
        }
        
        setIsLoading(false);
        toast.success(`Loaded ${results.data.length} records`);
      },
      error: (error) => {
        toast.error(`Error parsing CSV: ${error.message}`);
        setIsLoading(false);
      }
    });
  };

  // Filter data by date range
  const filterByDate = () => {
    if (!dateColumn) {
      toast.error('Please select a date column');
      return;
    }

    if (!startDate && !endDate) {
      setFilteredData(csvData);
      toast.info('Showing all records (no date filter applied)');
      return;
    }

    const filtered = csvData.filter(row => {
      const rowDateStr = row[dateColumn];
      if (!rowDateStr) return false;

      // Try to parse the date in various formats
      const rowDate = new Date(rowDateStr);
      if (isNaN(rowDate.getTime())) {
        // Try alternative date parsing if standard fails
        const parts = rowDateStr.split(/[/\-]/);
        if (parts.length === 3) {
          const [day, month, year] = parts;
          rowDate = new Date(`${year}-${month}-${day}`);
        }
      }

      if (isNaN(rowDate.getTime())) {
        console.warn(`Could not parse date: ${rowDateStr}`);
        return false;
      }

      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && rowDate < start) return false;
      if (end && rowDate > end) return false;

      return true;
    });

    setFilteredData(filtered);
    toast.success(`Filtered to ${filtered.length} records`);
  };

  // Reset filters
  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setFilteredData(csvData);
    toast.info('Reset all filters');
  };

  // Download filtered data as CSV
  const downloadFilteredCSV = () => {
    if (filteredData.length === 0) {
      toast.error('No data to download');
      return;
    }

    const headers = Object.keys(filteredData[0]);
    const csvRows = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(fieldName => {
          const value = row[fieldName] || '';
          // Escape quotes in values
          return `"${value.toString().replace(/"/g, '""')}"`;
        }).join(',')
      )
    ];

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `filtered_data_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">CSV Date Filter</h2>
      
      {/* File Upload Section */}
      <div className="mb-8 p-4 border border-dashed border-gray-300 rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {csvData.length > 0 ? 'Upload New CSV' : 'Upload CSV File'}
          </button>
          <p className="text-sm text-gray-500">
            {csvData.length > 0 
              ? `${csvData.length} records loaded` 
              : 'Upload a CSV file to begin filtering'}
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      {csvData.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Column</label>
              <select
                value={dateColumn}
                onChange={(e) => setDateColumn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Date Column</option>
                {Object.keys(csvData[0]).map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={filterByDate}
              disabled={isLoading || !dateColumn}
              className={`flex items-center px-4 py-2 rounded-md ${
                isLoading || !dateColumn
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <RefreshCw className="animate-spin mr-2" size={16} />
              ) : (
                <Filter className="mr-2" size={16} />
              )}
              Apply Filter
            </button>
            
            <button
              onClick={resetFilters}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              <X className="mr-2" size={16} />
              Reset
            </button>
            
            <button
              onClick={downloadFilteredCSV}
              disabled={filteredData.length === 0}
              className={`flex items-center px-4 py-2 rounded-md ml-auto ${
                filteredData.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Download className="mr-2" size={16} />
              Download Filtered CSV
            </button>
          </div>
        </div>
      )}

      {/* Data Preview */}
      {filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <h3 className="text-lg font-medium mb-3 text-gray-700">
            Preview ({filteredData.length} records)
          </h3>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(filteredData[0]).map((header) => (
                    <th
                      key={header}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.slice(0, 100).map((row, i) => (
                  <tr key={i}>
                    {Object.values(row).map((value, j) => (
                      <td
                        key={j}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
                {filteredData.length > 10 && (
                  <tr>
                    <td colSpan={Object.keys(filteredData[0]).length} className="text-center py-2 text-sm text-gray-500">
                      Showing first  of {filteredData.length} records
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVDateFilter;