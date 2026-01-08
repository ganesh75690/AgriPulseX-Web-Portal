"""
Historical Analysis and Trend Comparison System
Stores and analyzes agricultural disease detection history
"""

import json
import os
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum

class TrendDirection(Enum):
    IMPROVING = "improving"
    WORSENING = "worsening"
    STABLE = "stable"
    INSUFFICIENT_DATA = "insufficient_data"

@dataclass
class HistoricalRecord:
    """Individual historical analysis record"""
    analysis_id: str
    timestamp: str
    farmer_id: str
    region: str
    disease: str
    severity: str
    confidence: str
    severity_score: int  # 1=Low, 2=Medium, 3=High
    confidence_numeric: int  # 0-100

class HistoricalAnalysisEngine:
    """
    Manages historical data and provides trend analysis
    """
    
    def __init__(self, storage_path: str = "historical_data"):
        self.storage_path = storage_path
        self._ensure_storage_directory()
        
    def _ensure_storage_directory(self):
        """Create storage directory if it doesn't exist"""
        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path)
    
    def _get_farmer_file_path(self, farmer_id: str) -> str:
        """Get file path for farmer's historical data"""
        safe_farmer_id = farmer_id.replace("/", "_").replace("\\", "_")
        return os.path.join(self.storage_path, f"{safe_farmer_id}.json")
    
    def _get_region_file_path(self, region: str) -> str:
        """Get file path for regional historical data"""
        safe_region = region.replace("/", "_").replace("\\", "_").replace(" ", "_")
        return os.path.join(self.storage_path, f"region_{safe_region}.json")
    
    def _severity_to_score(self, severity: str) -> int:
        """Convert severity string to numeric score"""
        severity_map = {"Low": 1, "Medium": 2, "High": 3}
        return severity_map.get(severity, 2)  # Default to Medium
    
    def _confidence_to_numeric(self, confidence: str) -> int:
        """Extract numeric confidence from percentage string"""
        return int(confidence.replace("%", ""))
    
    def store_analysis(self, analysis_data: Dict[str, Any]) -> bool:
        """
        Store analysis results in historical database
        
        Args:
            analysis_data: Complete unified analysis results
            
        Returns:
            True if stored successfully, False otherwise
        """
        try:
            # Create historical record
            record = HistoricalRecord(
                analysis_id=analysis_data['analysis_id'],
                timestamp=analysis_data['timestamp'],
                farmer_id=analysis_data.get('farmer_id', 'unknown'),
                region=analysis_data.get('region', 'unknown'),
                disease=analysis_data['image_analysis']['disease'],
                severity=analysis_data['image_analysis']['severity'],
                confidence=analysis_data['image_analysis']['confidence'],
                severity_score=self._severity_to_score(analysis_data['image_analysis']['severity']),
                confidence_numeric=self._confidence_to_numeric(analysis_data['image_analysis']['confidence'])
            )
            
            # Store in farmer-specific file
            farmer_file = self._get_farmer_file_path(record.farmer_id)
            self._append_record_to_file(farmer_file, record)
            
            # Store in regional file
            region_file = self._get_region_file_path(record.region)
            self._append_record_to_file(region_file, record)
            
            return True
            
        except Exception as e:
            print(f"Error storing analysis: {e}")
            return False
    
    def _append_record_to_file(self, file_path: str, record: HistoricalRecord):
        """Append record to JSON file"""
        records = []
        
        # Load existing records
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as f:
                    records = json.load(f)
            except (json.JSONDecodeError, FileNotFoundError):
                records = []
        
        # Add new record
        records.append(asdict(record))
        
        # Save back to file
        with open(file_path, 'w') as f:
            json.dump(records, f, indent=2)
    
    def get_farmer_history(self, farmer_id: str, limit: int = 10) -> List[HistoricalRecord]:
        """
        Get historical records for a specific farmer
        
        Args:
            farmer_id: Farmer identifier
            limit: Maximum number of records to return
            
        Returns:
            List of historical records sorted by timestamp (newest first)
        """
        file_path = self._get_farmer_file_path(farmer_id)
        
        if not os.path.exists(file_path):
            return []
        
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Convert to HistoricalRecord objects
            records = [HistoricalRecord(**record) for record in data]
            
            # Sort by timestamp (newest first) and limit
            records.sort(key=lambda x: x.timestamp, reverse=True)
            return records[:limit]
            
        except (json.JSONDecodeError, FileNotFoundError, TypeError):
            return []
    
    def get_region_history(self, region: str, days: int = 30) -> List[HistoricalRecord]:
        """
        Get historical records for a specific region within time period
        
        Args:
            region: Region identifier
            days: Number of days to look back
            
        Returns:
            List of historical records within the time period
        """
        file_path = self._get_region_file_path(region)
        
        if not os.path.exists(file_path):
            return []
        
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Convert to HistoricalRecord objects
            records = [HistoricalRecord(**record) for record in data]
            
            # Filter by time period
            cutoff_date = datetime.now() - timedelta(days=days)
            filtered_records = []
            
            for record in records:
                record_date = datetime.fromisoformat(record.timestamp.replace('Z', '+00:00'))
                if record_date >= cutoff_date:
                    filtered_records.append(record)
            
            # Sort by timestamp (newest first)
            filtered_records.sort(key=lambda x: x.timestamp, reverse=True)
            return filtered_records
            
        except (json.JSONDecodeError, FileNotFoundError, TypeError):
            return []
    
    def analyze_trend(self, records: List[HistoricalRecord]) -> Dict[str, Any]:
        """
        Analyze trend from historical records
        
        Args:
            records: List of historical records
            
        Returns:
            Trend analysis results
        """
        if len(records) < 2:
            return {
                "trend": TrendDirection.INSUFFICIENT_DATA.value,
                "message": "Insufficient data for trend analysis",
                "data_points": len(records),
                "average_confidence": records[0].confidence_numeric if records else 0,
                "most_common_disease": records[0].disease if records else "None",
                "time_span_days": 0
            }
        
        # Sort records by timestamp (oldest first for trend analysis)
        sorted_records = sorted(records, key=lambda x: x.timestamp)
        
        # Calculate trend based on severity scores
        severity_scores = [r.severity_score for r in sorted_records]
        
        # Simple trend calculation
        if len(severity_scores) >= 3:
            # Compare recent average with older average
            recent_avg = sum(severity_scores[-3:]) / 3
            older_avg = sum(severity_scores[:-3]) / len(severity_scores[:-3]) if len(severity_scores) > 3 else severity_scores[0]
        else:
            # For 2 records, just compare them
            recent_avg = severity_scores[-1]
            older_avg = severity_scores[0]
        
        # Determine trend
        if recent_avg < older_avg:
            trend = TrendDirection.IMPROVING
            message = f"Disease severity is improving (from {older_avg:.1f} to {recent_avg:.1f})"
        elif recent_avg > older_avg:
            trend = TrendDirection.WORSENING
            message = f"Disease severity is worsening (from {older_avg:.1f} to {recent_avg:.1f})"
        else:
            trend = TrendDirection.STABLE
            message = f"Disease severity is stable (average: {recent_avg:.1f})"
        
        # Calculate additional metrics
        confidence_trend = [r.confidence_numeric for r in sorted_records]
        avg_confidence = sum(confidence_trend) / len(confidence_trend)
        
        # Disease frequency analysis
        disease_counts = {}
        for record in sorted_records:
            disease_counts[record.disease] = disease_counts.get(record.disease, 0) + 1
        
        most_common_disease = max(disease_counts.items(), key=lambda x: x[1])[0] if disease_counts else "None"
        
        return {
            "trend": trend.value,
            "message": message,
            "data_points": len(records),
            "severity_change": recent_avg - older_avg,
            "average_confidence": round(avg_confidence, 1),
            "most_common_disease": most_common_disease,
            "disease_distribution": disease_counts,
            "time_span_days": self._calculate_time_span(sorted_records)
        }
    
    def _calculate_time_span(self, records: List[HistoricalRecord]) -> int:
        """Calculate time span in days between first and last record"""
        if len(records) < 2:
            return 0
        
        first_date = datetime.fromisoformat(records[0].timestamp.replace('Z', '+00:00'))
        last_date = datetime.fromisoformat(records[-1].timestamp.replace('Z', '+00:00'))
        
        return (last_date - first_date).days
    
    def get_farmer_summary(self, farmer_id: str) -> Dict[str, Any]:
        """
        Get comprehensive summary for a farmer
        
        Args:
            farmer_id: Farmer identifier
            
        Returns:
            Complete farmer summary with trends
        """
        records = self.get_farmer_history(farmer_id, limit=50)  # Get more records for analysis
        
        if not records:
            return {
                "farmer_id": farmer_id,
                "total_analyses": 0,
                "trend": TrendDirection.INSUFFICIENT_DATA.value,
                "message": "No historical data available"
            }
        
        trend_analysis = self.analyze_trend(records)
        
        # Calculate additional summary metrics
        total_analyses = len(records)
        healthy_count = sum(1 for r in records if r.disease == "Healthy")
        disease_count = total_analyses - healthy_count
        
        # Recent activity (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_records = [r for r in records 
                         if datetime.fromisoformat(r.timestamp.replace('Z', '+00:00')) >= thirty_days_ago]
        
        return {
            "farmer_id": farmer_id,
            "total_analyses": total_analyses,
            "recent_analyses_30_days": len(recent_records),
            "healthy_analyses": healthy_count,
            "disease_analyses": disease_count,
            "health_rate": round((healthy_count / total_analyses) * 100, 1) if total_analyses > 0 else 0,
            "trend": trend_analysis["trend"],
            "trend_message": trend_analysis["message"],
            "most_common_disease": trend_analysis["most_common_disease"],
            "average_confidence": trend_analysis["average_confidence"],
            "last_analysis": records[0].timestamp if records else None,
            "analysis_span_days": trend_analysis["time_span_days"]
        }
    
    def get_regional_summary(self, region: str, days: int = 30) -> Dict[str, Any]:
        """
        Get regional summary for specified time period
        
        Args:
            region: Region identifier
            days: Number of days to analyze
            
        Returns:
            Complete regional summary
        """
        records = self.get_region_history(region, days)
        
        if not records:
            return {
                "region": region,
                "time_period_days": days,
                "total_analyses": 0,
                "message": f"No data available for the last {days} days"
            }
        
        trend_analysis = self.analyze_trend(records)
        
        # Regional metrics
        total_analyses = len(records)
        unique_farmers = len(set(r.farmer_id for r in records))
        healthy_count = sum(1 for r in records if r.disease == "Healthy")
        
        # Disease breakdown
        disease_breakdown = {}
        for record in records:
            disease_breakdown[record.disease] = disease_breakdown.get(record.disease, 0) + 1
        
        # Severity breakdown
        severity_breakdown = {"Low": 0, "Medium": 0, "High": 0}
        for record in records:
            severity_breakdown[record.severity] += 1
        
        return {
            "region": region,
            "time_period_days": days,
            "total_analyses": total_analyses,
            "unique_farmers": unique_farmers,
            "healthy_analyses": healthy_count,
            "disease_analyses": total_analyses - healthy_count,
            "regional_health_rate": round((healthy_count / total_analyses) * 100, 1) if total_analyses > 0 else 0,
            "trend": trend_analysis["trend"],
            "trend_message": trend_analysis["message"],
            "disease_breakdown": disease_breakdown,
            "severity_breakdown": severity_breakdown,
            "average_confidence": trend_analysis["average_confidence"]
        }

# Global instance for use across the application
historical_engine = HistoricalAnalysisEngine()
