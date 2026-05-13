# BlurGuard OTP Email Setup Guide

## 🎯 Real Email OTP System Implementation Complete

Your app now has **real email-based OTP verification** for account re-authentication in the Settings page.

---

## ⚙️ Configuration Steps

### Step 1: Create Gmail App Password

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Find **"App passwords"** (appears only if 2-Step Verification is enabled)
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character app password
5. **Copy this password** (you'll need it next)

> ⚠️ Note: You must have 2-Step Verification enabled on your Google account. If not, enable it first.

---

### Step 2: Create .env File

Create a `.env` file in `/BlurGuard/artifacts/api-server/` with:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-char-app-password
PORT=5000
NODE_ENV=development
```

**Example:**
```env
EMAIL_USER=blurguard.auth@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
PORT=5000
NODE_ENV=development
```

---

### Step 3: Start the Servers

#### Terminal 1 - API Server:
```bash
cd "/BlurGuard/artifacts/api-server"
pnpm dev
```

You should see:
```
✓ API Server running on port 5000
```

#### Terminal 2 - Frontend App (in new terminal):
```bash
cd "/BlurGuard/artifacts/blurguard"
pnpm dev
```

You should see:
```
✓ Local: http://localhost:5173/
```

---

## 🧪 Testing the OTP Flow

### Complete Test Scenario:

1. **Open App**: Navigate to `http://localhost:5173/`
2. **Login/Create Account**: Go through the profile setup (if first time)
3. **Go to Settings**: Click profile icon → Settings
4. **Find "Security & Re-authentication"**: Look for the blue "Verify Account" button
5. **Enter Email**: Type your real email address (e.g., your-email@gmail.com)
6. **Click "Send OTP"**: An email will arrive in ~5 seconds
7. **Copy OTP Code**: Look for 6-digit code in the email subject or body
8. **Enter Code**: Type digits in the 6 input fields (auto-advances)
9. **Click "Verify OTP"**: Complete the verification
10. **See Success**: ✓ Green checkmark appears with "Account verified"

---

## 📧 Email Template Preview

When you send OTP, user receives professional email with:
- 🎨 BlurGuard branding header (purple gradient)
- 🔢 Large, easy-to-read 6-digit code
- ⏱️ 10-minute expiry notice
- 🔒 Privacy assurance

---

## 🔧 API Endpoints Reference

### Send OTP
```
POST http://localhost:5000/api/auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response (Success):
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "expiresIn": 600
}
```

### Verify OTP
```
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response (Success):
{
  "success": true,
  "message": "Account verified successfully",
  "token": "base64-encoded-token",
  "email": "user@example.com"
}
```

---

## ⚠️ Troubleshooting

### Email Not Arriving?
- ✅ Check spam/promotions folder
- ✅ Verify `EMAIL_USER` matches your Gmail
- ✅ Confirm `EMAIL_PASS` is the 16-char app password (not regular password)
- ✅ Check API server console for errors: `Email sending failed`

### OTP Expired?
- Timer shows 10 minutes from send
- Click "Change Email" button to request new OTP
- New email will be sent immediately

### Too Many Attempts?
- System limits to 5 failed attempts
- Request new OTP by clicking "Change Email"
- Wait a moment before retrying

### Server Won't Start?
- Ensure both `pnpm install` have completed
- Kill any existing processes on ports 5000/5173
- Check `.env` file is in correct folder: `/api-server/`

---

## 🎯 Features

✅ **Real Email Delivery** - OTP sent via Gmail SMTP  
✅ **10-Minute Expiry** - Secure time window  
✅ **5-Attempt Limit** - Brute-force protection  
✅ **Professional Template** - Branded email design  
✅ **Instant Feedback** - Loading states & error messages  
✅ **Auto-Advance Input** - Smooth UX for 6-digit code  
✅ **Countdown Timer** - Shows remaining time  
✅ **Change Email** - Go back and retry with different email  

---

## 📞 Next Steps

1. ✅ Configure Gmail credentials (`.env` file)
2. ✅ Start both servers (API & Frontend)
3. ✅ Test OTP flow end-to-end
4. ✅ Verify email arrives within 5 seconds
5. ✅ Confirm account verification completes

**Ready to go!** 🚀
