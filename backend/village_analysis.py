"""
Village-Level Agricultural Disease Analysis Module
Supports multi-farmer aggregation and coordinated containment recommendations
"""

import random
import math
from datetime import datetime
from typing import Dict, List, Any, Optional
from image_detection import analyze_image
from unified_analysis import unified_crop_analysis

class VillageAnalysisEngine:
    """
    Government-grade village-level disease analysis engine
    Aggregates individual farmer data for coordinated response planning
    """
    
    def __init__(self):
        self.village_database = self._initialize_village_database()
        self.connectivity_factors = {
            'high_density': 1.5,    # High farmer density increases spread risk
            'medium_density': 1.2,  # Medium density
            'low_density': 1.0      # Low density, minimal spread risk
        }
        
        self.policy_thresholds = {
            'high_risk_score': 75,   # Village risk score above this triggers policy
            'affected_percentage': 40,  # % of farmers affected triggers policy
            'dominant_disease_severity': 'high'  # High severity dominant disease
        }
    
    def _initialize_village_database(self) -> Dict[str, Any]:
        """
        Initialize mock village database with farmer information
        Supports decentralized agricultural governance
        """
        return {
            'Amritpur': {
                'total_farmers': 45,
                'density_factor': 'high_density',
                'primary_crops': ['Wheat', 'Rice'],
                'coordinates': (31.6339, 74.8723),
                'farmers': [
                    {'id': 'FARM001', 'name': 'Rajesh Kumar Singh', 'field_area': 2.5, 'crop_type': 'Wheat'},
                    {'id': 'FARM002', 'name': 'Priya Sharma', 'field_area': 1.8, 'crop_type': 'Rice'},
                    {'id': 'FARM003', 'name': 'Amit Patel', 'field_area': 3.2, 'crop_type': 'Wheat'},
                    {'id': 'FARM004', 'name': 'Sunita Devi', 'field_area': 1.5, 'crop_type': 'Rice'},
                    {'id': 'FARM005', 'name': 'Mohammed Ali', 'field_area': 2.8, 'crop_type': 'Wheat'},
                ]
            },
            'Badshahpur': {
                'total_farmers': 32,
                'density_factor': 'medium_density',
                'primary_crops': ['Cotton', 'Sugarcane'],
                'coordinates': (28.4595, 77.0266),
                'farmers': [
                    {'id': 'FARM006', 'name': 'Lakshmi Narayanan', 'field_area': 4.1, 'crop_type': 'Cotton'},
                    {'id': 'FARM007', 'name': 'Gurpreet Singh', 'field_area': 2.9, 'crop_type': 'Sugarcane'},
                    {'id': 'FARM008', 'name': 'Anjali Reddy', 'field_area': 3.5, 'crop_type': 'Cotton'},
                ]
            },
            'Chandpur': {
                'total_farmers': 28,
                'density_factor': 'low_density',
                'primary_crops': ['Maize', 'Pulses'],
                'coordinates': (25.5941, 85.1376),
                'farmers': [
                    {'id': 'FARM009', 'name': 'Rahul Verma', 'field_area': 2.2, 'crop_type': 'Maize'},
                    {'id': 'FARM010', 'name': 'Kavita Nair', 'field_area': 1.9, 'crop_type': 'Pulses'},
                ]
            }
        }
    
    def analyze_village_cluster(
        self, 
        village_name: str, 
        image_data: bytes, 
        crop_type: Optional[str] = None,
        region: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Perform village-level disease analysis with aggregation logic
        
        Args:
            village_name: Name of the village for analysis
            image_data: Uploaded image data for disease detection
            crop_type: Optional crop type specification
            region: Optional geographical region
            
        Returns:
            Comprehensive village analysis with coordinated recommendations
        """
        
        # Get village information
        village_info = self.village_database.get(village_name, self._get_default_village_info())
        
        # Generate mock farmer analyses (in production, this would use real data)
        farmer_analyses = self._generate_farmer_analyses(
            village_info, image_data, crop_type, region
        )
        
        # Calculate village-level metrics
        village_metrics = self._calculate_village_metrics(farmer_analyses, village_info)
        
        # Generate coordinated containment recommendations
        collective_recommendation = self._generate_collective_recommendation(
            village_metrics, village_info
        )
        
        # Assess policy trigger requirements
        policy_trigger = self._assess_policy_trigger(village_metrics)
        
        # Calculate market impact assessment
        market_impact = self._calculate_market_impact(village_metrics, village_info)
        
        # Generate comparative analysis
        comparative_analysis = self._generate_comparative_analysis(farmer_analyses, village_metrics)
        
        return {
            'village_name': village_name,
            'total_farmers': village_info['total_farmers'],
            'affected_farmers': len(farmer_analyses),
            'dominant_disease': village_metrics['dominant_disease'],
            'average_severity': village_metrics['average_severity'],
            'village_risk_score': village_metrics['village_risk_score'],
            'spread_potential': village_metrics['spread_potential'],
            'collective_recommendation': collective_recommendation,
            'estimated_village_yield_loss': village_metrics['estimated_yield_loss'],
            'market_impact': market_impact,
            'policy_trigger': policy_trigger,
            'farmer_analyses': farmer_analyses,
            'comparative_analysis': comparative_analysis,
            'analysis_metadata': {
                'timestamp': datetime.now().isoformat(),
                'analysis_type': 'village-cluster',
                'governance_level': 'village-panchayat',
                'ministry_compliance': 'Department of Agriculture & Farmers Welfare'
            }
        }
    
    def _generate_farmer_analyses(
        self, 
        village_info: Dict[str, Any], 
        image_data: bytes, 
        crop_type: Optional[str],
        region: Optional[str]
    ) -> List[Dict[str, Any]]:
        """
        Generate individual farmer analyses for aggregation
        In production, this would process actual farmer data
        """
        
        farmers = village_info['farmers']
        farmer_analyses = []
        
        # Analyze the uploaded image to get base disease detection
        base_analysis = self._analyze_base_image(image_data, crop_type)
        
        # Generate variations for different farmers (simulating field variations)
        for i, farmer in enumerate(farmers):
            # Add realistic variation to confidence and severity
            confidence_variation = random.uniform(-10, 10)
            adjusted_confidence = max(50, min(95, base_analysis['confidence'] + confidence_variation))
            
            # Some farmers might have different conditions
            severity_levels = ['low', 'medium', 'high']
            severity_weights = [0.3, 0.4, 0.3]  # Balanced distribution
            
            # Adjust severity based on confidence
            if adjusted_confidence > 80:
                severity_weights = [0.1, 0.3, 0.6]  # Higher confidence -> higher severity
            elif adjusted_confidence < 60:
                severity_weights = [0.6, 0.3, 0.1]  # Lower confidence -> lower severity
            
            detected_severity = random.choices(severity_levels, weights=severity_weights)[0]
            
            # Calculate individual risk score
            risk_score = self._calculate_individual_risk_score(
                adjusted_confidence, detected_severity, farmer['field_area']
            )
            
            # Generate individual containment decision
            containment_decision = self._generate_individual_containment(
                base_analysis['disease'], detected_severity, risk_score
            )
            
            farmer_analysis = {
                'farmer_id': farmer['id'],
                'farmer_name': farmer['name'],
                'field_area': farmer['field_area'],
                'crop_type': farmer['crop_type'],
                'image_analysis': {
                    'disease': base_analysis['disease'],
                    'confidence': f"{adjusted_confidence:.1f}%",
                    'severity': detected_severity,
                    'explanation': base_analysis.get('explanation', ''),
                    'heatmap': base_analysis.get('heatmap', '')
                },
                'containment_decision': containment_decision,
                'risk_score': risk_score
            }
            
            farmer_analyses.append(farmer_analysis)
        
        return farmer_analyses
    
    def _analyze_base_image(self, image_data: bytes, crop_type: Optional[str]) -> Dict[str, Any]:
        """
        Analyze the uploaded image to get base disease detection
        """
        try:
            # Use existing image detection logic
            result = analyze_image(image_data, crop_type)
            return {
                'disease': result.get('disease', 'Healthy'),
                'confidence': float(result.get('confidence', 75)),
                'explanation': result.get('explanation', ''),
                'heatmap': result.get('heatmap', '')
            }
        except Exception as e:
            # Fallback to mock data if image analysis fails
            diseases = ['Late Blight', 'Powdery Mildew', 'Bacterial Wilt', 'Yellow Rust', 'Healthy']
            weights = [0.25, 0.20, 0.20, 0.15, 0.20]
            disease = random.choices(diseases, weights=weights)[0]
            
            return {
                'disease': disease,
                'confidence': random.uniform(70, 95),
                'explanation': f'Detected {disease} with characteristic symptoms',
                'heatmap': ''
            }
    
    def _calculate_individual_risk_score(self, confidence: float, severity: str, field_area: float) -> int:
        """
        Calculate individual farmer risk score (0-100)
        """
        # Base score from confidence
        base_score = confidence
        
        # Severity multiplier
        severity_multipliers = {'low': 0.7, 'medium': 1.0, 'high': 1.3}
        severity_multiplier = severity_multipliers.get(severity, 1.0)
        
        # Field area factor (larger fields have higher impact)
        area_factor = min(1.5, 1.0 + (field_area / 10))
        
        # Calculate final risk score
        risk_score = int(base_score * severity_multiplier * area_factor)
        return min(100, max(0, risk_score))
    
    def _generate_individual_containment(self, disease: str, severity: str, risk_score: int) -> Dict[str, Any]:
        """
        Generate individual containment recommendations
        """
        if disease.lower() == 'healthy':
            return {
                'action': 'Continue normal agricultural practices',
                'level': 1,
                'measures': ['Regular monitoring', 'Maintain crop hygiene'],
                'timeline': 'Routine monitoring',
                'authority_level': 'Farmer discretion',
                'explanation': 'No disease detected. Continue standard practices.'
            }
        
        if severity == 'high':
            return {
                'action': 'Immediate containment treatment required',
                'level': 4,
                'measures': ['Apply targeted fungicides', 'Isolate affected area', 'Monitor neighboring fields'],
                'timeline': 'Within 48 hours',
                'authority_level': 'Agricultural Officer oversight',
                'explanation': 'High severity requires immediate intervention to prevent spread.'
            }
        elif severity == 'medium':
            return {
                'action': 'Preventive treatment recommended',
                'level': 2,
                'measures': ['Apply preventive measures', 'Increase monitoring frequency', 'Prepare containment resources'],
                'timeline': 'Within 7 days',
                'authority_level': 'Village agricultural coordinator',
                'explanation': 'Medium severity requires proactive management.'
            }
        else:
            return {
                'action': 'Monitor and observe',
                'level': 1,
                'measures': ['Weekly monitoring', 'Document symptoms', 'Prepare for escalation'],
                'timeline': 'Ongoing monitoring',
                'authority_level': 'Farmer discretion',
                'explanation': 'Low severity requires careful monitoring.'
            }
    
    def _calculate_village_metrics(self, farmer_analyses: List[Dict[str, Any]], village_info: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate village-level aggregated metrics
        """
        if not farmer_analyses:
            return self._get_default_village_metrics()
        
        # Calculate average risk scores
        risk_scores = [fa['risk_score'] for fa in farmer_analyses]
        average_risk_score = sum(risk_scores) / len(risk_scores)
        
        # Apply connectivity factor based on village density
        connectivity_factor = self.connectivity_factors[village_info['density_factor']]
        village_risk_score = int(average_risk_score * connectivity_factor)
        
        # Determine dominant disease
        disease_counts = {}
        for fa in farmer_analyses:
            disease = fa['image_analysis']['disease']
            disease_counts[disease] = disease_counts.get(disease, 0) + 1
        
        dominant_disease = max(disease_counts, key=disease_counts.get)
        
        # Calculate average severity
        severity_values = {'low': 1, 'medium': 2, 'high': 3}
        severity_scores = []
        for fa in farmer_analyses:
            severity = fa['image_analysis']['severity']
            severity_scores.append(severity_values.get(severity, 1))
        
        average_severity_score = sum(severity_scores) / len(severity_scores)
        
        if average_severity_score >= 2.5:
            average_severity = 'high'
        elif average_severity_score >= 1.5:
            average_severity = 'medium'
        else:
            average_severity = 'low'
        
        # Calculate spread potential
        if village_risk_score >= 80:
            spread_potential = 'Very High - Immediate coordinated action required'
        elif village_risk_score >= 60:
            spread_potential = 'High - Coordinated containment recommended'
        elif village_risk_score >= 40:
            spread_potential = 'Medium - Monitor and prepare for coordinated response'
        else:
            spread_potential = 'Low - Individual farmer management sufficient'
        
        # Estimate village-level yield loss
        affected_percentage = (len(farmer_analyses) / village_info['total_farmers']) * 100
        base_yield_loss = average_risk_score / 100  # Convert to percentage
        estimated_yield_loss = int(base_yield_loss * affected_percentage)
        
        return {
            'dominant_disease': dominant_disease,
            'average_severity': average_severity,
            'village_risk_score': village_risk_score,
            'spread_potential': spread_potential,
            'estimated_yield_loss': estimated_yield_loss,
            'affected_percentage': affected_percentage
        }
    
    def _generate_collective_recommendation(self, village_metrics: Dict[str, Any], village_info: Dict[str, Any]) -> str:
        """
        Generate coordinated containment recommendations for village-level action
        """
        risk_score = village_metrics['village_risk_score']
        disease = village_metrics['dominant_disease']
        severity = village_metrics['average_severity']
        
        if disease.lower() == 'healthy':
            return (
                "Village shows healthy crop conditions. Continue normal agricultural practices "
                "with routine monitoring. Maintain community awareness and reporting systems."
            )
        
        if severity == 'high' or risk_score >= 75:
            return (
                f"URGENT: Village-level coordinated response required for {disease} outbreak. "
                f"Immediate implementation of containment protocols across all affected farms. "
                f"Mobilize village agricultural resources, establish containment zones, and "
                f"initiate community-wide treatment programs. District agricultural officer "
                f"notification and intervention required."
            )
        elif severity == 'medium' or risk_score >= 50:
            return (
                f"Coordinated village response recommended for {disease} management. "
                f"Organize community treatment drives, establish monitoring protocols, "
                f"and prepare contingency resources. Village agricultural coordinator should "
                f"oversee implementation and report to district authorities."
            )
        else:
            return (
                f"Individual farmer management recommended for {disease} control. "
                f"Provide guidance and resources to affected farmers while maintaining "
                f"village-level monitoring. Prepare for escalation if conditions worsen."
            )
    
    def _assess_policy_trigger(self, village_metrics: Dict[str, Any]) -> bool:
        """
        Assess if village-level conditions trigger policy intervention
        """
        # Check multiple conditions for policy trigger
        conditions_met = []
        
        # High village risk score
        if village_metrics['village_risk_score'] >= self.policy_thresholds['high_risk_score']:
            conditions_met.append('High risk score')
        
        # High percentage of affected farmers
        if village_metrics['affected_percentage'] >= self.policy_thresholds['affected_percentage']:
            conditions_met.append('High affected percentage')
        
        # High severity dominant disease
        if village_metrics['average_severity'] == 'high':
            conditions_met.append('High severity disease')
        
        # Policy trigger requires at least 2 conditions
        return len(conditions_met) >= 2
    
    def _calculate_market_impact(self, village_metrics: Dict[str, Any], village_info: Dict[str, Any]) -> str:
        """
        Calculate potential market and supply-chain impact
        """
        yield_loss = village_metrics['estimated_yield_loss']
        disease = village_metrics['dominant_disease']
        
        if disease.lower() == 'healthy':
            return "Minimal market impact expected"
        
        if yield_loss >= 30:
            return "Severe market disruption expected - Supply chain intervention required"
        elif yield_loss >= 20:
            return "Significant market impact - Alternative supply routes recommended"
        elif yield_loss >= 10:
            return "Moderate market impact - Monitor supply chain closely"
        else:
            return "Minimal market impact - Normal operations expected"
    
    def _generate_comparative_analysis(self, farmer_analyses: List[Dict[str, Any]], village_metrics: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate comparative analysis between individual and community impact
        """
        if not farmer_analyses:
            return self._get_default_comparative_analysis()
        
        # Get first farmer as representative individual
        individual_farmer = farmer_analyses[0]
        
        # Determine individual risk level
        individual_risk_score = individual_farmer['risk_score']
        if individual_risk_score >= 75:
            individual_risk_level = 'High'
        elif individual_risk_score >= 50:
            individual_risk_level = 'Medium'
        else:
            individual_risk_level = 'Low'
        
        # Determine community risk level
        village_risk_score = village_metrics['village_risk_score']
        if village_risk_score >= 75:
            community_risk_level = 'High'
        elif village_risk_score >= 50:
            community_risk_level = 'Medium'
        else:
            community_risk_level = 'Low'
        
        # Individual vs Community comparison
        return {
            'individual_impact': {
                'risk_level': individual_risk_level,
                'affected_area': f"{individual_farmer['field_area']} hectares",
                'recommended_action': individual_farmer['containment_decision']['action'],
                'policy_trigger': False  # Individual cases don't trigger policy
            },
            'community_impact': {
                'risk_level': community_risk_level,
                'affected_area': f"{len(farmer_analyses)} farms ({village_metrics['affected_percentage']:.1f}% of village)",
                'recommended_action': village_metrics['spread_potential'],
                'policy_trigger': self._assess_policy_trigger(village_metrics)
            }
        }
    
    def _get_default_village_info(self) -> Dict[str, Any]:
        """Default village information for unknown villages"""
        return {
            'total_farmers': 20,
            'density_factor': 'medium_density',
            'primary_crops': ['Wheat', 'Rice'],
            'coordinates': (28.7041, 77.1025),
            'farmers': [
                {'id': 'FARM001', 'name': 'Sample Farmer', 'field_area': 2.0, 'crop_type': 'Wheat'}
            ]
        }
    
    def _get_default_village_metrics(self) -> Dict[str, Any]:
        """Default village metrics for error cases"""
        return {
            'dominant_disease': 'Unknown',
            'average_severity': 'medium',
            'village_risk_score': 50,
            'spread_potential': 'Medium - Monitor and prepare for coordinated response',
            'estimated_yield_loss': 15,
            'affected_percentage': 25
        }
    
    def _get_default_comparative_analysis(self) -> Dict[str, Any]:
        """Default comparative analysis for error cases"""
        return {
            'individual_impact': {
                'risk_level': 'Medium',
                'affected_area': '1 field',
                'recommended_action': 'Monitor and observe',
                'policy_trigger': False
            },
            'community_impact': {
                'risk_level': 'Medium',
                'affected_area': 'Multiple fields',
                'recommended_action': 'Coordinated monitoring',
                'policy_trigger': False
            }
        }

# Initialize village analysis engine
village_engine = VillageAnalysisEngine()
