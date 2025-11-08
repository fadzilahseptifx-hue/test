import jsQR from 'jsqr';

export interface QRExtractionResult {
  success: boolean;
  qrisString?: string;
  error?: string;
}

export const extractQRISFromImage = async (
  imageUrl: string
): Promise<QRExtractionResult> => {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          resolve({
            success: false,
            error: 'Could not get canvas context',
          });
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        const imageData = context.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, img.width, img.height);

        if (code) {
          resolve({
            success: true,
            qrisString: code.data,
          });
        } else {
          resolve({
            success: false,
            error: 'No QR code found in image',
          });
        }
      };

      img.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to load image',
        });
      };

      img.src = imageUrl;
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const extractQRISFromFile = async (
  file: File
): Promise<QRExtractionResult> => {
  try {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          if (!context) {
            resolve({
              success: false,
              error: 'Could not get canvas context',
            });
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);

          const imageData = context.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, img.width, img.height);

          if (code) {
            resolve({
              success: true,
              qrisString: code.data,
            });
          } else {
            resolve({
              success: false,
              error: 'No QR code found in image',
            });
          }
        };

        img.onerror = () => {
          resolve({
            success: false,
            error: 'Failed to load image',
          });
        };

        img.src = e.target?.result as string;
      };

      reader.onerror = () => {
        resolve({
          success: false,
          error: 'Failed to read file',
        });
      };

      reader.readAsDataURL(file);
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
