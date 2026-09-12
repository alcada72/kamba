const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withBluetoothPermissions(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    if (!manifest["uses-permission"]) {
      manifest["uses-permission"] = [];
    }

    const permissions = manifest["uses-permission"];

    const bluetoothScan = permissions.find(
      (permission) =>
        permission.$?.["android:name"] === "android.permission.BLUETOOTH_SCAN",
    );

    if (bluetoothScan) {
      bluetoothScan.$["android:usesPermissionFlags"] = "neverForLocation";
    } else {
      permissions.push({
        $: {
          "android:name": "android.permission.BLUETOOTH_SCAN",
          "android:usesPermissionFlags": "neverForLocation",
        },
      });
    }

    return config;
  });
};
