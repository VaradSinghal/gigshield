import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Primary brand colors (Now using the Light Theme Blue)
  static const primary = Color(0xFF1565C0);
  static const primaryLight = Color(0xFF42A5F5);
  static const primaryDark = Color(0xFF0D47A1);

  // Accent
  static const accent = Color(0xFF00CEC9);
  static const accentLight = Color(0xFF55EFC4);

  // Status colors
  static const success = Color(0xFF2E7D32);
  static const warning = Color(0xFFE65100);
  static const danger = Color(0xFFC62828);

  // Background (Semantically changing these to Light Mode values!)
  static const bgDark = Color(0xFFFBFBFB); // Perfectly matches splash SVG background
  static const bgCard = Colors.white;      // Was dark card, now white
  static const bgCardLight = Color(0xFFF0F7FF); 
  static const bgSurface = Color(0xFFE3F2FD); 

  // Text
  static const textPrimary = Color(0xFF1A237E); 
  static const textSecondary = Color(0xFF37474F); 
  static const textMuted = Color(0xFF90A4AE); 

  // Gradients
  static const primaryGradient = LinearGradient(
    colors: [primary, primaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const successGradient = LinearGradient(
    colors: [success, accentLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const warningGradient = LinearGradient(
    colors: [warning, Color(0xFFE17055)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const dangerGradient = LinearGradient(
    colors: [danger, Color(0xFFE84393)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ─── Onboarding Light Theme (White & Blue) ───────────────────────
  static const onboardBg = Color(0xFFFBFBFB);
  static const onboardCard = Colors.white;
  static const onboardBluePrimary = Color(0xFF1565C0);
  static const onboardBlueLight = Color(0xFF42A5F5);
  static const onboardBlueSoft = Color(0xFFE3F2FD);
  static const onboardBluePale = Color(0xFFF0F7FF);
  static const onboardTextDark = Color(0xFF1A237E);
  static const onboardTextBody = Color(0xFF37474F);
  static const onboardTextMuted = Color(0xFF90A4AE);
  static const onboardBorder = Color(0xFFE0E8F0);
  static const onboardSuccess = Color(0xFF2E7D32);
  static const onboardSuccessBg = Color(0xFFE8F5E9);
  static const onboardWarning = Color(0xFFE65100);
  static const onboardWarningBg = Color(0xFFFFF3E0);
  static const onboardDanger = Color(0xFFC62828);
  static const onboardDangerBg = Color(0xFFFFEBEE);

  static const onboardGradient = LinearGradient(
    colors: [Color(0xFF1565C0), Color(0xFF42A5F5)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const onboardGradientSubtle = LinearGradient(
    colors: [Color(0xFFE3F2FD), Color(0xFFF0F7FF)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      brightness: Brightness.light,
      scaffoldBackgroundColor: AppColors.bgDark,
      primaryColor: AppColors.primary,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primary,
        secondary: AppColors.accent,
        surface: AppColors.bgCard,
      ),
      textTheme: GoogleFonts.interTextTheme(ThemeData.light().textTheme).apply(
        bodyColor: AppColors.textPrimary,
        displayColor: AppColors.textPrimary,
      ),
      cardTheme: CardThemeData(
        color: AppColors.bgCard,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.bgDark,
        elevation: 0,
        centerTitle: false,
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
        titleTextStyle: GoogleFonts.inter(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: AppColors.textPrimary,
        ),
      ),
    );
  }
}
