import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../data/mock_data.dart';
import '../widgets/common_widgets.dart';

class InsuranceScreen extends StatelessWidget {
  const InsuranceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 16),
              const Text(
                'Insurance',
                style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 20),
              _buildCoverageCard(),
              const SizedBox(height: 16),
              _buildPremiumBreakdown(),
              const SectionHeader(title: 'Parametric Triggers'),
              _buildTriggers(),
              const SectionHeader(title: 'Recent Claims'),
              _buildClaimsList(),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCoverageCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.shield_rounded, color: Colors.white, size: 20),
              ),
              const SizedBox(width: 12),
              const Text(
                'Active Coverage',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  '${MockData.policyDaysRemaining} days left',
                  style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: Colors.white,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'Coverage Ceiling',
            style: TextStyle(
              fontSize: 12,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '\u20B9${MockData.coverageCeiling.toInt()}',
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '70% of avg weekly income (\u20B9${MockData.avgWeeklyIncome.toInt()})',
            style: const TextStyle(
              fontSize: 12,
              color: Colors.white60,
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Weekly Premium',
                  style: TextStyle(fontSize: 13, color: Colors.white70),
                ),
                Text(
                  '\u20B9${MockData.weeklyPremium.toInt()}/week',
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPremiumBreakdown() {
    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Premium Breakdown',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: AppColors.textPrimary,
            ),
          ),
          const SizedBox(height: 16),
          _premiumRow('Base Premium', '\u20B9${MockData.basePremium.toInt()}', AppColors.textSecondary),
          _premiumRow('Zone Risk (Adyar)', '+\u20B9${MockData.zoneRiskAdjustment.toInt()}', AppColors.warning),
          _premiumRow('Weather Forecast', '+\u20B9${MockData.weatherAdjustment.toInt()}', AppColors.accent),
          const Divider(color: AppColors.textMuted, height: 24),
          _premiumRow('Total Weekly', '\u20B9${MockData.weeklyPremium.toInt()}', AppColors.primary, bold: true),
        ],
      ),
    );
  }

  Widget _premiumRow(String label, String value, Color valueColor, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          Text(
            value,
            style: TextStyle(
              fontSize: 14,
              fontWeight: bold ? FontWeight.w700 : FontWeight.w500,
              color: valueColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTriggers() {
    final triggers = [
      {'icon': Icons.water_drop_rounded, 'label': 'Heavy Rain', 'threshold': '>40mm / 6hrs', 'color': AppColors.accent},
      {'icon': Icons.air_rounded, 'label': 'Severe AQI', 'threshold': '>350 / 3hrs', 'color': AppColors.warning},
      {'icon': Icons.waves_rounded, 'label': 'Flooding', 'threshold': 'Active alert', 'color': AppColors.danger},
      {'icon': Icons.block_rounded, 'label': 'Civic Disruption', 'threshold': 'Zone closure', 'color': AppColors.primary},
      {'icon': Icons.thermostat_rounded, 'label': 'Extreme Heat', 'threshold': '>43°C', 'color': AppColors.warning},
    ];

    return Column(
      children: triggers.map((t) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: GlassCard(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: (t['color'] as Color).withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(t['icon'] as IconData, color: t['color'] as Color, size: 18),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      t['label'] as String,
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary),
                    ),
                    Text(
                      t['threshold'] as String,
                      style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                    ),
                  ],
                ),
                const Spacer(),
                const StatusChip(label: 'Monitored', color: AppColors.success),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildClaimsList() {
    return Column(
      children: MockData.claimsHistory.map((claim) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: GlassCard(
            padding: const EdgeInsets.all(14),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppColors.success.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.check_circle_rounded, color: AppColors.success, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        claim['type'] as String,
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary),
                      ),
                      Text(
                        '${claim['date']} - ${claim['hours']}hrs disruption',
                        style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                ),
                Text(
                  '+\u20B9${(claim['amount'] as double).toInt()}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: AppColors.success,
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }
}
