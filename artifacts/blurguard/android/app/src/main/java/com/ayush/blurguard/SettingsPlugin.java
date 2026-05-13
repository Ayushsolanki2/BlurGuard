package com.ayush.blurguard;

import android.content.Intent;
import android.provider.Settings;
import android.app.AppOpsManager;
import android.content.Context;
import android.os.Process;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "BlurGuardSettings")
public class SettingsPlugin extends Plugin {

    /**
     * Opens Android's "Usage Access" special permissions screen so the
     * user can grant PACKAGE_USAGE_STATS to BlurGuard.
     */
    @PluginMethod
    public void openUsageAccessSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to open Usage Access settings: " + e.getMessage());
        }
    }

    /**
     * Opens the app-specific Notification settings screen.
     */
    @PluginMethod
    public void openNotificationSettings(PluginCall call) {
        try {
            Intent intent = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            intent.putExtra(Settings.EXTRA_APP_PACKAGE, getActivity().getPackageName());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getActivity().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Failed to open Notification settings: " + e.getMessage());
        }
    }

    /**
     * Checks whether Usage Stats permission has been granted by the user.
     */
    @PluginMethod
    public void checkUsagePermission(PluginCall call) {
        try {
            AppOpsManager appOps = (AppOpsManager)
                    getContext().getSystemService(Context.APP_OPS_SERVICE);
            int mode = appOps.checkOpNoThrow(
                    AppOpsManager.OPSTR_GET_USAGE_STATS,
                    Process.myUid(),
                    getContext().getPackageName()
            );
            JSObject result = new JSObject();
            result.put("granted", mode == AppOpsManager.MODE_ALLOWED);
            call.resolve(result);
        } catch (Exception e) {
            JSObject result = new JSObject();
            result.put("granted", false);
            call.resolve(result);
        }
    }
}
