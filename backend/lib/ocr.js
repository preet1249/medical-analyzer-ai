const Tesseract = require('tesseract.js');

async function extractTextFromImage(imageBuffer) {
  try {
    console.log('Starting OCR text extraction...');
    
    const { data } = await Tesseract.recognize(imageBuffer, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      }
    });

    const extractedText = data.text.trim();
    const confidence = data.confidence;

    console.log(`OCR completed. Confidence: ${confidence}%`);
    console.log(`Extracted text length: ${extractedText.length} characters`);

    if (extractedText.length < 10) {
      console.log('Warning: Very little text extracted, image might be unclear');
    }

    return {
      text: extractedText,
      confidence: confidence,
      success: true
    };

  } catch (error) {
    console.error('OCR extraction failed:', error);
    return {
      text: '',
      confidence: 0,
      success: false,
      error: error.message
    };
  }
}

function cleanMedicalText(text) {
  return text
    // Remove excessive whitespace
    .replace(/\s+/g, ' ')
    // Remove special characters that might interfere
    .replace(/[^\w\s\-\.\,\:\;\/\(\)\%]/g, ' ')
    // Clean up multiple spaces again
    .replace(/\s+/g, ' ')
    // Trim
    .trim();
}

function validateMedicalText(text) {
  const medicalKeywords = [
    'test', 'result', 'normal', 'abnormal', 'level', 'mg', 'ml', 'mmol',
    'blood', 'urine', 'glucose', 'cholesterol', 'hemoglobin', 'patient',
    'doctor', 'hospital', 'clinic', 'laboratory', 'report', 'date',
    'reference', 'range', 'high', 'low', 'positive', 'negative'
  ];

  const textLower = text.toLowerCase();
  const foundKeywords = medicalKeywords.filter(keyword => 
    textLower.includes(keyword)
  );

  // Consider it medical text if it has at least 2 medical keywords
  return foundKeywords.length >= 2;
}

module.exports = {
  extractTextFromImage,
  cleanMedicalText,
  validateMedicalText
};