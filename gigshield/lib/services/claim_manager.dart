import 'dart:math';
import 'package:flutter/foundation.dart';
import 'supabase_service.dart';

class ClaimEvent {
  final String claimId;
  final String triggerId;
  final String label;
  final DateTime timestamp;
  final String status;
  final double payoutAmount;
  final String? rejectionReason;
  final bool isSustained;

  ClaimEvent({
    required this.claimId,
    required this.triggerId,
    required this.label,
    required this.timestamp,
    required this.status,
    required this.payoutAmount,
    this.rejectionReason,
    this.isSustained = false,
  });

  factory ClaimEvent.fromJson(Map<String, dynamic> json) {
    return ClaimEvent(
      claimId: json['claim_id'] ?? '',
      triggerId: json['trigger_type'] ?? '',
      label: json['trigger_label'] ?? '',
      timestamp: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      status: json['status'] ?? 'processing',
      payoutAmount: (json['payout_amount'] ?? 0).toDouble(),
      rejectionReason: json['rejection_reason'],
      isSustained: json['is_sustained'] ?? false,
    );
  }
}

class ClaimManager extends ChangeNotifier {
  static final ClaimManager _instance = ClaimManager._internal();
  factory ClaimManager() => _instance;
  ClaimManager._internal();

  List<ClaimEvent> _claims = [];
  List<ClaimEvent> get claims => _claims;

  bool _isSyncing = false;
  bool get isSyncing => _isSyncing;

  // Track the consecutive days of disruptions
  // Map of Trigger ID -> Number of consecutive days
  final Map<String, int> _consecutiveHazards = {};

  Future<void> fetchClaims(String workerId) async {
    if (!SupabaseService.isConfigured) return;

    _isSyncing = true;
    notifyListeners();

    try {
      final response = await SupabaseService.client
          .from('claims')
          .select()
          .eq('worker_id', workerId)
          .order('created_at', ascending: false);

      _claims = (response as List).map((e) => ClaimEvent.fromJson(e)).toList();
    } catch (e) {
      debugPrint('Error fetching claims: $e');
    } finally {
      _isSyncing = false;
      notifyListeners();
    }
  }

  /// Evaluates and submits a new parametric claim
  /// If the same trigger has happened 3+ days in a row, it becomes a Sustained Claim.
  Future<ClaimEvent?> submitParametricClaim({
    required String workerId,
    required String triggerId,
    required String triggerLabel,
    required String triggerData,
    required Map<String, dynamic> zoneInfo,
    required double baseHourlyRate,
    required double coverageMultiplier,
  }) async {
    // 1. Detect if this is a sustained hazard
    int daysActive = (_consecutiveHazards[triggerId] ?? 0) + 1;
    _consecutiveHazards[triggerId] = daysActive;

    bool isSustained = daysActive >= 3;
    
    // Batch validation: prevent filing multiple claims for the same event in one day
    final today = DateTime.now().toIso8601String().split('T')[0];
    final existingToday = _claims.where((c) => 
      c.triggerId == triggerId && 
      c.timestamp.toIso8601String().startsWith(today)
    ).toList();

    if (existingToday.isNotEmpty) {
      debugPrint('Claim already exists for $triggerId today. Skipping.');
      return null; // Suppress duplicate claim
    }

    // 2. Local mock generation & scoring
    final claimId = 'CLM-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}';
    
    // Mocking an ML model's confidence logic: 
    // Sustained events have higher confidence because they are systemic.
    double confidence = 0.65 + (Random().nextDouble() * 0.25);
    if (isSustained) confidence += 0.15;
    
    confidence = min(1.0, confidence);

    // 3. Payout Calculation
    // Normal claims max out at ~4-6 hours of lost time.
    // Sustained claims bulk upwards (e.g. 10 hours equivalent per day due to fatigue/opportunity cost).
    int disruptedHours = isSustained ? 10 : 5;
    double payoutAmount = disruptedHours * baseHourlyRate * coverageMultiplier;

    String status = confidence > 0.85 ? 'approved' : 'validating';

    final newClaim = ClaimEvent(
      claimId: claimId,
      triggerId: triggerId,
      label: triggerLabel,
      timestamp: DateTime.now(),
      status: status,
      payoutAmount: payoutAmount,
      isSustained: isSustained,
    );

    _claims.insert(0, newClaim);
    notifyListeners();

    // 4. Sync immediately with Supabase Backend if configured
    if (SupabaseService.isConfigured) {
      try {
        final payload = {
          'claim_id': claimId,
          'worker_id': workerId,
          'trigger_type': triggerId,
          'trigger_label': triggerLabel,
          'trigger_data': triggerData,
          'zone': zoneInfo['zone'] ?? 'Unknown',
          'city': zoneInfo['city'] ?? 'Unknown',
          'status': status,
          'confidence_score': (confidence * 100).toInt(),
          'inactive_hours': disruptedHours,
          'hourly_rate': baseHourlyRate,
          'payout_amount': payoutAmount,
          'is_sustained': isSustained,
          'created_at': DateTime.now().toIso8601String(),
        };

        await SupabaseService.client.from('claims').insert(payload);
        debugPrint('Claim $claimId successfully synced.');
      } catch (e) {
        debugPrint('Failed to sync claim $claimId: $e');
      }
    }

    return newClaim;
  }
}
