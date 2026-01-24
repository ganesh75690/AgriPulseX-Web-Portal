"""
Government-Grade Agricultural PDF Report Generator
Creates professional reports for disease analysis and containment recommendations
"""

import io
import base64
from datetime import datetime
from typing import Dict, Any
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.platypus import PageBreak, KeepTogether
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

class AgriculturalReportGenerator:
    """
    Generates government-standard agricultural disease analysis reports
    """
    
    def __init__(self):
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        
    def _setup_custom_styles(self):
        """Setup custom styles for government report formatting"""
        
        # Title style
        self.styles.add(ParagraphStyle(
            name='GovernmentTitle',
            parent=self.styles['Title'],
            fontSize=18,
            spaceAfter=30,
            textColor=HexColor('#2C3E50'),
            alignment=TA_CENTER,
            borderWidth=1,
            borderColor=HexColor('#34495E'),
            borderPadding=10
        ))
        
        # Header style
        self.styles.add(ParagraphStyle(
            name='SectionHeader',
            parent=self.styles['Heading1'],
            fontSize=14,
            spaceAfter=12,
            textColor=HexColor('#2C3E50'),
            borderWidth=0,
            borderLeftWidth=4,
            borderLeftColor=HexColor('#3498DB'),
            borderLeftPadding=10
        ))
        
        # Critical info style
        self.styles.add(ParagraphStyle(
            name='CriticalInfo',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=6,
            textColor=HexColor('#E74C3C'),
            fontName='Helvetica-Bold'
        ))
        
        # Normal text style
        self.styles.add(ParagraphStyle(
            name='ReportText',
            parent=self.styles['Normal'],
            fontSize=10,
            spaceAfter=6,
            leading=14
        ))
    
    def generate_report(self, analysis_data: Dict[str, Any], original_image_bytes: bytes) -> bytes:
        """
        Generate comprehensive PDF report
        
        Args:
            analysis_data: Complete unified analysis results
            original_image_bytes: Original uploaded image
            
        Returns:
            PDF file as bytes
        """
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, 
                               rightMargin=72, leftMargin=72,
                               topMargin=72, bottomMargin=18)
        
        story = []
        
        # Build report sections
        story.extend(self._build_header_section(analysis_data))
        story.extend(self._build_executive_summary(analysis_data))
        story.extend(self._build_image_section(analysis_data, original_image_bytes))
        story.extend(self._build_analysis_details(analysis_data))
        story.extend(self._build_containment_section(analysis_data))
        story.extend(self._build_recommendations_section(analysis_data))
        story.extend(self._build_footer_section(analysis_data))
        
        doc.build(story)
        buffer.seek(0)
        return buffer.getvalue()
    
    def _build_header_section(self, data: Dict[str, Any]) -> list:
        """Build report header with government branding"""
        
        elements = []
        
        # Government header
        header_data = [
            ["DEPARTMENT OF AGRICULTURE & FARMERS WELFARE"],
            ["GOVERNMENT OF INDIA"],
            ["CROP DISEASE ANALYSIS REPORT"]
        ]
        
        header_table = Table(header_data, colWidths=[7*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (0, 0), 16),
            ('FONTSIZE', (1, 1), (1, 1), 12),
            ('FONTSIZE', (2, 2), (2, 2), 14),
            ('TEXTCOLOR', (0, 0), (-1, -1), HexColor('#2C3E50')),
            ('LINEBELOW', (0, 0), (-1, -1), 2, HexColor('#3498DB')),
            ('LINEABOVE', (0, 0), (-1, -1), 2, HexColor('#3498DB')),
            ('BACKGROUND', (0, 0), (-1, -1), HexColor('#ECF0F1')),
            ('PADDING', (0, 0), (-1, -1), 12)
        ]))
        
        elements.append(header_table)
        elements.append(Spacer(1, 20))
        
        # Report metadata
        metadata = [
            ['Analysis ID:', data['analysis_id']],
            ['Report Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
            ['Farmer ID:', data.get('farmer_id', 'Not Provided')],
            ['Region:', data.get('region', 'Not Provided')]
        ]
        
        metadata_table = Table(metadata, colWidths=[1.5*inch, 5.5*inch])
        metadata_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, HexColor('#BDC3C7')),
            ('PADDING', (0, 0), (-1, -1), 6)
        ]))
        
        elements.append(metadata_table)
        elements.append(Spacer(1, 20))
        
        return elements
    
    def _build_executive_summary(self, data: Dict[str, Any]) -> list:
        """Build executive summary section"""
        
        elements = []
        elements.append(Paragraph("EXECUTIVE SUMMARY", self.styles['SectionHeader']))
        
        summary = data['quick_summary']
        image_analysis = data['image_analysis']
        
        # Status indicator
        status_color = '#27AE60' if summary['status'] == 'Healthy' else '#E74C3C'
        urgency_color = '#F39C12' if summary['urgency'] == 'Medium' else '#E74C3C' if summary['urgency'] == 'High' else '#27AE60'
        
        summary_data = [
            ['Overall Status:', summary['status'], status_color],
            ['Urgency Level:', summary['urgency'], urgency_color],
            ['Detected Disease:', image_analysis['disease'], '#2C3E50'],
            ['Confidence Level:', image_analysis['confidence'], '#2C3E50'],
            ['Severity Assessment:', image_analysis['severity'], '#2C3E50']
        ]
        
        summary_table = Table(summary_data, colWidths=[2*inch, 3*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 11),
            ('TEXTCOLOR', (2, 0), (2, -1), HexColor('#FFFFFF')),
            ('BACKGROUND', (2, 0), (2, -1), HexColor(status_color)),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, HexColor('#BDC3C7')),
            ('PADDING', (0, 0), (-1, -1), 8)
        ]))
        
        elements.append(summary_table)
        elements.append(Spacer(1, 15))
        
        return elements
    
    def _build_image_section(self, data: Dict[str, Any], original_image_bytes: bytes) -> list:
        """Build image analysis section with original and heatmap"""
        
        elements = []
        elements.append(Paragraph("VISUAL ANALYSIS", self.styles['SectionHeader']))
        
        # Convert images to usable format
        original_image = io.BytesIO(original_image_bytes)
        original_image.seek(0)  # Reset position to beginning
        
        # Decode heatmap from base64 - handle data URL format
        heatmap_base64 = data['image_analysis']['heatmap']
        if heatmap_base64.startswith('data:image'):
            # Remove data URL prefix
            heatmap_base64 = heatmap_base64.split(',')[1]
        
        heatmap_data = base64.b64decode(heatmap_base64)
        heatmap_image = io.BytesIO(heatmap_data)
        heatmap_image.seek(0)  # Reset position to beginning
        
        # Validate images before using in ReportLab
        try:
            # Test if images can be read
            from PIL import Image as PILImage
            
            # Reset positions before validation
            original_image.seek(0)
            heatmap_image.seek(0)
            
            # Validate original image
            pil_original = PILImage.open(original_image)
            pil_original.verify()  # Verify it's a valid image
            original_image.seek(0)  # Reset after verification
            
            # Validate heatmap image
            pil_heatmap = PILImage.open(heatmap_image)
            pil_heatmap.verify()  # Verify it's a valid image
            heatmap_image.seek(0)  # Reset after verification
            
            print("✓ Both images validated successfully for PDF generation")
            
        except Exception as img_error:
            print(f"✗ Image validation error: {img_error}")
            print(f"Original image size: {len(original_image_bytes)} bytes")
            print(f"Heatmap base64 length: {len(heatmap_base64)}")
            
            # Skip images if they can't be validated
            elements.append(Paragraph("Note: Images could not be processed for this report", self.styles['ReportText']))
            elements.append(Paragraph(f"Error details: {str(img_error)}", self.styles['ReportText']))
            return elements
        
        # Create image comparison table with error handling
        try:
            image_table_data = [
                [
                    Paragraph("Original Image", self.styles['ReportText']),
                    Paragraph("Infection Heatmap", self.styles['ReportText'])
                ],
                [
                    Image(original_image, width=3*inch, height=2.5*inch),
                    Image(heatmap_image, width=3*inch, height=2.5*inch)
                ]
            ]
            
            image_table = Table(image_table_data, colWidths=[3.5*inch, 3.5*inch])
            image_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('LINEBELOW', (0, 0), (-1, 0), 1, HexColor('#34495E')),
                ('PADDING', (0, 0), (-1, -1), 10),
                ('BACKGROUND', (0, 0), (-1, 0), HexColor('#ECF0F1'))
            ]))
            
            elements.append(image_table)
            print("✓ Image table created successfully")
            
        except Exception as table_error:
            print(f"✗ Image table creation failed: {table_error}")
            elements.append(Paragraph("Images could not be embedded in this report", self.styles['ReportText']))
            elements.append(Paragraph(f"Table error: {str(table_error)}", self.styles['ReportText']))
        elements.append(Spacer(1, 15))
        
        # Image analysis explanation
        elements.append(Paragraph("Analysis Explanation:", self.styles['ReportText']))
        elements.append(Paragraph(data['image_analysis']['explanation'], self.styles['ReportText']))
        elements.append(Spacer(1, 15))
        
        return elements
    
    def _build_analysis_details(self, data: Dict[str, Any]) -> list:
        """Build detailed analysis section"""
        
        elements = []
        elements.append(Paragraph("DETAILED ANALYSIS", self.styles['SectionHeader']))
        
        image_analysis = data['image_analysis']
        
        # Technical details table
        tech_data = [
            ['Detection Method', 'Computer Vision Analysis (HSV + Edge Detection)'],
            ['Processing Resolution', '224x224 pixels'],
            ['Color Analysis', 'HSV color space masking'],
            ['Texture Analysis', 'Canny edge detection'],
            ['Confidence Calculation', 'Combined color and texture metrics']
        ]
        
        tech_table = Table(tech_data, colWidths=[2.5*inch, 4.5*inch])
        tech_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, HexColor('#BDC3C7')),
            ('PADDING', (0, 0), (-1, -1), 6),
            ('BACKGROUND', (0, 0), (0, -1), HexColor('#F8F9FA'))
        ]))
        
        elements.append(tech_table)
        elements.append(Spacer(1, 15))
        
        return elements
    
    def _build_containment_section(self, data: Dict[str, Any]) -> list:
        """Build containment recommendations section"""
        
        elements = []
        elements.append(Paragraph("CONTAINMENT RECOMMENDATIONS", self.styles['SectionHeader']))
        
        containment = data['containment_decision']
        
        # Critical action box
        action_style = ParagraphStyle(
            name='ActionBox',
            parent=self.styles['Normal'],
            fontSize=12,
            spaceAfter=10,
            textColor=white,
            backColor=HexColor('#E74C3C') if containment['level'] >= 4 else HexColor('#F39C12'),
            borderWidth=1,
            borderColor=HexColor('#2C3E50'),
            borderPadding=12,
            alignment=TA_CENTER
        )
        
        elements.append(Paragraph(f"REQUIRED ACTION: {containment['action']}", action_style))
        
        # Containment details table
        contain_data = [
            ['Containment Level', f"Level {containment['level']}"],
            ['Authority Required', containment['authority_level']],
            ['Implementation Timeline', containment['timeline']],
            ['Confidence Modifier', str(containment.get('confidence_modifier', 'N/A'))]
        ]
        
        contain_table = Table(contain_data, colWidths=[2.5*inch, 4.5*inch])
        contain_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('LINEBELOW', (0, 0), (-1, -1), 0.5, HexColor('#BDC3C7')),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('BACKGROUND', (0, 0), (0, -1), HexColor('#F8F9FA'))
        ]))
        
        elements.append(contain_table)
        elements.append(Spacer(1, 15))
        
        # Required measures
        elements.append(Paragraph("Required Measures:", self.styles['ReportText']))
        for i, measure in enumerate(containment['measures'], 1):
            elements.append(Paragraph(f"{i}. {measure}", self.styles['ReportText']))
        
        elements.append(Spacer(1, 15))
        
        return elements
    
    def _build_recommendations_section(self, data: Dict[str, Any]) -> list:
        """Build next steps and recommendations"""
        
        elements = []
        elements.append(Paragraph("NEXT STEPS", self.styles['SectionHeader']))
        
        # Quick next steps
        elements.append(Paragraph("Immediate Actions Required:", self.styles['ReportText']))
        for step in data['quick_summary']['next_steps']:
            elements.append(Paragraph(f"• {step}", self.styles['ReportText']))
        
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("Decision Explanation:", self.styles['ReportText']))
        elements.append(Paragraph(data['containment_decision']['explanation'], self.styles['ReportText']))
        
        elements.append(Spacer(1, 15))
        
        return elements
    
    def _build_footer_section(self, data: Dict[str, Any]) -> list:
        """Build report footer with official information"""
        
        elements = []
        
        # Official disclaimer
        disclaimer_text = """
        This report is generated by the Agricultural Disease Detection System using 
        computer vision analysis. All containment recommendations should be implemented 
        in consultation with qualified agricultural officers. The Department of Agriculture 
        & Farmers Welfare assumes no liability for crop losses or economic impacts.
        """
        
        elements.append(Paragraph("OFFICIAL DISCLAIMER", self.styles['SectionHeader']))
        elements.append(Paragraph(disclaimer_text, self.styles['ReportText']))
        elements.append(Spacer(1, 20))
        
        # Signature block
        signature_data = [
            ['_________________________', '_________________________'],
            ['Agricultural Officer', 'Regional Director'],
            ['Department of Agriculture', 'Department of Agriculture - Government of India']
        ]
        
        signature_table = Table(signature_data, colWidths=[3.5*inch, 3.5*inch])
        signature_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('PADDING', (0, 0), (-1, -1), 6)
        ]))
        
        elements.append(signature_table)
        
        return elements

# Global instance for use across the application
pdf_generator = AgriculturalReportGenerator()
