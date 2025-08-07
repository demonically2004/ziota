#!/usr/bin/env node

/**
 * Deployment Test Script for Ziota
 * This script verifies that all necessary configurations are in place for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Ziota Deployment Configuration...\n');

// Test 1: Check if required files exist
const requiredFiles = [
    'package.json',
    'server.js',
    'vercel.json',
    '.env.example',
    'frontend/package.json',
    'frontend/.env.example',
    'README.md',
    'DEPLOYMENT.md',
    'LICENSE'
];

console.log('📁 Checking required files...');
let filesOk = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        filesOk = false;
    }
});

// Test 2: Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['start', 'build', 'vercel-build'];
    
    requiredScripts.forEach(script => {
        if (packageJson.scripts && packageJson.scripts[script]) {
            console.log(`✅ Script "${script}": ${packageJson.scripts[script]}`);
        } else {
            console.log(`❌ Script "${script}" - MISSING`);
            filesOk = false;
        }
    });
} catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    filesOk = false;
}

// Test 3: Check frontend package.json
console.log('\n🎨 Checking frontend package.json...');
try {
    const frontendPackageJson = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));
    const requiredFrontendScripts = ['start', 'build', 'vercel-build'];
    
    requiredFrontendScripts.forEach(script => {
        if (frontendPackageJson.scripts && frontendPackageJson.scripts[script]) {
            console.log(`✅ Frontend script "${script}": ${frontendPackageJson.scripts[script]}`);
        } else {
            console.log(`❌ Frontend script "${script}" - MISSING`);
            filesOk = false;
        }
    });
} catch (error) {
    console.log('❌ Error reading frontend/package.json:', error.message);
    filesOk = false;
}

// Test 4: Check vercel.json configuration
console.log('\n🌐 Checking vercel.json configuration...');
try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

    if (vercelConfig.builds && vercelConfig.builds.length > 0) {
        console.log('✅ Vercel builds configuration found');
    } else {
        console.log('❌ Vercel builds configuration missing');
        filesOk = false;
    }

    if (vercelConfig.routes && vercelConfig.routes.length > 0) {
        console.log('✅ Vercel routes configuration found');
    } else {
        console.log('❌ Vercel routes configuration missing');
        filesOk = false;
    }
} catch (error) {
    console.log('❌ Error reading vercel.json:', error.message);
    filesOk = false;
}

// Test 5: Check API URL consistency
console.log('\n🔗 Checking API URL consistency...');
try {
    // Check frontend components for consistent API URL usage
    const componentsToCheck = [
        'frontend/src/components/SubjectPage.js',
        'frontend/src/components/General.js',
        'frontend/src/components/Personal.js',
        'frontend/src/services/AuthService.js'
    ];

    let apiUrlConsistent = true;

    componentsToCheck.forEach(componentPath => {
        if (fs.existsSync(componentPath)) {
            const content = fs.readFileSync(componentPath, 'utf8');

            // Check for REACT_APP_API_BASE_URL (old, inconsistent)
            if (content.includes('REACT_APP_API_BASE_URL')) {
                console.log(`❌ ${componentPath} uses inconsistent API_BASE_URL`);
                apiUrlConsistent = false;
            }

            // Check for REACT_APP_API_URL (correct)
            if (content.includes('REACT_APP_API_URL')) {
                console.log(`✅ ${componentPath} uses consistent API_URL`);
            }
        }
    });

    if (apiUrlConsistent) {
        console.log('✅ All components use consistent API URL configuration');
    } else {
        console.log('❌ Some components use inconsistent API URL configuration');
        filesOk = false;
    }
} catch (error) {
    console.log('❌ Error checking API URL consistency:', error.message);
    filesOk = false;
}

// Test 6: Check CORS configuration
console.log('\n🌐 Checking CORS configuration...');
try {
    const serverContent = fs.readFileSync('server.js', 'utf8');

    if (serverContent.includes('zio1.vercel.app')) {
        console.log('✅ CORS includes zio1.vercel.app domain');
    } else {
        console.log('❌ CORS missing zio1.vercel.app domain');
        filesOk = false;
    }

    if (serverContent.includes('/\\.vercel\\.app$/')) {
        console.log('✅ CORS includes Vercel domain regex');
    } else {
        console.log('❌ CORS missing Vercel domain regex');
        filesOk = false;
    }
} catch (error) {
    console.log('❌ Error checking CORS configuration:', error.message);
    filesOk = false;
}

// Test 5: Check environment variable examples
console.log('\n🔧 Checking environment variable examples...');
try {
    const envExample = fs.readFileSync('.env.example', 'utf8');
    const requiredEnvVars = [
        'MONGO_URI',
        'JWT_SECRET',
        'FIREBASE_PROJECT_ID',
        'CLOUD_NAME'
    ];
    
    requiredEnvVars.forEach(envVar => {
        if (envExample.includes(envVar)) {
            console.log(`✅ ${envVar} example found`);
        } else {
            console.log(`❌ ${envVar} example missing`);
            filesOk = false;
        }
    });
} catch (error) {
    console.log('❌ Error reading .env.example:', error.message);
    filesOk = false;
}

// Test 6: Check if build directory exists (optional)
console.log('\n🏗️ Checking build status...');
if (fs.existsSync('frontend/build')) {
    console.log('✅ Frontend build directory exists');
} else {
    console.log('ℹ️ Frontend build directory not found (run "npm run build" to create)');
}

// Final result
console.log('\n' + '='.repeat(50));
if (filesOk) {
    console.log('🎉 All deployment checks passed!');
    console.log('✅ Your project is ready for Vercel deployment');
    console.log('\nNext steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Connect your repository to Vercel');
    console.log('3. Set up environment variables in Vercel');
    console.log('4. Deploy!');
    console.log('\nSee DEPLOYMENT.md for detailed instructions.');
} else {
    console.log('❌ Some deployment checks failed!');
    console.log('Please fix the issues above before deploying.');
    process.exit(1);
}

console.log('='.repeat(50));
