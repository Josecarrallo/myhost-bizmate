import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * SURYA AI Insights Card
 * Calls n8n webhook lumina/lectura-v1 and displays business analysis
 *
 * Props:
 *   - propertyId: string (required) - The property to analyze
 *   - from: string (required) - Start date YYYY-MM-DD
 *   - to: string (required) - End date YYYY-MM-DD
 */
const SuryaInsights = ({ propertyId, from, to }) => {
  const [suryaData, setSuryaData] = useState(null);
  const [suryaLoading, setSuryaLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSurya = async () => {
      // Require all props
      if (!propertyId || !from || !to) {
        setSuryaData(null);
        return;
      }

      setSuryaLoading(true);
      setSuryaData(null);
      setError(false);

      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session?.access_token) {
          console.error('[SURYA] No session');
          setError(true);
          setSuryaLoading(false);
          return;
        }

        const response = await fetch('https://n8n-production-bb2d.up.railway.app/webhook/lumina/lectura-v1', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session.access_token}`
          },
          body: JSON.stringify({
            property_id: propertyId,
            from,
            to
          })
        });

        if (!response.ok) {
          console.error('[SURYA] HTTP error:', response.status);
          setError(true);
          setSuryaLoading(false);
          return;
        }

        const data = await response.json();
        if (data.ok || data.market) {
          setSuryaData(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('[SURYA] Error:', err);
        setError(true);
      } finally {
        setSuryaLoading(false);
      }
    };

    fetchSurya();
  }, [propertyId, from, to]);

  // Hide on error
  if (error && !suryaLoading) {
    return null;
  }

  // Hide if no data and not loading
  if (!suryaLoading && !suryaData) {
    return null;
  }

  return (
    <div className="bg-[#2a2f3a] rounded-xl p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">☀️</span>
        <h3 className="text-white font-bold">SURYA · AI Insights</h3>
        {suryaData?.period && suryaData?.previous && (
          <span className="text-gray-500 text-sm ml-2">
            {suryaData.period} vs {suryaData.previous}
          </span>
        )}
      </div>

      {suryaLoading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Generating AI insights...</span>
        </div>
      ) : suryaData && (
        <>
          {suryaData.ok && suryaData.text && (
            <p className="text-gray-300 mb-4 whitespace-pre-line">{suryaData.text}</p>
          )}

          {suryaData.market && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span>🌍</span>
                <span className="text-white font-medium">Market</span>
                {suryaData.market.date && (
                  <span className="text-gray-500 text-sm">{suryaData.market.date}</span>
                )}
              </div>
              <p className="text-gray-300 mb-3 whitespace-pre-line">{suryaData.market.text}</p>
              {suryaData.market.sources && suryaData.market.sources.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-500">Sources: </span>
                  {suryaData.market.sources.map((source, idx) => (
                    <span key={idx}>
                      {idx > 0 && <span className="text-gray-600"> · </span>}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline"
                      >
                        {source.title}
                      </a>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <p className="text-gray-500 text-xs mt-4 italic">
            SURYA, your AI business analyst: reads your sales data and recent market news. Figures come from this report.
          </p>
        </>
      )}
    </div>
  );
};

export default SuryaInsights;
