#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying build process...');

// Check if frontend build directory exists
const buildPath = path.join(__dirname, '..', 'frontend', 'build');
console.log('📁 Checking build path:', buildPath);

if (fs.existsSync(buildPath)) {
    console.log('✅ Build directory exists');
    
    // List contents
    const files = fs.readdirSync(buildPath);
    console.log('📄 Build directory contents:', files);
    
    // Check for index.html
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        console.log('✅ index.html exists');
    } else {
        console.log('❌ index.html missing');
    }
    
    // Check for static directory
    const staticPath = path.join(buildPath, 'static');
    if (fs.existsSync(staticPath)) {
        console.log('✅ static directory exists');
        
        // Check static subdirectories
        const staticContents = fs.readdirSync(staticPath);
        console.log('📁 Static directory contents:', staticContents);
        
        // Check for JS files
        const jsPath = path.join(staticPath, 'js');
        if (fs.existsSync(jsPath)) {
            const jsFiles = fs.readdirSync(jsPath);
            console.log('📄 JS files:', jsFiles);
        }
        
        // Check for CSS files
        const cssPath = path.join(staticPath, 'css');
        if (fs.existsSync(cssPath)) {
            const cssFiles = fs.readdirSync(cssPath);
            console.log('🎨 CSS files:', cssFiles);
        }
    } else {
        console.log('❌ static directory missing');
    }
} else {
    console.log('❌ Build directory does not exist');
    console.log('🔧 Run: cd frontend && npm run build');
}

console.log('🏁 Build verification complete');
