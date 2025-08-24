import React, { useState } from 'react';
import { Upload, Download, Trash2, AlertCircle, CheckCircle, X, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  onUploadSuccess: () => void;
}

const categoryTemplates: Record<string, any> = {
  'angel-investors': {
    name: 'Angel Name',
    linkedinProfileUrl: 'LinkedIn URL',
    city: 'City',
    country: 'Country',
    investCategory: 'Fintech&SaaS&AI/ML',
    ticketSize: '500000',
    stage: 'Idea&MVP&Pre-revenue',
    preferFounderProfile: 'Tech founders with domain expertise',
    portfolioHighlights: 'Invested in 50+ startups',
    contact: 'angel@example.com'
  },
  'venture-capital': {
    name: 'VC Fund Name',
    websiteUrl: 'https://vcfund.com',
    headOffice: 'Mumbai, India',
    fundSize: '10000000',
    stageFocus: 'Series A&Series B',
    sectorFocus: 'SaaS&Fintech&AI/ML',
    avgTicketSize: '2000000',
    applicationProcess: 'Warm intro',
    contact: 'partners@vcfund.com',
    portfolioHighlights: 'Portfolio of 100+ companies',
    investmentThesis: 'Focus on B2B SaaS companies'
  },
  'micro-vcs': {
    name: 'Micro VC Name',
    websiteUrl: 'https://microvc.com',
    location: 'Bangalore, India',
    fundSize: '5000000',
    checkSize: '250000',
    stage: 'Pre-seed&Seed',
    sector: 'Deeptech&B2B SaaS',
    contact: 'hello@microvc.com',
    portfolioHighlights: 'Early stage specialist'
  },
  'incubators': {
    name: 'Incubator Name',
    websiteUrl: 'https://incubator.com',
    location: 'Delhi, India',
    fundingSupport: 'Up to ₹25L equity funding',
    otherBenefits: 'Mentorship, office space, legal support',
    eligibility: 'Early stage startups with MVP',
    applicationProcess: 'Rolling',
    contact: 'apply@incubator.com',
    alumniStartups: 'Zomato, Paytm, Ola'
  },
  'accelerators': {
    name: 'Accelerator Name',
    websiteUrl: 'https://accelerator.com',
    hq: 'Mumbai, India',
    batchFrequency: 'Bi-annual',
    stage: 'MVP&Early Revenue',
    fundingOffered: '₹50L for 8% equity',
    programDuration: '4 months',
    servicesProvided: 'Mentorship, funding, demo day',
    sectors: 'Fintech&Healthtech&Edtech',
    applicationLink: 'https://accelerator.com/apply',
    pastCohorts: 'Batch 1: 15 startups, Batch 2: 20 startups'
  },
  'govt-grants': {
    name: 'Grant Scheme Name',
    authority: 'DPIIT',
    stage: 'Idea&MVP&Pre-revenue',
    sector: 'Open',
    grantSize: '1000000',
    equityDilution: 'None',
    eligibility: 'DPIIT recognized startups',
    howToApply: 'Apply through startup.india.gov.in',
    timelines: 'Applications open year-round',
    contact: 'support@startupindia.gov.in',
    documentsRequired: 'DPIIT Certificate&Business Plan&Financial Projections',
    specialNotes: 'No equity dilution required'
  },
  'investor-matches': {
    name: 'Investor Name', // required
    stage: 'Seed', // required, enum
    industry: 'Fintech', // required
    traction: 'MVP', // required, enum
    description: 'Short description', // required
    checkSize: '500000', // required
    location: 'Mumbai, India', // required
    website: 'https://investor.com', // optional
    email: 'investor@example.com', // optional
    linkedin: 'https://linkedin.com/in/investor' // optional
  }
};

const categoryLabels: Record<string, string> = {
  'angel-investors': 'Angel Investors',
  'venture-capital': 'Venture Capital',
  'micro-vcs': 'Micro VCs',
  'incubators': 'Incubators',
  'accelerators': 'Accelerators',
  'govt-grants': 'Government Grants',
  'investor-matches': 'Investor Matches' // Added missing category
};

const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  category,
  onUploadSuccess
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL;

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const template = categoryTemplates[category];
    if (!template) return;

    const ws = XLSX.utils.json_to_sheet([template]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${getCategoryLabel(category)}_Template.xlsx`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    setError('');
    setSuccess('');
    
    // Preview the file
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // Skip first row (headers) and show preview of next 5 rows
        const previewData = jsonData.slice(1, 6);
        setPreview(previewData as any[]);
      } catch (err) {
        setError('Error reading Excel file');
        console.error(err);
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const processExcelData = (jsonData: any[]) => {
    const template = categoryTemplates[category];
    const headers = Object.keys(template);

    // Dedicated parsing for each funding category
    if (category === 'angel-investors') {
      return jsonData.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header, index) => {
          let value = row[index];
          if (value === undefined || value === null) value = '';
          if (["investCategory", "stage"].includes(header)) {
            // Use & as delimiter, always send as array
            value = typeof value === 'string' ? value.split('&').map(v => v.trim()).filter(Boolean) : [];
          } else if (header === 'ticketSize') {
            value = Number(value) || 0;
          } else {
            value = String(value).trim();
          }
          item[header] = value;
        });
        // Require all backend-required fields
        if (item.name && item.city && item.country && item.ticketSize && item.contact) return item;
        return null;
      }).filter(Boolean);
    }
    if (category === 'venture-capital') {
      return jsonData.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header, index) => {
          let value = row[index];
          if (value === undefined || value === null) value = '';
          if (["stageFocus", "sectorFocus"].includes(header)) {
            value = typeof value === 'string' ? value.split('&').map(v => v.trim()).filter(Boolean) : [];
          } else if (["fundSize", "avgTicketSize"].includes(header)) {
            value = Number(value) || 0;
          } else {
            value = String(value).trim();
          }
          item[header] = value;
        });
        if (item.name && item.headOffice && item.fundSize && item.avgTicketSize && item.contact) return item;
        return null;
      }).filter(Boolean);
    }
    if (category === 'micro-vcs') {
      return jsonData.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header, index) => {
          let value = row[index];
          if (value === undefined || value === null) value = '';
          if (["stage", "sector"].includes(header)) {
            value = typeof value === 'string' ? value.split('&').map(v => v.trim()).filter(Boolean) : [];
          } else if (["fundSize", "checkSize"].includes(header)) {
            value = Number(value) || 0;
          } else {
            value = String(value).trim();
          }
          item[header] = value;
        });
        if (item.name && item.location && item.fundSize && item.checkSize && item.contact) return item;
        return null;
      }).filter(Boolean);
    }
    if (category === 'incubators') {
      return jsonData.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header, index) => {
          let value = row[index];
          if (value === undefined || value === null) value = '';
          value = String(value).trim();
          item[header] = value;
        });
        if (item.name && item.location && item.fundingSupport && item.eligibility && item.contact) return item;
        return null;
      }).filter(Boolean);
    }
    if (category === 'accelerators') {
      return jsonData.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header, index) => {
          let value = row[index];
          if (value === undefined || value === null) value = '';
          if (["stage", "sectors"].includes(header)) {
            value = typeof value === 'string' ? value.split('&').map(v => v.trim()).filter(Boolean) : [];
          } else {
            value = String(value).trim();
          }
          item[header] = value;
        });
        if (item.name && item.hq && item.batchFrequency && item.fundingOffered && item.programDuration) return item;
        return null;
      }).filter(Boolean);
    }
    if (category === 'govt-grants') {
      return jsonData.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header, index) => {
          let value = row[index];
          if (value === undefined || value === null) value = '';
          if (["stage", "documentsRequired"].includes(header)) {
            value = typeof value === 'string' ? value.split('&').map(v => v.trim()).filter(Boolean) : [];
          } else if (header === 'grantSize') {
            value = Number(value) || 0;
          } else {
            value = String(value).trim();
          }
          item[header] = value;
        });
        if (item.name && item.authority && item.grantSize && item.eligibility && item.howToApply && item.timelines && item.contact) return item;
        return null;
      }).filter(Boolean);
    }
    if (category === 'investor-matches') {
      return jsonData.slice(1).map((row: any[]) => {
        const item: any = {};
        headers.forEach((header, index) => {
          let value = row[index];
          if (value === undefined || value === null) value = '';
          value = String(value).trim();
          if (header === 'stage' || header === 'traction') {
            value = value.includes('&') ? value.split('&')[0].trim() : value;
          }
          item[header] = value;
        });
        if (item.name && item.stage && item.industry && item.traction && item.description && item.checkSize && item.location) return item;
        return null;
      }).filter(Boolean);
    }

    // fallback (should never hit)
    return [];
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const processedData = processExcelData(jsonData);
          
          if (processedData.length === 0) {
            setError('No valid data found in the Excel file');
            setUploading(false);
            return;
          }

          // Upload data to backend
          let successCount = 0;
          let errorCount = 0;

          for (const item of processedData) {
            try {
              const response = await fetch(`${API_URL}/funding/admin/${category}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(item),
              });

              if (response.ok) {
                successCount++;
              } else {
                errorCount++;
                console.error('Failed to upload item:', item.name);
              }
            } catch (err) {
              errorCount++;
              console.error('Error uploading item:', item.name, err);
            }
          }

          if (successCount > 0) {
            setSuccess(`Successfully uploaded ${successCount} records${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
            onUploadSuccess();
            setTimeout(() => {
              onClose();
            }, 2000);
          } else {
            setError('Failed to upload any records');
          }
        } catch (err) {
          setError('Error processing Excel file');
          console.error(err);
        } finally {
          setUploading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Error reading file');
      setUploading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm(`Are you sure you want to delete ALL ${getCategoryLabel(category)} records? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    setError('');
    setSuccess('');

    try {
      // First get all items
      const response = await fetch(`${API_URL}/funding/admin/${category}?limit=1000`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }

      const data = await response.json();
      
      if (!data.success || !data.data || data.data.length === 0) {
        setError('No records found to delete');
        setDeleting(false);
        return;
      }

      // Delete all items
      let deletedCount = 0;
      let errorCount = 0;

      for (const item of data.data) {
        try {
          const deleteResponse = await fetch(`${API_URL}/funding/admin/${category}/${item._id}`, {
            method: 'DELETE',
            credentials: 'include'
          });

          if (deleteResponse.ok) {
            deletedCount++;
          } else {
            errorCount++;
          }
        } catch (err) {
          errorCount++;
          console.error('Error deleting item:', item._id, err);
        }
      }

      if (deletedCount > 0) {
        setSuccess(`Successfully deleted ${deletedCount} records${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
        onUploadSuccess();
      } else {
        setError('Failed to delete any records');
      }
    } catch (err) {
      setError('Error deleting records');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // Use a safe label fallback everywhere categoryLabels[category] is used
  const getCategoryLabel = (cat: string) => categoryLabels[cat] || cat || 'Data';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Excel Upload - {getCategoryLabel(category)}
              </h2>
              <p className="text-gray-600">
                Upload Excel file to bulk import {getCategoryLabel(category).toLowerCase()} data
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• First row will be ignored (use for column headers)</li>
              <li>• Data will be read from second row onwards</li>
              <li>• Use comma (,) to separate multiple values (e.g., "Fintech,SaaS,AI/ML")</li>
              <li>• Empty rows will be skipped automatically</li>
              <li>• Download template below to see the exact format required</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Template
            </button>
            
            <button
              onClick={handleDeleteAll}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {deleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete All Records
            </button>
          </div>

          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
            <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="mb-4">
              <label className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-700 font-medium">
                  Choose Excel file
                </span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <p className="text-gray-500 text-sm mt-2">
                Supports .xlsx and .xls files
              </p>
            </div>
            {file && (
              <p className="text-green-600 font-medium">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Preview (First 5 rows):</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 rounded-lg">
                  <tbody>
                    {preview.map((row, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        {row.map((cell: any, cellIndex: number) => (
                          <td key={cellIndex} className="px-3 py-2 border-r border-gray-200 text-sm">
                            {cell || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-4">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Upload Button */}
          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Excel File
                </>
              )}
            </button>
            
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelUploadModal;
