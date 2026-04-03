import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_theme.dart';
import '../widgets/common_widgets.dart';
import '../services/supabase_service.dart';
import '../services/premium_engine.dart';

class RegistrationScreen extends StatefulWidget {
  final VoidCallback onRegistrationComplete;

  const RegistrationScreen({super.key, required this.onRegistrationComplete});

  @override
  State<RegistrationScreen> createState() => _RegistrationScreenState();
}

class _RegistrationScreenState extends State<RegistrationScreen>
    with TickerProviderStateMixin {
  int _currentStep = 0;
  final PageController _pageController = PageController();

  // Step 1: Phone
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _otpSent = false;
  bool _otpVerified = false;

  // Step 2: Profile
  final _nameController = TextEditingController();
  String _selectedCity = 'Chennai';
  String _selectedPlatform = 'Swiggy';
  String _vehicleType = 'Bike';

  // Work Details (feeds into premium engine)
  double _dailyHours = 8;
  String _weeklyIncomeRange = '₹3000-5000';
  bool _hadPriorInsurance = false;
  final List<String> _incomeRanges = ['₹1000-3000', '₹3000-5000', '₹5000-8000', '₹8000+'];

  // Step 3: Zone
  String _selectedZone = 'Adyar';

  // Step 4: AI Premium Output
  bool _isCalculatingPremium = false;
  PremiumResult? _calculatedPremium;
  int _calculationStep = 0;

  final List<String> _cities = ['Chennai', 'Delhi', 'Mumbai'];
  final List<String> _platforms = ['Swiggy', 'Zomato'];
  final List<String> _vehicles = ['Bike', 'Scooter', 'Bicycle'];
  final Map<String, List<String>> _cityZones = {
    'Chennai': [
      'Adyar',
      'Velachery',
      'T. Nagar',
      'Mylapore',
      'Anna Nagar',
      'Guindy',
      'Porur',
      'Tambaram',
    ],
    'Delhi': [
      'Connaught Place',
      'Dwarka',
      'Rohini',
      'Saket',
      'Lajpat Nagar',
      'Karol Bagh',
    ],
    'Mumbai': [
      'Andheri',
      'Bandra',
      'Dadar',
      'Borivali',
      'Kurla',
      'Goregaon',
      'Powai',
    ],
  };

  late AnimationController _fadeController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    )..forward();
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeOut,
    );
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _phoneController.dispose();
    _otpController.dispose();
    _nameController.dispose();
    _pageController.dispose();
    super.dispose();
  }

  bool _isRegistering = false;

  void _nextStep() async {
    if (_currentStep < 3) {
      setState(() => _currentStep++);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      if (_isRegistering) return;
      
      setState(() => _isRegistering = true);
      
      if (SupabaseService.isConfigured) {
        try {
          final workerId = '\${_nameController.text.split(' ')[0]}_${_phoneController.text.substring(6)}';
          
          final incomeMap = {'₹1000-3000': 2000, '₹3000-5000': 4000, '₹5000-8000': 6500, '₹8000+': 9000};
          final weeklyIncome = incomeMap[_weeklyIncomeRange] ?? 4000;

          await SupabaseService.client.from('workers').insert({
            'worker_id': workerId,
            'city': _selectedCity,
            'zone': _selectedZone,
            'primary_platform': _selectedPlatform,
            'vehicle_type': _vehicleType,
            'trust_score': _hadPriorInsurance ? 90 : 100,
            'avg_daily_hours': _dailyHours,
            'avg_daily_income': (weeklyIncome / 6).round(),
            'avg_weekly_income': weeklyIncome,
          });

          await SupabaseService.client.from('policies').insert({
            'policy_id': 'POL-${DateTime.now().millisecondsSinceEpoch.toString().substring(5)}',
            'worker_id': workerId,
            'tier': 'Dynamic AI Tier',
            'weekly_premium': _calculatedPremium?.totalPremium ?? 45,
            'coverage_percentage': 85,
            'coverage_ceiling': (weeklyIncome * 0.85).round(),
            'start_date': DateTime.now().toIso8601String().split('T')[0],
            'end_date': DateTime.now().add(const Duration(days: 90)).toIso8601String().split('T')[0],
            'status': 'Active',
            'premium_breakdown': {'base': 25, 'factors': _calculatedPremium?.factors.length ?? 0}
          });
        } catch (e) {
          debugPrint('Registration sync error: \$e');
        }
      }

      setState(() => _isRegistering = false);
      widget.onRegistrationComplete();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
      _pageController.animateToPage(
        _currentStep,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: SafeArea(
        child: FadeTransition(
          opacity: _fadeAnimation,
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    Row(
                      children: [
                        if (_currentStep > 0)
                          GestureDetector(
                            onTap: _prevStep,
                            child: Container(
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: AppColors.bgCard,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(
                                Icons.arrow_back_rounded,
                                color: AppColors.textSecondary,
                                size: 20,
                              ),
                            ),
                          ),
                        if (_currentStep > 0) const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _stepTitle,
                                style: const TextStyle(
                                  fontSize: 22,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              Text(
                                _stepSubtitle,
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                                style: const TextStyle(
                                  fontSize: 13,
                                  color: AppColors.textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            'Step ${_currentStep + 1}/4',
                            style: const TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: AppColors.primary,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Progress bar
                    Row(
                      children: List.generate(4, (i) {
                        return Expanded(
                          child: Container(
                            margin: EdgeInsets.only(right: i < 3 ? 4 : 0),
                            height: 4,
                            decoration: BoxDecoration(
                              color: i <= _currentStep
                                  ? AppColors.primary
                                  : AppColors.textMuted.withValues(alpha: 0.3),
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                        );
                      }),
                    ),
                  ],
                ),
              ),

              // Pages
              Expanded(
                child: PageView(
                  controller: _pageController,
                  physics: const NeverScrollableScrollPhysics(),
                  children: [
                    _buildPhoneStep(),
                    _buildProfileStep(),
                    _buildZoneStep(),
                    _buildPlanStep(),
                  ],
                ),
              ),

              // Continue button
              Padding(
                padding: const EdgeInsets.all(20),
                child: SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: _canProceed ? _nextStep : null,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      disabledBackgroundColor: AppColors.textMuted.withValues(
                        alpha: 0.3,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                      elevation: 0,
                    ),
                    child: _isRegistering
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                          )
                        : Text(
                            _currentStep == 3 ? 'Start Protection' : 'Continue',
                            style: const TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String get _stepTitle {
    switch (_currentStep) {
      case 0:
        return 'Verify Phone';
      case 1:
        return 'Your Profile';
      case 2:
        return 'Working Zone';
      case 3:
        return 'AI Premium Computation';
      default:
        return '';
    }
  }

  String get _stepSubtitle {
    switch (_currentStep) {
      case 0:
        return 'We\'ll send you an OTP to verify';
      case 1:
        return 'Tell us about yourself';
      case 2:
        return 'Select your primary working zone';
      case 3:
        return 'Generating your personalized pricing';
      default:
        return '';
    }
  }

  bool get _canProceed {
    switch (_currentStep) {
      case 0:
        return _otpVerified;
      case 1:
        return _nameController.text.length >= 2;
      case 2:
        return _selectedZone.isNotEmpty;
      case 3:
        return _calculatedPremium != null;
      default:
        return false;
    }
  }

  // ─── Step 1: Phone Verification ─────────────────────────────────

  Widget _buildPhoneStep() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 20),
          // Phone icon
          Center(
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(24),
              ),
              child: const Icon(
                Icons.phone_android_rounded,
                color: Colors.white,
                size: 36,
              ),
            ),
          ),
          const SizedBox(height: 32),

          const Text(
            'Phone Number',
            style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
          ),
          const SizedBox(height: 8),
          Container(
            decoration: BoxDecoration(
              color: AppColors.bgCard,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: AppColors.textMuted.withValues(alpha: 0.3),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 16,
                  ),
                  decoration: BoxDecoration(
                    border: Border(
                      right: BorderSide(
                        color: AppColors.textMuted.withValues(alpha: 0.3),
                      ),
                    ),
                  ),
                  child: const Text(
                    '+91',
                    style: TextStyle(
                      fontSize: 15,
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Expanded(
                  child: TextField(
                    controller: _phoneController,
                    keyboardType: TextInputType.phone,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(10),
                    ],
                    style: const TextStyle(
                      fontSize: 15,
                      color: AppColors.textPrimary,
                    ),
                    decoration: const InputDecoration(
                      hintText: 'Enter 10-digit number',
                      hintStyle: TextStyle(color: AppColors.textMuted),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 16,
                      ),
                    ),
                    onChanged: (_) => setState(() {}),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),

          if (!_otpSent)
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: _phoneController.text.length == 10
                    ? () {
                        setState(() => _otpSent = true);
                      }
                    : null,
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: AppColors.primary),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: const Text(
                  'Send OTP',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),

          if (_otpSent && !_otpVerified) ...[
            const SizedBox(height: 20),
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.sms_rounded,
                        color: AppColors.accent,
                        size: 18,
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'OTP Sent!',
                        style: TextStyle(
                          color: AppColors.accent,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'to +91 ${_phoneController.text}',
                        style: const TextStyle(
                          color: AppColors.textMuted,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    controller: _otpController,
                    keyboardType: TextInputType.number,
                    inputFormatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(6),
                    ],
                    style: const TextStyle(
                      fontSize: 20,
                      color: AppColors.textPrimary,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 8,
                    ),
                    textAlign: TextAlign.center,
                    decoration: const InputDecoration(
                      hintText: '• • • • • •',
                      hintStyle: TextStyle(
                        color: AppColors.textMuted,
                        letterSpacing: 8,
                      ),
                      border: InputBorder.none,
                    ),
                    onChanged: (val) {
                      if (val.length == 6) {
                        setState(() => _otpVerified = true);
                      }
                    },
                  ),
                  const SizedBox(height: 4),
                  const Center(
                    child: Text(
                      'Enter any 6-digit code (demo mode)',
                      style: TextStyle(
                        fontSize: 11,
                        color: AppColors.textMuted,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],

          if (_otpVerified) ...[
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.success.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: AppColors.success.withValues(alpha: 0.3),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.success.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.check_circle_rounded,
                      color: AppColors.success,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Phone Verified!',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: AppColors.success,
                        ),
                      ),
                      Text(
                        'Your number is now linked',
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ─── Step 2: Profile ────────────────────────────────────────────

  Widget _buildProfileStep() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 12),
          _buildInputField('Full Name', _nameController, Icons.person_rounded),
          const SizedBox(height: 16),
          _buildDropdownField(
            'City',
            _selectedCity,
            _cities,
            Icons.location_city_rounded,
            (v) => setState(() {
              _selectedCity = v!;
              _selectedZone = _cityZones[_selectedCity]!.first;
            }),
          ),
          const SizedBox(height: 16),
          _buildDropdownField(
            'Primary Platform',
            _selectedPlatform,
            _platforms,
            Icons.delivery_dining_rounded,
            (v) => setState(() => _selectedPlatform = v!),
          ),
          const SizedBox(height: 16),
          _buildDropdownField(
            'Vehicle Type',
            _vehicleType,
            _vehicles,
            Icons.two_wheeler_rounded,
            (v) => setState(() => _vehicleType = v!),
          ),
          const SizedBox(height: 24),
          // Divider
          Container(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                Container(width: 30, height: 1, color: AppColors.textMuted.withValues(alpha: 0.3)),
                const SizedBox(width: 8),
                const Text('Work Details', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textMuted)),
                const SizedBox(width: 8),
                Expanded(child: Container(height: 1, color: AppColors.textMuted.withValues(alpha: 0.3))),
              ],
            ),
          ),
          const SizedBox(height: 8),

          // Daily Working Hours
          const Text('Average Daily Working Hours', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: AppColors.bgCard,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppColors.textMuted.withValues(alpha: 0.3)),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.schedule_rounded, color: AppColors.primary, size: 20),
                        const SizedBox(width: 8),
                        Text('${_dailyHours.toInt()} hours/day', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: AppColors.accent.withValues(alpha: 0.15), borderRadius: BorderRadius.circular(8)),
                      child: Text(_dailyHours >= 10 ? 'Heavy' : _dailyHours >= 6 ? 'Regular' : 'Part-time', style: TextStyle(fontSize: 10, fontWeight: FontWeight.w600, color: AppColors.accent)),
                    ),
                  ],
                ),
                Slider(
                  value: _dailyHours,
                  min: 2,
                  max: 14,
                  divisions: 12,
                  activeColor: AppColors.primary,
                  inactiveColor: AppColors.textMuted.withValues(alpha: 0.2),
                  onChanged: (v) => setState(() => _dailyHours = v),
                ),
                const Text('This helps us estimate your income lost during disruptions', style: TextStyle(fontSize: 10, color: AppColors.textMuted)),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Weekly Income
          _buildDropdownField(
            'Estimated Weekly Income',
            _weeklyIncomeRange,
            _incomeRanges,
            Icons.account_balance_wallet_rounded,
            (v) => setState(() => _weeklyIncomeRange = v!),
          ),
          const SizedBox(height: 16),

          // Prior Insurance
          const Text('Do you have prior insurance?', style: TextStyle(fontSize: 13, color: AppColors.textSecondary)),
          const SizedBox(height: 8),
          Row(
            children: [
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _hadPriorInsurance = false),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: !_hadPriorInsurance ? AppColors.primary.withValues(alpha: 0.1) : AppColors.bgCard,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: !_hadPriorInsurance ? AppColors.primary : AppColors.textMuted.withValues(alpha: 0.3)),
                    ),
                    child: Center(child: Text('No, first time', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: !_hadPriorInsurance ? AppColors.primary : AppColors.textMuted))),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: GestureDetector(
                  onTap: () => setState(() => _hadPriorInsurance = true),
                  child: Container(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    decoration: BoxDecoration(
                      color: _hadPriorInsurance ? AppColors.primary.withValues(alpha: 0.1) : AppColors.bgCard,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: _hadPriorInsurance ? AppColors.primary : AppColors.textMuted.withValues(alpha: 0.3)),
                    ),
                    child: Center(child: Text('Yes, I do', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: _hadPriorInsurance ? AppColors.primary : AppColors.textMuted))),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _buildInputField(
    String label,
    TextEditingController controller,
    IconData icon,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: AppColors.bgCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppColors.textMuted.withValues(alpha: 0.3),
            ),
          ),
          child: TextField(
            controller: controller,
            style: const TextStyle(fontSize: 15, color: AppColors.textPrimary),
            onChanged: (_) => setState(() {}),
            decoration: InputDecoration(
              prefixIcon: Icon(icon, color: AppColors.textMuted, size: 20),
              hintText: 'Enter $label',
              hintStyle: const TextStyle(color: AppColors.textMuted),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.symmetric(
                horizontal: 14,
                vertical: 16,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDropdownField(
    String label,
    String value,
    List<String> items,
    IconData icon,
    ValueChanged<String?> onChanged,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 13, color: AppColors.textSecondary),
        ),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14),
          decoration: BoxDecoration(
            color: AppColors.bgCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: AppColors.textMuted.withValues(alpha: 0.3),
            ),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              isExpanded: true,
              dropdownColor: AppColors.bgCard,
              icon: const Icon(
                Icons.keyboard_arrow_down_rounded,
                color: AppColors.textMuted,
              ),
              items: items
                  .map(
                    (e) => DropdownMenuItem(
                      value: e,
                      child: Row(
                        children: [
                          Icon(icon, color: AppColors.textMuted, size: 20),
                          const SizedBox(width: 12),
                          Text(
                            e,
                            style: const TextStyle(
                              fontSize: 15,
                              color: AppColors.textPrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  )
                  .toList(),
              onChanged: onChanged,
            ),
          ),
        ),
      ],
    );
  }

  // ─── Step 3: Zone Selection ─────────────────────────────────────

  Widget _buildZoneStep() {
    final zones = _cityZones[_selectedCity]!;
    final floodProne = {
      'Chennai': ['Velachery', 'Adyar', 'Tambaram', 'Porur'],
      'Delhi': ['Dwarka', 'Rohini'],
      'Mumbai': ['Kurla', 'Dadar', 'Andheri'],
    };

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 8),
          GlassCard(
            child: Row(
              children: [
                const Icon(
                  Icons.info_outline_rounded,
                  color: AppColors.accent,
                  size: 18,
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'Select your primary working zone in $_selectedCity. This affects your risk score and premium.',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ...zones.map((zone) {
            final isSelected = _selectedZone == zone;
            final isFloodProne =
                floodProne[_selectedCity]?.contains(zone) ?? false;

            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: GestureDetector(
                onTap: () => setState(() => _selectedZone = zone),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? AppColors.primary.withValues(alpha: 0.1)
                        : AppColors.bgCard,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(
                      color: isSelected
                          ? AppColors.primary
                          : AppColors.textMuted.withValues(alpha: 0.3),
                      width: isSelected ? 1.5 : 0.5,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color:
                              (isSelected
                                      ? AppColors.primary
                                      : AppColors.textMuted)
                                  .withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          Icons.location_on_rounded,
                          color: isSelected
                              ? AppColors.primary
                              : AppColors.textMuted,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              zone,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w600,
                                color: isSelected
                                    ? AppColors.textPrimary
                                    : AppColors.textSecondary,
                              ),
                            ),
                            if (isFloodProne)
                              const Text(
                                'Flood-prone zone • Higher premium applies',
                                style: TextStyle(
                                  fontSize: 11,
                                  color: AppColors.warning,
                                ),
                              ),
                          ],
                        ),
                      ),
                      if (isSelected)
                        const Icon(
                          Icons.check_circle_rounded,
                          color: AppColors.primary,
                          size: 22,
                        ),
                      if (isFloodProne && !isSelected)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.warning.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Text(
                            'High Risk',
                            style: TextStyle(
                              fontSize: 10,
                              color: AppColors.warning,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // ─── Step 4: Plan Selection ─────────────────────────────────────

  // ─── Step 4: AI Plan Computation ────────────────────────────────

  Future<void> _runPremiumSimulation() async {
    setState(() {
      _isCalculatingPremium = true;
      _calculationStep = 1;
    });

    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _calculationStep = 2);

    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;
    setState(() => _calculationStep = 3);

    await Future.delayed(const Duration(milliseconds: 700));
    if (!mounted) return;

    // Use our actual ML Engine to grade their profile!
    final result = PremiumEngine.calculate(
      zone: _selectedZone,
      city: _selectedCity,
      vehicleType: _vehicleType,
      experienceWeeks: _hadPriorInsurance ? 10 : 0, 
      claimCount: 0, 
      tier: 'Standard',
    );

    setState(() {
      _calculatedPremium = result;
      _isCalculatingPremium = false;
      _calculationStep = 0;
    });
  }

  Widget _buildPlanStep() {
    if (_calculatedPremium == null) {
      return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
              ),
              child: Column(
                children: [
                  const Icon(Icons.auto_awesome, color: AppColors.primary, size: 48),
                  const SizedBox(height: 16),
                  const Text('AI Personalized Premium', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 12),
                  const Text('We dropped static plans! Tap below to let the GigKavach ML algorithm analyze your Zone, Vehicle, and Coverage requirement to build a custom dynamic premium strictly for you.', textAlign: TextAlign.center, style: TextStyle(fontSize: 13, color: AppColors.textSecondary, height: 1.5)),
                  const SizedBox(height: 30),
                  
                  if (_isCalculatingPremium) ...[
                    // Simulation Loading State
                    Column(
                      children: [
                        const SizedBox(height: 24, width: 24, child: CircularProgressIndicator(color: AppColors.primary, strokeWidth: 2)),
                        const SizedBox(height: 16),
                        Text('[ \u2713 ] Fetching Weather Forecast for $_selectedZone', style: const TextStyle(fontSize: 12, fontFamily: 'monospace', color: AppColors.success)),
                        const SizedBox(height: 6),
                        Text(_calculationStep >= 2 ? '[ \u2713 ] Aggregating Zone Flood History' : '[ ... ] Aggregating Zone Flood History', style: TextStyle(fontSize: 12, fontFamily: 'monospace', color: _calculationStep >= 2 ? AppColors.success : AppColors.textMuted)),
                        const SizedBox(height: 6),
                        Text(_calculationStep >= 3 ? '[ \u2713 ] Regression Model Complete' : '[ ... ] Running Model...', style: TextStyle(fontSize: 12, fontFamily: 'monospace', color: _calculationStep >= 3 ? AppColors.success : AppColors.textMuted)),
                      ],
                    )
                  ] else ...[
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _runPremiumSimulation,
                        icon: const Icon(Icons.memory, color: Colors.white),
                        label: const Text('Simulate AI Pricing API', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                        style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary, 
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ]
                ],
              ),
            ),
          ],
        ),
      );
    }

    final result = _calculatedPremium!;
    final incomeMap = {'₹1000-3000': 2000, '₹3000-5000': 4000, '₹5000-8000': 6500, '₹8000+': 9000};
    final weeklyIncome = incomeMap[_weeklyIncomeRange] ?? 4000;
    final maxPayout = (weeklyIncome * 0.85).round();

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF6C5CE7), Color(0xFF00CEC9)], begin: Alignment.topLeft, end: Alignment.bottomRight),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              children: [
                const Text('Your Weekly Premium', style: TextStyle(fontSize: 14, color: Colors.white70)),
                const SizedBox(height: 8),
                Text('\u20B9${result.totalPremium.toInt()}', style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w800, color: Colors.white)),
                Text('Max Payout Ceiling: \u20B9$maxPayout /wk', style: const TextStyle(fontSize: 12, color: Colors.white70)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text('How AI calculated your price', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
          const SizedBox(height: 12),
          
          ...result.factors.map((factor) {
            final isDiscount = factor.amount < 0;
            final isNeutral = factor.amount == 0;
            final color = isDiscount ? AppColors.success : isNeutral ? AppColors.textMuted : (factor.type == 'base' ? AppColors.textPrimary : AppColors.warning);

            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: AppColors.bgCard, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.textMuted.withValues(alpha: 0.15))),
              child: Row(
                children: [
                  Icon(isDiscount ? Icons.trending_down_rounded : isNeutral ? Icons.remove_rounded : Icons.add_circle_outline_rounded, color: color, size: 18),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(factor.label, style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: color)),
                        Text(factor.info, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
                      ],
                    ),
                  ),
                  Text(isNeutral ? '\u20B90' : '${isDiscount ? "" : "+"}\u20B9${factor.amount.abs().toInt()}', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: color)),
                ],
              ),
            );
          }),
          const SizedBox(height: 12),
          Center(
            child: TextButton.icon(
              onPressed: () {
                setState(() => _calculatedPremium = null);
              },
              icon: const Icon(Icons.refresh, size: 16, color: AppColors.primary),
              label: const Text('Change Inputs & Recalculate', style: TextStyle(color: AppColors.primary, fontSize: 13)),
            ),
          ),
        ],
      ),
    );
  }
}
