const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const connectDB = require('../lib/mongodb');
const Report = require('../models/Report');
const { authMiddleware } = require('../lib/auth');
const { analyzeImageFast } = require('../lib/openrouter');
const { extractTextFromImage, cleanMedicalText, validateMedicalText } = require('../lib/ocr');

router.post('/', authMiddleware, async (req, res) => {
  console.log('🚀 === ANALYZE API CALLED ===');
  
  try {
    // Step 1: Check authentication (already done by middleware)
    console.log('Step 1: User authenticated:', req.user.name);

    // Step 2: Parse request body
    console.log('Step 2: Parsing request body...');
    const { imageUrl, title } = req.body;
    console.log('Request data:', { imageUrl: imageUrl?.substring(0, 50) + '...', title });

    if (!imageUrl || !title) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Image URL and title are required'
      });
    }

    // Step 3: Connect to database
    console.log('Step 3: Connecting to database...');
    await connectDB();
    console.log('✅ Database connected successfully');

    // Step 4: Read image file
    console.log('Step 4: Reading image file...');
    const imagePath = path.join(__dirname, '..', 'uploads', req.user.userId, path.basename(imageUrl));
    console.log('Image path:', imagePath);
    
    let imageBuffer;
    try {
      imageBuffer = await fs.readFile(imagePath);
      console.log('✅ Image file read successfully, size:', imageBuffer.length, 'bytes');
    } catch (error) {
      console.log('❌ Image file read failed:', error.message);
      return res.status(404).json({
        success: false,
        error: 'Image file not found'
      });
    }

    // Step 5: OCR Text Extraction
    console.log('Step 5: Starting OCR text extraction...');
    const ocrResult = await extractTextFromImage(imageBuffer);
    console.log('OCR Result:', {
      success: ocrResult.success,
      confidence: ocrResult.confidence,
      textLength: ocrResult.text.length
    });

    let extractedText = '';
    if (ocrResult.success && ocrResult.text) {
      extractedText = cleanMedicalText(ocrResult.text);
      console.log('Cleaned text length:', extractedText.length);
      
      if (validateMedicalText(extractedText)) {
        console.log('✅ Text appears to be medical content');
      } else {
        console.log('⚠️ Text may not be medical content');
      }
    }

    // Step 6: AI Analysis
    console.log('Step 6: Starting AI analysis...');
    console.log('🚀 Converting image to base64...');
    const base64Image = imageBuffer.toString('base64');
    console.log('✅ Base64 conversion complete, length:', base64Image.length);
    
    console.log('🤖 Calling OpenRouter GPT-4o-mini for analysis...');
    const analysisResult = await analyzeImageFast(base64Image);
    console.log('✅ OpenRouter analysis complete, result length:', analysisResult.length);
    
    // Step 7: Parse AI response
    console.log('Step 7: Parsing AI response...');
    let parsedAnalysis;
    try {
      console.log('Attempting to extract JSON from AI response...');
      const jsonMatch = analysisResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('✅ JSON found in response');
        parsedAnalysis = JSON.parse(jsonMatch[0]);
        console.log('✅ JSON parsed successfully');
      } else {
        console.log('⚠️ No JSON found, using fallback structure');
        parsedAnalysis = {
          summary: analysisResult,
          reportType: 'Medical Report',
          keyFindings: ['Analysis provided as text'],
          recommendations: ['Consult with healthcare professional'],
          medicinesSuggested: [],
          severity: 'medium'
        };
      }
    } catch (parseError) {
      console.log('❌ JSON parsing failed:', parseError.message);
      parsedAnalysis = {
        summary: analysisResult,
        reportType: 'Medical Report',
        keyFindings: ['Analysis provided as text'],
        recommendations: ['Consult with healthcare professional'],
        medicinesSuggested: [],
        severity: 'medium'
      };
    }

    // Step 8: Save to database
    console.log('Step 8: Saving report to database...');
    const report = new Report({
      userId: req.user.userId,
      title: title.trim(),
      imageUrl,
      analysis: parsedAnalysis
    });

    console.log('Attempting to save report...');
    await report.save();
    console.log('✅ Report saved successfully with ID:', report._id);

    console.log('🎉 === ANALYSIS COMPLETE ===');
    res.json({
      success: true,
      data: {
        reportId: report._id,
        analysis: parsedAnalysis
      }
    });

  } catch (error) {
    console.error('💥 === ANALYSIS ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      error: 'Failed to analyze image. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;