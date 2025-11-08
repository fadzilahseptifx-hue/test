import React, { useEffect, useState } from 'react';
import { extractQRISFromImage } from '../utils/qrExtractor';

interface QRISLoaderProps {
  onQRISLoaded?: (qrisString: string) => void;
}

export const QRISLoader: React.FC<QRISLoaderProps> = ({ onQRISLoaded }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQRIS = async () => {
      try {
        const imageUrl =
          'https://kyckajnmgzzdjqnwbpgu.supabase.co/storage/v1/object/public/galeri/WhatsApp%20Image%202025-10-03%20at%2011.17.44.jpeg';

        const result = await extractQRISFromImage(imageUrl);

        if (result.success && result.qrisString) {
          localStorage.setItem('QRIS_STRING', result.qrisString);
          if (onQRISLoaded) {
            onQRISLoaded(result.qrisString);
          }
        } else {
          setError(result.error || 'Failed to extract QRIS');
          // Use fallback QRIS if extraction fails
          const fallbackQRIS =
            '00020101021226670016COM.NOBUBANK.WWW01189360050300000898530214994000009284900303UMI51440014ID.CO.QRIS.WWW0215ID10220667076460303UMI5204839953033605802ID5920Toko Elektronik Jaya6015JAKARTA SELATAN61051234062070703A016304CCDA';
          localStorage.setItem('QRIS_STRING', fallbackQRIS);
          if (onQRISLoaded) {
            onQRISLoaded(fallbackQRIS);
          }
        }
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMsg);
        // Use fallback QRIS
        const fallbackQRIS =
          '00020101021226670016COM.NOBUBANK.WWW01189360050300000898530214994000009284900303UMI51440014ID.CO.QRIS.WWW0215ID10220667076460303UMI5204839953033605802ID5920Toko Elektronik Jaya6015JAKARTA SELATAN61051234062070703A016304CCDA';
        localStorage.setItem('QRIS_STRING', fallbackQRIS);
        if (onQRISLoaded) {
          onQRISLoaded(fallbackQRIS);
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if QRIS already in localStorage
    const cachedQRIS = localStorage.getItem('QRIS_STRING');
    if (cachedQRIS) {
      setLoading(false);
      if (onQRISLoaded) {
        onQRISLoaded(cachedQRIS);
      }
    } else {
      loadQRIS();
    }
  }, [onQRISLoaded]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-zinc-600">Loading QRIS configuration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-xs z-[9999]">
        <p className="text-sm text-yellow-800">
          <strong>Info:</strong> {error}. Using fallback QRIS.
        </p>
      </div>
    );
  }

  return null;
};
