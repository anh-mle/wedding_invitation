import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';

export default function CertificateGenerator() {
  const [name, setName] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const canvasRef = useRef(null);
  const previewCanvasRef = useRef(null);

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
    img.src = '/thiep.png';
  }, []);

  const drawCertificate = (canvas, userName) => {
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the certificate template
      ctx.drawImage(img, 0, 0);

      // Calculate position
      const fontSize = 50
      const x = 100;
      const y = img.height * 0.417;

      // Configure text style
      ctx.font = `italic ${fontSize}px Pinyon Script`;
      ctx.fillStyle = '#c5918a';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Draw the name
      ctx.fillText(userName, x, y);
    };
    
    img.src = '/thiep.png';
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    
    // First show the preview screen, then draw
    setShowPreview(true);
  };

  // Draw certificate when preview is shown
  useEffect(() => {
    console.log('useEffect triggered:', { showPreview, canvas: previewCanvasRef.current, name });
    if (showPreview && previewCanvasRef.current && name.trim()) {
      console.log('Calling drawCertificate...');
      drawCertificate(previewCanvasRef.current, name.trim());
    } else {
      console.log('Conditions not met:', {
        showPreview,
        hasCanvas: !!previewCanvasRef.current,
        hasName: !!name.trim()
      });
    }
  }, [showPreview, name]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    drawCertificate(canvas, name.trim());

    // Wait for image to be drawn, then download
    setTimeout(() => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `thiep_${name.replace(/\s+/g, '_')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    }, 500);
  };

  const handleReset = () => {
    setName('');
    setShowPreview(false);
  };

  // Loading State
  if (!imageLoaded && !imageError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (imageError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <FileText className="w-16 h-16 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Error Loading</h2>
          </div>
          <p className="text-gray-700 text-center mb-4">Could not load template image.</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
            <p className="font-semibold text-yellow-800 mb-2">Setup Instructions:</p>
            <ol className="list-decimal list-inside text-yellow-700 space-y-1">
              <li>Place your PNG file in the <code className="bg-yellow-100 px-1 rounded">public/</code> folder</li>
              <li>Name it <code className="bg-yellow-100 px-1 rounded">thiep.png</code></li>
              <li>Refresh this page</li>
            </ol>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Name Entry Screen
  if (!showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-5xl flex items-center justify-center mb-6">
            👰🏻‍♀️💍🤵🏻
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Điền Tên Khách Mời
          </h1>
          
          <div className="space-y-4 pt-3">
            <div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Họ và Tên"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && name.trim()) {
                    handleSubmit();
                  }
                }}
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Xem Thiệp Mời
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Preview & Download Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="mb-6 flex justify-center">
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-100 max-w-full">
              <canvas
                ref={previewCanvasRef}
                className="max-w-full h-auto"
              />
            </div>
          </div>

          {/* Hidden canvas for download */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          <div className="flex gap-4 justify-center flex-wrap">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              <Download className="w-5 h-5" />
              Tải Về
            </button>
            
            <button
              onClick={handleReset}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              Thiệp Mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}