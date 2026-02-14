import React from 'react';

/**
 * BusinessReportGenerator
 * Generates a dynamic HTML business report from Supabase data
 */
const BusinessReportGenerator = ({ reportData }) => {
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div style={{ width: '100%', minHeight: '100%', background: 'white' }}>
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

        /* Metrics Grid - Desktop First */
        #metrics-grid-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-box-responsive {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          color: white;
        }

        .metric-label-responsive {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.9;
          margin-bottom: 8px;
        }

        .metric-value-responsive {
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
        }

        .metric-subtitle-responsive {
          font-size: 13px;
          opacity: 0.85;
          margin-top: 4px;
        }

        /* Mobile Overrides */
        @media (max-width: 767px) {
          #metrics-grid-container {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          .metric-box-responsive {
            padding: 10px !important;
          }

          .metric-label-responsive {
            font-size: 10px !important;
            margin-bottom: 6px !important;
          }

          .metric-value-responsive {
            font-size: 20px !important;
          }

          .metric-subtitle-responsive {
            font-size: 9px !important;
            margin-top: 2px !important;
          }

          .report-container {
            padding: 16px !important;
          }

          .report-title {
            font-size: 18px !important;
          }

          .report-subtitle {
            font-size: 12px !important;
          }
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

      <div className="report-container" style={isMobile ? { padding: '16px' } : {}}>
        {/* Header */}
        <div className="report-header">
          <div className="report-title" style={isMobile ? { fontSize: '18px' } : {}}>
            {properties.length > 0 ? properties[0].name : 'Business Report'}
          </div>
          <div className="report-subtitle" style={isMobile ? { fontSize: '12px' } : {}}>
            Owner: {owner.full_name} | {reportDate}
          </div>
        </div>

        {/* Key Metrics */}
        <div id="metrics-grid-container">
          <div id="metrics-box-1" className="metric-box-responsive">
            <div className="metric-label-responsive">Total Bookings</div>
            <div className="metric-value-responsive">{metrics.totalBookings}</div>
          </div>
          <div id="metrics-box-2" className="metric-box-responsive" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            <div className="metric-label-responsive">Total Revenue</div>
            <div className="metric-value-responsive">{formatCurrency(metrics.totalRevenue)}</div>
          </div>
          <div id="metrics-box-3" className="metric-box-responsive" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            <div className="metric-label-responsive">Occupancy Rate</div>
            <div className="metric-value-responsive">{metrics.occupancyRate}%</div>
            <div className="metric-subtitle-responsive">{metrics.totalNights} total nights</div>
          </div>
          <div id="metrics-box-4" className="metric-box-responsive" style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
            <div className="metric-label-responsive">Avg Nightly Rate</div>
            <div className="metric-value-responsive">{formatCurrency(metrics.avgNightlyRate)}</div>
          </div>
        </div>

        {/* Properties Section */}
        <div className="section">
          <div className="section-title">Properties ({properties.length})</div>

          {/* MOBILE VERSION: Cards (< 768px) */}
          <div className="block md:hidden space-y-3">
            {properties.map((property) => (
              <div key={property.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm">
                <h4 className="font-bold text-lg mb-2">{property.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Location:</span>
                    <span className="ml-1 font-medium">{property.location || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Type:</span>
                    <span className="ml-1 font-medium">{property.property_type || 'Villa'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Max Guests:</span>
                    <span className="ml-1 font-medium">{property.max_guests || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="status-badge status-confirmed">Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VERSION: Table (>= 768px) */}
          <table className="hidden md:table data-table">
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

          {/* MOBILE VERSION: Cards (< 768px) */}
          <div className="block md:hidden space-y-3">
            {bookings.slice(0, 10).map((booking) => {
              const checkIn = new Date(booking.check_in).toLocaleDateString();
              const checkOut = new Date(booking.check_out).toLocaleDateString();
              return (
                <div key={booking.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg">{booking.guest_name || 'N/A'}</h4>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Check-in:</span>
                      <span className="ml-1 font-medium">{checkIn}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Check-out:</span>
                      <span className="ml-1 font-medium">{checkOut}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Guests:</span>
                      <span className="ml-1 font-medium">{booking.num_guests || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Total:</span>
                      <span className="ml-1 font-bold text-green-600">{formatCurrency(booking.total_price || 0)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP VERSION: Table (>= 768px) */}
          <table className="hidden md:table data-table">
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

          {/* MOBILE VERSION: Cards (< 768px) */}
          <div className="block md:hidden space-y-3">
            <div className="bg-white rounded-lg p-4 border-2 border-green-200 shadow-sm">
              <h4 className="font-bold text-lg mb-2">Completed</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 text-sm">Count:</span>
                  <span className="ml-1 font-bold text-lg">{payments.filter(p => p.status === 'completed').length}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Amount:</span>
                  <span className="ml-1 font-bold text-lg text-green-600">{formatCurrency(payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0))}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border-2 border-yellow-200 shadow-sm">
              <h4 className="font-bold text-lg mb-2">Pending</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 text-sm">Count:</span>
                  <span className="ml-1 font-bold text-lg">{payments.filter(p => p.status === 'pending').length}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-sm">Amount:</span>
                  <span className="ml-1 font-bold text-lg text-yellow-600">{formatCurrency(payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* DESKTOP VERSION: Table (>= 768px) */}
          <table className="hidden md:table data-table">
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

            {/* MOBILE VERSION: Cards (< 768px) */}
            <div className="block md:hidden space-y-3">
              {leads.slice(0, 10).map((lead) => (
                <div key={lead.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg">{lead.full_name || 'N/A'}</h4>
                    <span className={`status-badge status-${lead.status}`}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <span className="ml-1 font-medium">{lead.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Source:</span>
                      <span className="ml-1 font-medium">{lead.source || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>
                      <span className="ml-1 font-medium">{new Date(lead.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VERSION: Table (>= 768px) */}
            <table className="hidden md:table data-table">
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
