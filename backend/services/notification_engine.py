"""
GigKavach — Notification Engine
Handles outbound alerts to workers for risk scenarios and claim statuses.
"""
from datetime import datetime

class NotificationEngine:
    """Manages real-time alerts for the platform."""
    
    def __init__(self):
        pass

    def emit_risk_alert(self, worker_id: str, zone: str, hazard_type: str, severity: str):
        """Sends a notification directly related to geometric risk."""
        payload = {
            "type": "geo_risk",
            "worker_id": worker_id,
            "title": f"⚠️ {severity.upper()} Warning in {zone}",
            "message": f"Our Parametric Engine detects {hazard_type} anomalies. Shift to safe zones immediately.",
            "timestamp": datetime.now().isoformat()
        }
        self._broadcast(payload)
    
    def emit_claim_status(self, worker_id: str, claim_id: str, status: str, amount: float):
        """Notifies worker about autonomous claim actions."""
        payload = {
            "type": "claim_update",
            "worker_id": worker_id,
            "title": "💸 Zero-Touch Claim Processed",
            "message": f"Claim {claim_id} processed as {status}. ₹{amount} has been dispatched to your digital wallet via Parametric Auth.",
            "timestamp": datetime.now().isoformat()
        }
        self._broadcast(payload)

    def _broadcast(self, payload: dict):
        """
        In production, this interfaces directly with Supabase Realtime Broadcast or Firebase Cloud Messaging.
        For localized OS, it dumps to API logger trace. 
        """
        print(f"\n[BROADCAST NOTIFICATION] To {payload['worker_id']}: {payload['title']} - {payload['message']}\n")

# Global singleton
notifier = NotificationEngine()
