#!/usr/bin/env node

/**
 * Simple HTTP server for testing the browser functionality
 * Serves the safe-refactor directory with proper CORS headers for ES modules
 */

import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { extname, join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 8888;
const ROOT_DIR = join(__dirname, '..', '..');

// MIME types for different file extensions
const MIME_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function getMimeType(filePath) {
    const ext = extname(filePath).toLowerCase();
    return MIME_TYPES[ext] || 'text/plain';
}

async function serveFile(res, filePath) {
    try {
        const fullPath = join(ROOT_DIR, filePath);
        const stats = await stat(fullPath);
        
        if (stats.isDirectory()) {
            // Try to serve index.html from directory
            return await serveFile(res, join(filePath, 'index.html'));
        }
        
        const content = await readFile(fullPath);
        const mimeType = getMimeType(filePath);
        
        res.writeHead(200, {
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Cache-Control': 'no-cache'
        });
        
        res.end(content);
        
    } catch (error) {
        console.error(`Error serving ${filePath}:`, error.message);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
    }
}

const server = createServer(async (req, res) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        });
        res.end();
        return;
    }
    
    let filePath = req.url === '/' ? '/test-browser.html' : req.url;
    
    // Remove query parameters
    filePath = filePath.split('?')[0];
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }
    
    console.log(`${new Date().toISOString()} - ${req.method} ${filePath}`);
    
    await serveFile(res, filePath);
});

server.listen(PORT, () => {
    console.log(`🚀 Test server running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${ROOT_DIR}`);
    console.log(`🧪 Open http://localhost:${PORT}/tests/browser/test-browser-simple.html to run browser tests`);
    console.log(`⏹️  Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped');
        process.exit(0);
    });
});
