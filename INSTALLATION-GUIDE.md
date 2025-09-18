# Quick Installation Guide

## Fix for "Integration 'resources' not found" Error

The `resources` configuration has been deprecated in newer Home Assistant versions. Here's how to properly install the card:

## Step-by-Step Installation

### 1. Copy the Card File
Copy `battery-runtime-calculator.js` to your Home Assistant `www` folder:
```
/config/www/battery-runtime-calculator.js
```

### 2. Add Resource via UI (Recommended Method)

1. **Open Home Assistant** in your browser
2. **Go to Settings** → **Dashboards** → **Resources**
3. **Click "+ Add Resource"**
4. **Enter the URL**: `/local/battery-runtime-calculator.js`
5. **Set Type**: `JavaScript Module`
6. **Click "Create"**

### 3. Alternative: Use Configuration.yaml (Legacy)

If you prefer using configuration.yaml, add this to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/battery-runtime-calculator.js
      type: module
```

**Note**: Remove any old `resources:` section from your configuration.yaml if it exists.

### 4. Restart Home Assistant

After adding the resource, restart Home Assistant to load the new card.

### 5. Add the Card to Your Dashboard

1. **Edit your dashboard** (click the three dots → Edit Dashboard)
2. **Add a new card**
3. **Choose "Manual"**
4. **Add this configuration**:

```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.your_battery_level
power_entity: sensor.your_power_consumption
battery_capacity: 13.5  # Your battery capacity in kWh
```

Replace `sensor.your_battery_level` and `sensor.your_power_consumption` with your actual entity IDs.

## Troubleshooting

### If you still get errors:

1. **Check the file path**: Make sure the file is in `/config/www/`
2. **Check the resource**: Go to Settings → Dashboards → Resources and verify it's listed
3. **Check browser console**: Press F12 and look for JavaScript errors
4. **Restart Home Assistant**: Sometimes a restart is needed after adding resources

### Finding Your Entity IDs:

1. Go to **Settings** → **Devices & Services** → **Entities**
2. Search for your battery and power entities
3. Copy the exact entity ID (e.g., `sensor.battery_level`)

## Quick Test Configuration

Here's a minimal test configuration to verify the card works:

```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.battery_level
power_entity: sensor.home_power_consumption
```

If you don't have these exact entities, replace them with any battery percentage entity and power consumption entity you have in your system.
