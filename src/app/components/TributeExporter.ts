interface Tribute {
  id: number;
  name: string;
  message: string;
  email?: string;
  phone?: string;
  image_url?: string;
  approved: boolean;
  created_at: string;
  approved_at?: string;
  admin_notes?: string;
}

// JSZip types (simple declaration since we'll load it dynamically)
declare global {
  interface Window {
    JSZip: any;
  }
}

export class TributeExporter {
  static generateHTML(tributes: Tribute[], options: { useLinkedImages?: boolean } = {}): string {
    const { useLinkedImages = true } = options;
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const approvedTributes = tributes.filter(t => t.approved);
    const pendingTributes = tributes.filter(t => !t.approved);

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tributes for Peter Frederick Rhodes - Exported ${currentDate}</title>
    <style>
        body {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.5em;
            font-weight: 300;
        }
        
        .export-info {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #007bff;
        }
        
        .statistics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
        }
        
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-number.total { color: #007bff; }
        .stat-number.approved { color: #28a745; }
        .stat-number.pending { color: #ffc107; }
        
        .section {
            margin-bottom: 50px;
        }
        
        .section-title {
            font-size: 2em;
            margin-bottom: 25px;
            padding-bottom: 10px;
            border-bottom: 3px solid #007bff;
            color: #2c3e50;
        }
        
        .tribute-card {
            background: white;
            margin-bottom: 30px;
            border-radius: 15px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
            overflow: hidden;
            border: 1px solid #e9ecef;
        }
        
        .tribute-header {
            padding: 25px 30px 15px 30px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-bottom: 1px solid #dee2e6;
        }
        
        .tribute-name {
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 8px;
        }
        
        .tribute-date {
            color: #6c757d;
            font-size: 0.9em;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 15px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            margin-top: 10px;
        }
        
        .status-approved {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .status-pending {
            background-color: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
        }
        
        .tribute-content {
            padding: 30px;
        }
        
        .tribute-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 30px;
            align-items: start;
        }
        
        @media (max-width: 768px) {
            .tribute-grid {
                grid-template-columns: 1fr;
            }
        }
        
        .contact-info {
            margin-bottom: 20px;
            font-size: 0.95em;
            color: #6c757d;
        }
        
        .contact-info p {
            margin: 5px 0;
        }
        
        .message-content {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #007bff;
            white-space: pre-wrap;
            font-size: 1.05em;
            line-height: 1.7;
        }
        
        .admin-notes {
            background-color: #e7f3ff;
            border: 1px solid #b8daff;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
        }
        
        .admin-notes-title {
            font-weight: bold;
            color: #004085;
            margin-bottom: 8px;
        }
        
        .image-section {
            text-align: center;
        }
        
        .tribute-image {
            max-width: 100%;
            max-height: 400px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin-bottom: 15px;
        }
        
        .image-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-size: 0.9em;
            transition: background-color 0.3s;
        }
        
        .image-link:hover {
            background-color: #0056b3;
            text-decoration: none;
            color: white;
        }
        
        .no-tributes {
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .footer {
            text-align: center;
            margin-top: 50px;
            padding: 30px;
            background-color: #343a40;
            color: white;
            border-radius: 10px;
        }
        
        @media print {
            body { background-color: white; }
            .tribute-card { box-shadow: none; border: 2px solid #dee2e6; }
            .header { background: #6c757d !important; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Tributes for Peter Frederick Rhodes</h1>
        <p>A collection of memories, thoughts, and tributes</p>
    </div>
    
    <div class="export-info">
        <strong>Export Information:</strong><br>
        Generated on: ${currentDate}<br>
        Total Tributes: ${tributes.length}<br>
        Approved: ${approvedTributes.length} | Pending: ${pendingTributes.length}<br>
        Export Type: ${useLinkedImages ? 'Linked Images' : 'Downloaded Images'}
    </div>
    
    <div class="statistics">
        <div class="stat-card">
            <div class="stat-number total">${tributes.length}</div>
            <div>Total Tributes</div>
        </div>
        <div class="stat-card">
            <div class="stat-number approved">${approvedTributes.length}</div>
            <div>Approved</div>
        </div>
        <div class="stat-card">
            <div class="stat-number pending">${pendingTributes.length}</div>
            <div>Pending Review</div>
        </div>
    </div>

    ${approvedTributes.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Approved Tributes (${approvedTributes.length})</h2>
        ${approvedTributes.map(tribute => this.generateTributeHTML(tribute, useLinkedImages)).join('')}
    </div>
    ` : ''}

    ${pendingTributes.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Pending Review (${pendingTributes.length})</h2>
        ${pendingTributes.map(tribute => this.generateTributeHTML(tribute, useLinkedImages)).join('')}
    </div>
    ` : ''}

    ${tributes.length === 0 ? `
    <div class="no-tributes">
        <h3>No tributes available</h3>
        <p>No tributes have been submitted yet.</p>
    </div>
    ` : ''}
    
    <div class="footer">
        <p>This document contains ${tributes.length} tribute${tributes.length !== 1 ? 's' : ''} exported on ${currentDate}</p>
        <p style="font-size: 0.9em; margin-top: 10px; opacity: 0.8;">
            Generated by Peter Rhodes Tribute Admin System
        </p>
    </div>
</body>
</html>`;

    return html;
  }

  private static generateTributeHTML(tribute: Tribute, useLinkedImages: boolean): string {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const sanitizeText = (text: string) => {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const getImageSrc = (tribute: Tribute) => {
      if (!tribute.image_url) return '';
      
      if (useLinkedImages) {
        // Use absolute URL for linked mode
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return tribute.image_url.startsWith('http') ? tribute.image_url : `${baseUrl}${tribute.image_url}`;
      } else {
        // Use relative path for downloaded mode
        const safeName = tribute.name.replace(/[^a-zA-Z0-9]/g, '-');
        const date = new Date(tribute.created_at).toISOString().split('T')[0];
        const extension = this.getFileExtension(tribute.image_url) || 'jpg';
        return `images/${safeName}-${date}.${extension}`;
      }
    };

    return `
    <div class="tribute-card">
        <div class="tribute-header">
            <div class="tribute-name">${sanitizeText(tribute.name)}</div>
            <div class="tribute-date">
                Submitted: ${formatDate(tribute.created_at)}
                ${tribute.approved_at ? ` | Approved: ${formatDate(tribute.approved_at)}` : ''}
            </div>
            <div class="status-badge ${tribute.approved ? 'status-approved' : 'status-pending'}">
                ${tribute.approved ? '✓ Approved' : '⏳ Pending Review'}
            </div>
        </div>
        
        <div class="tribute-content">
            <div class="tribute-grid">
                <div>
                    ${(tribute.email || tribute.phone) ? `
                    <div class="contact-info">
                        ${tribute.email ? `<p><strong>Email:</strong> ${sanitizeText(tribute.email)}</p>` : ''}
                        ${tribute.phone ? `<p><strong>Phone:</strong> ${sanitizeText(tribute.phone)}</p>` : ''}
                    </div>
                    ` : ''}
                    
                    <div class="message-content">
                        ${sanitizeText(tribute.message)}
                    </div>
                    
                    ${tribute.admin_notes ? `
                    <div class="admin-notes">
                        <div class="admin-notes-title">Admin Notes:</div>
                        ${sanitizeText(tribute.admin_notes)}
                    </div>
                    ` : ''}
                </div>
                
                ${tribute.image_url ? `
                <div class="image-section">
                    <img src="${getImageSrc(tribute)}" alt="Tribute photo from ${sanitizeText(tribute.name)}" class="tribute-image" loading="lazy">
                    <br>
                    ${useLinkedImages ? 
                      `<a href="${getImageSrc(tribute)}" class="image-link" target="_blank">View Full Image</a>` :
                      `<p style="font-size: 0.9em; color: #6c757d; margin-top: 10px;">Image: ${getImageSrc(tribute)}</p>`
                    }
                </div>
                ` : ''}
            </div>
        </div>
    </div>`;
  }

  private static getFileExtension(url: string): string | null {
    const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
    if (match) {
      return match[1].toLowerCase();
    }
    
    if (url.includes('/api/images/')) {
      const filename = url.split('/').pop();
      if (filename) {
        const extensionMatch = filename.match(/\.([a-zA-Z0-9]+)$/);
        if (extensionMatch) {
          return extensionMatch[1].toLowerCase();
        }
      }
    }
    
    return 'jpg';
  }

  // Export with linked images (simple HTML download)
  static async exportWithLinkedImages(tributes: Tribute[]): Promise<void> {
    const html = this.generateHTML(tributes, { useLinkedImages: true });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    
    const filename = `tributes-linked-${new Date().toISOString().split('T')[0]}.html`;
    this.downloadBlob(blob, filename);
  }

  // Export with downloaded images (ZIP file)
  static async exportWithDownloadedImages(tributes: Tribute[]): Promise<void> {
    try {
      const JSZip = await this.loadJSZip();
      const zip = new JSZip();

      // Filter tributes with images
      const tributesWithImages = tributes.filter(tribute => tribute.image_url);

      // Generate HTML for downloaded mode
      const html = this.generateHTML(tributes, { useLinkedImages: false });
      zip.file('tributes.html', html);

      // Create images folder if there are images
      if (tributesWithImages.length > 0) {
        const imagesFolder = zip.folder('images');

        // Download and add each image
        const downloadPromises = tributesWithImages.map(async (tribute) => {
          try {
            const response = await fetch(tribute.image_url!);
            if (!response.ok) {
              console.warn(`Failed to fetch image for ${tribute.name}: ${tribute.image_url}`);
              return;
            }

            const blob = await response.blob();
            
            // Create safe filename
            const safeName = tribute.name.replace(/[^a-zA-Z0-9]/g, '-');
            const date = new Date(tribute.created_at).toISOString().split('T')[0];
            const extension = this.getFileExtension(tribute.image_url!) || 'jpg';
            const fileName = `${safeName}-${date}.${extension}`;

            imagesFolder?.file(fileName, blob);

          } catch (error) {
            console.warn(`Error downloading image for ${tribute.name}:`, error);
          }
        });

        await Promise.all(downloadPromises);
      }

      // Add README file
      const readmeContent = this.generateReadme(tributes);
      zip.file('README.txt', readmeContent);

      // Generate and download ZIP
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      const filename = `tributes-with-images-${new Date().toISOString().split('T')[0]}.zip`;
      this.downloadBlob(zipBlob, filename);

    } catch (error) {
      console.error('Error creating ZIP export:', error);
      throw error;
    }
  }

  // Load JSZip library dynamically
  private static async loadJSZip(): Promise<any> {
    if (window.JSZip) {
      return window.JSZip;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      script.onload = () => resolve(window.JSZip);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  }

  private static generateReadme(tributes: Tribute[]): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const approvedCount = tributes.filter(t => t.approved).length;
    const pendingCount = tributes.filter(t => !t.approved).length;
    const imagesCount = tributes.filter(t => t.image_url).length;

    return `TRIBUTE ARCHIVE - Peter Frederick Rhodes
Generated: ${currentDate}

CONTENTS:
=========
- tributes.html: Complete tribute webpage with all submitted tributes
- images/: Folder containing all tribute images
- README.txt: This file

STATISTICS:
===========
Total Tributes: ${tributes.length}
Approved: ${approvedCount}
Pending: ${pendingCount}
Images: ${imagesCount}

HOW TO VIEW:
============
1. Extract this ZIP file to a folder
2. Open 'tributes.html' in any web browser
3. All images are stored in the 'images' folder and will display correctly

FILE STRUCTURE:
===============
tributes.html - Main tribute page
images/
${tributes.filter(t => t.image_url).map(tribute => {
  const safeName = tribute.name.replace(/[^a-zA-Z0-9]/g, '-');
  const date = new Date(tribute.created_at).toISOString().split('T')[0];
  const extension = this.getFileExtension(tribute.image_url!) || 'jpg';
  return `  ${safeName}-${date}.${extension} - Photo from ${tribute.name}`;
}).join('\n')}

NOTES:
======
- This archive is completely self-contained and works offline
- All images are preserved in their original quality
- The HTML file references images using relative paths
- You can share this entire folder or ZIP file with others

Generated by Peter Rhodes Tribute Admin System
Export Date: ${currentDate}`;
  }
} 