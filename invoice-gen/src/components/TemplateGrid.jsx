import React, { useState } from 'react';
import './TemplateGrid.css';

const TemplateGrid = ({ onTemplateSelect }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Template data with different invoice designs
  const templates = [
    {
      id: 1,
      name: "Modern Blue",
      description: "Clean and professional design with blue accents",
      preview: "modern-blue",
      category: "Business",
      color: "#2563eb",
      features: ["Header Logo", "Clean Typography", "Itemized List", "Tax Calculation"]
    },
    {
      id: 2,
      name: "Classic White",
      description: "Traditional invoice layout with minimal styling",
      preview: "classic-white",
      category: "Standard",
      color: "#6b7280",
      features: ["Simple Layout", "Black & White", "Standard Fields", "Basic Styling"]
    },
    {
      id: 3,
      name: "Creative Green",
      description: "Modern design with green theme for eco-friendly businesses",
      preview: "creative-green",
      category: "Creative",
      color: "#059669",
      features: ["Color Accent", "Modern Layout", "Brand Colors", "Creative Design"]
    },
    {
      id: 4,
      name: "Corporate Red",
      description: "Professional corporate template with red branding",
      preview: "corporate-red",
      category: "Corporate",
      color: "#dc2626",
      features: ["Corporate Style", "Professional Look", "Brand Integration", "Executive Design"]
    },
    {
      id: 5,
      name: "Minimalist Purple",
      description: "Ultra-clean minimalist design with purple highlights",
      preview: "minimalist-purple",
      category: "Minimalist",
      color: "#7c3aed",
      features: ["Minimal Design", "Clean Lines", "Focus on Content", "Modern Typography"]
    },
    {
      id: 6,
      name: "Tech Orange",
      description: "Technology-focused template with orange tech vibes",
      preview: "tech-orange",
      category: "Technology",
      color: "#ea580c",
      features: ["Tech Design", "Modern Elements", "Digital Focused", "Innovation Style"]
    }
  ];

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template.id);
    if (onTemplateSelect) {
      onTemplateSelect(template);
    }
  };

  const getTemplatePreview = (templateId, color) => {
    return (
      <div className="template-preview" style={{ borderColor: color }}>
        <div className="preview-header" style={{ backgroundColor: color }}>
          <div className="preview-logo"></div>
          <div className="preview-title">INVOICE</div>
        </div>
        <div className="preview-content">
          <div className="preview-row">
            <div className="preview-field short"></div>
            <div className="preview-field medium"></div>
          </div>
          <div className="preview-row">
            <div className="preview-field long"></div>
          </div>
          <div className="preview-table">
            <div className="preview-table-header" style={{ backgroundColor: `${color}20` }}></div>
            <div className="preview-table-row"></div>
            <div className="preview-table-row"></div>
            <div className="preview-table-row"></div>
          </div>
          <div className="preview-footer" style={{ backgroundColor: `${color}10` }}>
            <div className="preview-total" style={{ color: color }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="template-grid-container">
      <div className="template-grid-header">
        <h2>Choose Your Invoice Template</h2>
        <p>Select from our collection of professional invoice templates</p>
      </div>

      <div className="template-filters">
        <button className="filter-btn active">All Templates</button>
        <button className="filter-btn">Business</button>
        <button className="filter-btn">Creative</button>
        <button className="filter-btn">Corporate</button>
        <button className="filter-btn">Minimalist</button>
      </div>

      <div className="templates-grid">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
            onClick={() => handleTemplateClick(template)}
          >
            <div className="template-preview-container">
              {getTemplatePreview(template.id, template.color)}
              <div className="template-overlay">
                <button className="preview-btn">Preview</button>
                <button className="select-btn" style={{ backgroundColor: template.color }}>
                  Select Template
                </button>
              </div>
            </div>

            <div className="template-info">
              <div className="template-header">
                <h3>{template.name}</h3>
                <span className="template-category" style={{ backgroundColor: `${template.color}20`, color: template.color }}>
                  {template.category}
                </span>
              </div>
              <p className="template-description">{template.description}</p>
              
              <div className="template-features">
                <h4>Features:</h4>
                <ul>
                  {template.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-icon" style={{ color: template.color }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="template-actions">
                <button 
                  className={`use-template-btn ${selectedTemplate === template.id ? 'selected' : ''}`}
                  style={{ 
                    backgroundColor: selectedTemplate === template.id ? template.color : 'transparent',
                    borderColor: template.color,
                    color: selectedTemplate === template.id ? 'white' : template.color
                  }}
                >
                  {selectedTemplate === template.id ? 'Selected' : 'Use Template'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="template-grid-footer">
        <div className="footer-stats">
          <div className="stat">
            <span className="stat-number">6</span>
            <span className="stat-label">Templates Available</span>
          </div>
          <div className="stat">
            <span className="stat-number">100%</span>
            <span className="stat-label">Customizable</span>
          </div>
          <div className="stat">
            <span className="stat-number">PDF</span>
            <span className="stat-label">Export Ready</span>
          </div>
        </div>
        
        <div className="footer-actions">
          <button className="secondary-btn">Cancel</button>
          <button 
            className="primary-btn"
            disabled={!selectedTemplate}
            style={{ 
              backgroundColor: selectedTemplate ? '#2563eb' : '#9ca3af',
              cursor: selectedTemplate ? 'pointer' : 'not-allowed'
            }}
          >
            Continue with Selected Template
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateGrid;
