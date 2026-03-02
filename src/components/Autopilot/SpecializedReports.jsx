import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  generateMonthlyOccupancyReport,
  generateRevenueByChannelReport,
  generateADRRevPARReport,
  generateCancellationReport,
  generateOwnerStatementReport
} from '../../services/specializedReportsService';
import {
  generateMonthlyOccupancyHTML,
  generateRevenueByChannelHTML,
  generateADRRevPARHTML,
  generateCancellationHTML,
  generateOwnerStatementHTML
} from '../../services/specializedReportsHTML';

const SpecializedReports = () => {
  const { userData } = useAuth();
  const [selectedReportType, setSelectedReportType] = useState('monthly_occupancy');
  const [selectedVilla, setSelectedVilla] = useState('all');
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportHTML, setReportHTML] = useState('');

  const reportTypes = [
    { value: 'monthly_occupancy', label: 'Monthly Occupancy Report' },
    { value: 'revenue_by_channel', label: 'Revenue by Channel' },
    { value: 'adr_revpar', label: 'ADR & RevPAR Summary' },
    { value: 'cancellation', label: 'Cancellation Report' },
    { value: 'owner_statement', label: 'Monthly Owner Statement' }
  ];

  // Hardcoded villas for now (will be dynamic later)
  const villas = [
    { value: 'all', label: 'All Properties' },
    { value: 'nismara', label: 'Nismara 2BR Villa' },
    { value: 'uma', label: 'Uma 1BR Villa' },
    { value: 'santai', label: 'Santai 3BR Villa' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      // Owner data (hardcoded for now - matches businessReportService.js)
      const ownerId = userData?.id || '1f32d384-4018-46a9-a6f9-058217e6924a'; // Gita's ID
      const ownerName = 'Gita Pradnyana';
      const propertyName = 'Nismara Uma Villa';
      const currency = 'IDR';

      // Map villa selection to villa_id (hardcoded for now)
      const villaIdMap = {
        'all': null,
        'nismara': 'b1000001-0001-4001-8001-000000000001',
        'uma': 'b2000002-0002-4002-8002-000000000002',
        'santai': 'b3000003-0003-4003-8003-000000000003'
      };
      const villaId = villaIdMap[selectedVilla];

      let reportData;
      let htmlContent;

      // Generate report based on type
      switch (selectedReportType) {
        case 'monthly_occupancy':
          reportData = await generateMonthlyOccupancyReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId);
          if (reportData) {
            htmlContent = generateMonthlyOccupancyHTML(reportData, ownerName, propertyName, currency);
          }
          break;

        case 'revenue_by_channel':
          reportData = await generateRevenueByChannelReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId);
          if (reportData) {
            htmlContent = generateRevenueByChannelHTML(reportData, ownerName, propertyName, currency);
          }
          break;

        case 'adr_revpar':
          reportData = await generateADRRevPARReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId);
          if (reportData) {
            htmlContent = generateADRRevPARHTML(reportData, ownerName, propertyName, currency);
          }
          break;

        case 'cancellation':
          reportData = await generateCancellationReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId);
          if (reportData) {
            htmlContent = generateCancellationHTML(reportData, ownerName, propertyName, currency);
          }
          break;

        case 'owner_statement':
          reportData = await generateOwnerStatementReport(ownerId, ownerName, propertyName, currency, startDate, endDate, villaId);
          if (reportData) {
            htmlContent = generateOwnerStatementHTML(reportData, ownerName, propertyName, currency);
          }
          break;

        default:
          alert('Unknown report type');
          setIsGenerating(false);
          return;
      }

      if (htmlContent) {
        setReportHTML(htmlContent);
      } else {
        alert('Error generating report. No data found.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#1f2937]/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-[#d85a2a]/20">

        {/* Report Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Report Type
          </label>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="w-full px-4 py-3 bg-[#374151] text-white rounded-xl border-2 border-[#FF8C42]/30 focus:border-[#FF8C42] focus:outline-none transition-all"
          >
            {reportTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Villa Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Property
          </label>
          <select
            value={selectedVilla}
            onChange={(e) => setSelectedVilla(e.target.value)}
            className="w-full px-4 py-3 bg-[#374151] text-white rounded-xl border-2 border-[#FF8C42]/30 focus:border-[#FF8C42] focus:outline-none transition-all"
          >
            {villas.map(villa => (
              <option key={villa.value} value={villa.value}>
                {villa.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Range */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-3 bg-[#374151] text-white rounded-xl border-2 border-[#FF8C42]/30 focus:border-[#FF8C42] focus:outline-none transition-all"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-3 bg-[#374151] text-white rounded-xl border-2 border-[#FF8C42]/30 focus:border-[#FF8C42] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Generate & Print Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`flex-1 px-6 py-4 text-lg font-bold text-white rounded-xl transition-all transform ${
              isGenerating
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-br from-[#FF8C42] to-[#d85a2a] hover:from-[#f5a524] hover:to-[#FF8C42] hover:scale-105 shadow-lg'
            }`}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>

          {reportHTML && (
            <button
              onClick={() => {
                const iframe = document.getElementById('specialized-report-frame');
                if (iframe) {
                  iframe.contentWindow.print();
                }
              }}
              className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Print
            </button>
          )}
        </div>

        {/* Info Box */}
        {!reportHTML && (
          <div className="mt-8 p-6 bg-[#374151]/50 rounded-2xl border-2 border-[#FF8C42]/20">
            <h4 className="text-xl font-bold text-[#FF8C42] mb-4">About Specialized Reports</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start">
                <span className="text-[#FF8C42] mr-2">•</span>
                <span><strong className="text-white">Monthly Occupancy:</strong> Per property and per channel occupancy rates</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF8C42] mr-2">•</span>
                <span><strong className="text-white">Revenue by Channel:</strong> Breakdown by Airbnb, Booking.com, direct bookings</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF8C42] mr-2">•</span>
                <span><strong className="text-white">ADR & RevPAR:</strong> Average Daily Rate and Revenue Per Available Room</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF8C42] mr-2">•</span>
                <span><strong className="text-white">Cancellation Report:</strong> Count and lost revenue from cancellations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#FF8C42] mr-2">•</span>
                <span><strong className="text-white">Owner Statement:</strong> Gross revenue, fees, and net payout</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Report Display */}
      {reportHTML && (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden" style={{ height: '800px' }}>
          <iframe
            id="specialized-report-frame"
            srcDoc={reportHTML}
            className="w-full h-full border-0"
            title="Specialized Report"
          />
        </div>
      )}
    </div>
  );
};

export default SpecializedReports;
