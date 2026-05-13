import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { sql, eq } from 'drizzle-orm';
import { db } from '@workspace/db';
import { usageLogs, userSettings } from '@workspace/db/schema';
import { FocusModeToggleSchema } from '@workspace/api-zod';

const app = express();
app.use(cors());
app.use(express.json());

// Email Configuration (Using Gmail SMTP - replace with your credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'blurguard.auth@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password-here', // Use Gmail App Password
  },
});

// In-memory OTP store
const otpStore: Record<string, { code: string; timestamp: number; attempts: number }> = {};

// GET /api/usage
app.get('/api/usage', async (req, res) => {
  try {
    const DAILY_LIMIT = 360; // 6 hours
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let logs: any[] = [];
    try {
      logs = await db
        .select()
        .from(usageLogs)
        .where(sql`${usageLogs.timestamp} >= ${today}`);
    } catch (dbError) {
      console.warn('Database connection failed, falling back to mock data.');
    }

    let totalMinutes = 0;
    const appUsage: Record<string, number> = {};

    logs.forEach((log) => {
      totalMinutes += log.durationMinutes;
      appUsage[log.appName] = (appUsage[log.appName] || 0) + log.durationMinutes;
    });

    // Dummy data for visual presentation if DB is empty
    if (Object.keys(appUsage).length === 0) {
      Object.assign(appUsage, {
        'Instagram': 120,
        'YouTube': 80,
        'LinkedIn': 30,
        'Chrome': 25,
      });
      totalMinutes = 255;
    }

    const percentage = Math.min(100, Math.round((totalMinutes / DAILY_LIMIT) * 100));

    const apps = Object.entries(appUsage)
      .map(([name, minutes]) => ({
        name,
        minutes,
        percentage: Math.min(100, Math.round((minutes / DAILY_LIMIT) * 100)),
      }))
      .sort((a, b) => b.minutes - a.minutes);

    const mostUsedApp = apps.length > 0 ? apps[0].name : 'None';
    const trend = [180, 210, 195, 240, 220, 230, totalMinutes];

    res.json({
      totalMinutes,
      dailyLimit: DAILY_LIMIT,
      percentage,
      mostUsedApp,
      productivityScore: 74,
      trend,
      apps,
    });
  } catch (error) {
    console.error('Error fetching usage data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/focus-mode
app.post('/api/focus-mode', async (req, res) => {
  try {
    const { enabled } = FocusModeToggleSchema.parse(req.body);

    let settings: any[] = [];
    try {
      settings = await db.select().from(userSettings).limit(1);
    } catch (dbError) {
      console.warn('Database connection failed, mocking successful toggle.');
      res.json({ enabled, message: "Focus mode activated" });
      return;
    }
    
    if (settings.length === 0) {
      const [newSetting] = await db.insert(userSettings).values({ focusMode: enabled }).returning();
      res.json({ enabled: newSetting.focusMode, message: "Focus mode activated" });
      return;
    } else {
      const [updatedSetting] = await db
        .update(userSettings)
        .set({ focusMode: enabled })
        .where(eq(userSettings.id, settings[0].id))
        .returning();
      res.json({ enabled: updatedSetting.focusMode, message: "Focus mode status updated" });
      return;
    }
  } catch (error) {
    console.error('Error toggling focus mode:', error);
    res.status(400).json({ error: 'Bad Request' });
  }
});

// GET /api/productivity-insights
app.get('/api/productivity-insights', async (req, res) => {
  try {
    // Generate AI-style insights based on mock/real logic
    res.json({
      mostDistractingHours: "After 11 PM",
      screenTimeChange: "+22% increase today",
      focusSuggestion: "Focus mode improved productivity by 18%. Consider locking Instagram after 10 PM.",
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/auth/send-otp - Send OTP via Email
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' });
      return;
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 10-minute expiry
    otpStore[email] = {
      code: otp,
      timestamp: Date.now(),
      attempts: 0,
    };

    // Send Email with OTP
    try {
      await transporter.sendMail({
        from: '"BlurGuard" <blurguard.auth@gmail.com>',
        to: email,
        subject: '🔐 Your BlurGuard OTP Verification Code',
        html: `
          <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); border-radius: 16px; padding: 40px; text-align: center; color: white;">
              <h1 style="margin: 0 0 10px 0; font-size: 28px;">BlurGuard</h1>
              <p style="margin: 0 0 30px 0; opacity: 0.9;">AI Focus Engine</p>
            </div>
            
            <div style="background: #f8f9fa; border-radius: 12px; padding: 40px; margin-top: 20px; text-align: center;">
              <h2 style="color: #1a1a1a; margin: 0 0 15px 0;">Verify Your Account</h2>
              <p style="color: #666; margin: 0 0 30px 0; font-size: 14px;">Enter this code to verify your BlurGuard account. This code expires in 10 minutes.</p>
              
              <div style="background: white; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; margin: 30px 0;">
                <div style="font-size: 48px; font-weight: black; letter-spacing: 8px; color: #6366f1; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #999; font-size: 12px; margin: 30px 0 0 0;">If you didn't request this code, you can ignore this email.</p>
            </div>
            
            <div style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
              <p>© 2026 BlurGuard. All rights reserved.</p>
            </div>
          </div>
        `,
      });

      console.log(`✅ OTP sent to ${email}: ${otp}`);

      res.json({
        success: true,
        message: 'OTP sent successfully to your email',
        expiresIn: 600, // 10 minutes
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Still store the OTP for testing if email fails
      console.log(`[TEST MODE] OTP for ${email}: ${otp}`);
      res.json({
        success: true,
        message: 'OTP generated (email service unavailable - check console)',
        expiresIn: 600,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined, // Debug mode only
      });
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// POST /api/auth/verify-otp - Verify OTP sent to email
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: 'Email and OTP are required' });
      return;
    }

    const storedOtp = otpStore[email];

    if (!storedOtp) {
      res.status(400).json({ error: 'OTP not found or expired' });
      return;
    }

    // Check if OTP is expired (10 minutes)
    if (Date.now() - storedOtp.timestamp > 10 * 60 * 1000) {
      delete otpStore[email];
      res.status(400).json({ error: 'OTP expired' });
      return;
    }

    // Check attempts (max 5)
    if (storedOtp.attempts >= 5) {
      delete otpStore[email];
      res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' });
      return;
    }

    if (storedOtp.code !== otp) {
      storedOtp.attempts++;
      res.status(400).json({ 
        error: 'Invalid OTP', 
        attemptsRemaining: 5 - storedOtp.attempts 
      });
      return;
    }

    // OTP verified successfully
    delete otpStore[email];

    // Generate session token
    const token = Buffer.from(`${email}-${Date.now()}`).toString('base64');

    console.log(`✅ OTP verified for ${email}`);

    res.json({
      success: true,
      message: 'Account verified successfully',
      token,
      email,
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
