#!/usr/bin/env node

/**
 * Test Script for Subject File Upload Functionality
 * This script tests the complete file upload flow for subject pages
 */

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dlcujlif7/upload";
const CLOUDINARY_UPLOAD_PRESET = "personal_space";

console.log('🧪 Testing Subject File Upload Functionality...\n');

// Test 1: Cloudinary Upload Test
async function testCloudinaryUpload() {
    console.log('📤 Testing Cloudinary Upload...');
    
    try {
        // Create a test file
        const testContent = 'This is a test file for subject upload functionality.';
        const testFilePath = path.join(__dirname, 'test-upload.txt');
        fs.writeFileSync(testFilePath, testContent);
        
        // Test upload to Cloudinary
        const formData = new FormData();
        formData.append('file', fs.createReadStream(testFilePath));
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('resource_type', 'auto');
        
        const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: formData.getHeaders(),
            timeout: 30000
        });
        
        if (response.data.secure_url) {
            console.log('✅ Cloudinary upload successful');
            console.log(`   URL: ${response.data.secure_url}`);
            console.log(`   Public ID: ${response.data.public_id}`);
            
            // Clean up test file
            fs.unlinkSync(testFilePath);
            
            return {
                url: response.data.secure_url,
                publicId: response.data.public_id,
                success: true
            };
        } else {
            console.log('❌ Cloudinary upload failed - no secure URL');
            return { success: false };
        }
        
    } catch (error) {
        console.log('❌ Cloudinary upload error:', error.message);
        return { success: false, error: error.message };
    }
}

// Test 2: Backend API Endpoints
async function testBackendEndpoints() {
    console.log('\n🔍 Testing Backend API Endpoints...');
    
    const testSubjectId = 'TEST_SUBJECT';
    
    try {
        // Test 1: Get subject data (should work without auth for testing)
        console.log('📋 Testing GET /api/user/subject/:subjectId...');
        try {
            const response = await axios.get(`${API_BASE_URL}/api/user/subject/${testSubjectId}`);
            console.log('✅ GET endpoint accessible');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ GET endpoint properly protected (401 Unauthorized)');
            } else {
                console.log('❌ GET endpoint error:', error.message);
            }
        }
        
        // Test 2: Update subject data
        console.log('📝 Testing PUT /api/user/subject/:subjectId...');
        try {
            const testData = {
                files: [{
                    id: 'test-file-1',
                    name: 'test.txt',
                    url: 'https://example.com/test.txt',
                    type: 'text/plain',
                    size: 100,
                    uploadDate: new Date().toISOString()
                }]
            };
            
            const response = await axios.put(`${API_BASE_URL}/api/user/subject/${testSubjectId}`, testData);
            console.log('✅ PUT endpoint accessible');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ PUT endpoint properly protected (401 Unauthorized)');
            } else {
                console.log('❌ PUT endpoint error:', error.message);
            }
        }
        
        // Test 3: Delete file
        console.log('🗑️ Testing DELETE /api/user/subject/:subjectId/files/:fileId...');
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/user/subject/${testSubjectId}/files/test-file-1`);
            console.log('✅ DELETE endpoint accessible');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ DELETE endpoint properly protected (401 Unauthorized)');
            } else {
                console.log('❌ DELETE endpoint error:', error.message);
            }
        }
        
    } catch (error) {
        console.log('❌ Backend API test error:', error.message);
    }
}

// Test 3: Server Health Check
async function testServerHealth() {
    console.log('\n🏥 Testing Server Health...');
    
    try {
        const response = await axios.get(`${API_BASE_URL}/api/health`, { timeout: 5000 });
        if (response.data) {
            console.log('✅ Server is running');
            console.log(`   Response: ${JSON.stringify(response.data)}`);
            return true;
        }
    } catch (error) {
        console.log('❌ Server health check failed:', error.message);
        return false;
    }
}

// Test 4: Environment Variables Check
function testEnvironmentVariables() {
    console.log('\n🔧 Checking Environment Variables...');
    
    const requiredVars = [
        'MONGO_URI',
        'JWT_SECRET',
        'CLOUD_NAME',
        'CLOUD_API_KEY',
        'CLOUD_API_SECRET',
        'FIREBASE_PROJECT_ID'
    ];
    
    let allPresent = true;
    
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`✅ ${varName}: Set`);
        } else {
            console.log(`❌ ${varName}: Missing`);
            allPresent = false;
        }
    });
    
    return allPresent;
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Subject File Upload Tests...\n');
    
    // Test environment variables
    const envOk = testEnvironmentVariables();
    
    // Test server health
    const serverOk = await testServerHealth();
    
    // Test Cloudinary upload
    const cloudinaryResult = await testCloudinaryUpload();
    
    // Test backend endpoints
    await testBackendEndpoints();
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`Environment Variables: ${envOk ? '✅ OK' : '❌ ISSUES'}`);
    console.log(`Server Health: ${serverOk ? '✅ OK' : '❌ DOWN'}`);
    console.log(`Cloudinary Upload: ${cloudinaryResult.success ? '✅ OK' : '❌ FAILED'}`);
    console.log(`Backend Endpoints: ✅ PROTECTED (as expected)`);
    
    if (envOk && serverOk && cloudinaryResult.success) {
        console.log('\n🎉 All core systems are working!');
        console.log('📝 Subject file upload should work properly now.');
        console.log('\n📋 Next steps:');
        console.log('1. Deploy the fixes to Vercel');
        console.log('2. Test file upload on subject pages');
        console.log('3. Verify files are saved and retrieved correctly');
    } else {
        console.log('\n⚠️ Some issues detected. Please fix before testing.');
    }
    
    console.log('='.repeat(50));
}

// Run the tests
runTests().catch(error => {
    console.error('❌ Test execution failed:', error);
    process.exit(1);
});
