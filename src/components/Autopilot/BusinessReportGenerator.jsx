import React from 'react';

/**
 * BusinessReportGenerator
 * Generates a dynamic HTML business report from Supabase data
 */
const BusinessReportGenerator = ({ reportData }) => {
  if (!reportData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-white text-lg">Loading report data...</p>
      </div>
    );
  }

  const { owner, properties, metrics, bookings, payments, leads } = reportData;

  // Format currency based on property currency
  const formatCurrency = (amount) => {
    const currency = properties[0]?.currency || 'USD';
    if (currency === 'IDR') {
      return `IDR ${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${amount.toLocaleString()}`;
  };

  // Get current date
  const reportDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-white" style={{ width: '100%', minHeight: '100%' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .report-container {
          font-family: 'Inter', sans-serif;
          color: #2d3748;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .report-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #f97316;
        }

        .report-title {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .report-subtitle {
          font-size: 16px;
          color: #718096;
          font-weight: 500;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-box {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          color: white;
        }

        .metric-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.9;
          margin-bottom: 8px;
        }

        .metric-value {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
        }

        .metric-subtitle {
          font-size: 13px;
          opacity: 0.85;
          margin-top: 4px;
        }

        .section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }

        .data-table th {
          background: #f7fafc;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 13px;
          color: #4a5568;
          border-bottom: 2px solid #e2e8f0;
        }

        .data-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 14px;
          color: #2d3748;
        }

        .data-table tr:hover {
          background: #f7fafc;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-confirmed {
          background: #c6f6d5;
          color: #22543d;
        }

        .status-pending {
          background: #fef3c7;
          color: #78350f;
        }

        .status-completed {
          background: #c6f6d5;
          color: #22543d;
        }

        @media print {
          .report-container {
            padding: 20px;
          }
        }
      `}</style>

      <div className="report-container">
        {/* Header */}
        <div className="report-header">
          <div className="report-title">
            {properties.length > 0 ? properties[0].name : 'Business Report'}
          </div>
          <div className="report-subtitle">
            Owner: {owner.full_name} | {reportDate}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-box">
            <div className="metric-label">Total Bookings</div>
            <div className="metric-value">{metrics.totalBookings}</div>
          </div>
          <div className="metric-box" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="metric-label">Total Revenue</div>
            <div className="metric-value">{formatCurrency(metrics.totalRevenue)}</div>
          </div>
          <div className="metric-box" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <div className="metric-label">Occupancy Rate</div>
            <div className="metric-value">{metrics.occupancyRate}%</div>
            <div className="metric-subtitle">{metrics.totalNights} total nights</div>
          </div>
          <div className="metric-box" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <div className="metric-label">Avg Nightly Rate</div>
            <div className="metric-value">{formatCurrency(metrics.avgNightlyRate)}</div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="section">
          <div className="section-title">Properties ({properties.length})</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Property Name</th>
                <th>Location</th>
                <th>Type</th>
                <th>Max Guests</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property.id}>
                  <td><strong>{property.name}</strong></td>
                  <td>{property.location || 'N/A'}</td>
                  <td>{property.property_type || 'Villa'}</td>
                  <td>{property.max_guests || 'N/A'}</td>
                  <td>
                    <span className="status-badge status-confirmed">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Bookings Section */}
        <div className="section">
          <div className="section-title">Recent Bookings (Last {Math.min(bookings.length, 10)})</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Guests</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 10).map((booking) => {
                const checkIn = new Date(booking.check_in).toLocaleDateString();
                const checkOut = new Date(booking.check_out).toLocaleDateString();
                return (
                  <tr key={booking.id}>
                    <td><strong>{booking.guest_name || 'N/A'}</strong></td>
                    <td>{checkIn}</td>
                    <td>{checkOut}</td>
                    <td>{booking.num_guests || 0}</td>
                    <td>{formatCurrency(booking.total_price || 0)}</td>
                    <td>
                      <span className={`status-badge status-${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Payments Section */}
        <div className="section">
          <div className="section-title">Payment Summary</div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Completed</strong></td>
                <td>{payments.filter(p => p.status === 'completed').length}</td>
                <td>{formatCurrency(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}</td>
              </tr>
              <tr>
                <td><strong>Pending</strong></td>
                <td>{payments.filter(p => p.status === 'pending').length}</td>
                <td>{formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Leads Section */}
        {leads.length > 0 && (
          <div className="section">
            <div className="section-title">Active Leads ({leads.length})</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 10).map((lead) => (
                  <tr key={lead.id}>
                    <td><strong>{lead.full_name || 'N/A'}</strong></td>
                    <td>{lead.email || 'N/A'}</td>
                    <td>{lead.source || 'N/A'}</td>
                    <td>
                      <span className={`status-badge status-${lead.status}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td>{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e2e8f0', textAlign: 'center', color: '#718096', fontSize: '13px' }}>
          <p>Generated by MYHOST BizMate - Business Intelligence Platform</p>
          <p style={{ marginTop: '4px' }}>Report generated on {reportDate}</p>
        </div>
      </div>
    </div>
  );
};

export default BusinessReportGenerator;
