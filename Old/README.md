# House Battery Runtime Calculator for Home Assistant

A custom Home Assistant card that calculates and displays battery runtime and charge time for home battery systems. Perfect for monitoring your home battery backup system during power outages or when running off-grid.

## Features

- 🔋 **Real-time Battery Monitoring**: Visual battery indicator with color-coded status
- ⏱️ **Runtime Calculation**: Accurate estimation of remaining runtime based on current power consumption
- 🔌 **Charge Time Calculation**: Shows how long it will take to fully charge your battery
- 📊 **Smart Display**: Shows runtime when discharging, charge time when charging
- 🔧 **Configurable**: Customize which information to display
- 🎨 **Modern UI**: Clean, responsive design that matches Home Assistant's theme
- ⚠️ **Smart Warnings**: Alerts for low battery and configuration issues


## Installation

### Method 1: Manual Installation (Recommended)

1. Download the `battery-runtime-calculator.js` file
2. Copy it to your Home Assistant `www` folder:
   ```
   /config/www/battery-runtime-calculator.js
   ```
3. Add the resource to your Home Assistant configuration:

   **Method A: Using the UI (Recommended)**
   1. Go to **Settings** → **Devices & Services** → **Helpers**
   2. Click the **+** button and select **Add Integration**
   3. Search for "Lovelace Resources" or go to **Settings** → **Dashboards** → **Resources**
   4. Click **+ Add Resource**
   5. Enter: `/local/battery-runtime-calculator.js`
   6. Set type to: `JavaScript Module`
   7. Click **Create**

   **Method B: Using configuration.yaml (Legacy)**
   ```yaml
   lovelace:
     resources:
       - url: /local/battery-runtime-calculator.js
         type: module
   ```

4. Restart Home Assistant

### Method 2: HACS Installation

1. Add this repository to HACS as a custom repository
2. Install "House Battery Runtime Calculator" from HACS
3. Add the resource to your configuration (see Method 1, step 3)
4. Restart Home Assistant

## Configuration

### Basic Configuration

Add the card to your Lovelace dashboard:

```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.battery_level
power_entity: sensor.home_power_consumption
```

### Advanced Configuration

```yaml
type: custom:battery-runtime-calculator
name: "House Battery Status"
battery_entity: sensor.battery_level
power_entity: sensor.home_power_consumption
generation_entity: sensor.solar_power  # Optional: for charge time calculation
grid_charging_entity: sensor.grid_power  # Optional: for grid charging
battery_charging_entity: sensor.battery_charge_power  # Optional: for accurate charging detection
battery_discharging_entity: sensor.battery_discharge_power  # Optional: for accurate charging detection
battery_capacity: 13.5  # kWh (if not available in entity attributes)
show_power: true
show_capacity: true
show_runtime: true
show_charge_time: true
update_interval: 30  # seconds
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `battery_entity` | string | **Required** | Entity ID for battery level (percentage) |
| `power_entity` | string | **Required** | Entity ID for power consumption (watts) |
| `generation_entity` | string | optional | Entity ID for solar generation (watts) |
| `grid_charging_entity` | string | optional | Entity ID for grid charging power (watts) |
| `battery_power_entity` | string | optional | Entity ID for battery power flow (positive=discharge, negative=charge) |
| `battery_charging_entity` | string | optional | Entity ID for battery charging power (watts) |
| `battery_discharging_entity` | string | optional | Entity ID for battery discharging power (watts) |
| `name` | string | "House Battery" | Card title |
| `battery_capacity` | number | auto-detect | Battery capacity in kWh |
| `show_power` | boolean | true | Show power consumption |
| `show_capacity` | boolean | true | Show battery capacity |
| `show_runtime` | boolean | true | Show estimated runtime |
| `show_charge_time` | boolean | true | Show charge time remaining |
| `update_interval` | number | 30 | Update interval in seconds |

## Required Entities

### Battery Entity
Your battery level entity should provide:
- **State**: Battery percentage (0-100)
- **Attributes** (optional): `capacity` or `battery_capacity` in kWh

Example entities:
- `sensor.battery_level`
- `sensor.battery_percentage`
- `sensor.solar_battery_level`

### Power Entity
Your power consumption entity should provide:
- **State**: Power consumption in watts (positive value)

Example entities:
- `sensor.home_power_consumption`
- `sensor.total_power_usage`
- `sensor.grid_power_consumption`

## How It Works

The card calculates runtime using this formula:

```
Runtime (hours) = (Battery Level % / 100) × Battery Capacity (kWh) / Power Consumption (kW)
```

### Example Calculation

- Battery Level: 75%
- Battery Capacity: 13.5 kWh
- Power Consumption: 2.5 kW

```
Runtime = (75 / 100) × 13.5 / 2.5 = 4.05 hours = 4h 3m
```

## Troubleshooting

### "Battery capacity not configured" Error

This means the card can't determine your battery capacity. Solutions:

1. **Check entity attributes**: Look at your battery entity in Developer Tools → States
2. **Manual configuration**: Add `battery_capacity: 13.5` to your card config
3. **Update integration**: Some battery integrations don't expose capacity

### "No power consumption data" Error

This means your power entity isn't providing valid data. Solutions:

1. **Check entity state**: Ensure it shows a positive number in watts
2. **Verify entity ID**: Make sure the entity exists and is spelled correctly
3. **Check units**: The entity should report watts, not kilowatts

### Runtime Shows 0 or Very Low

Possible causes:
1. **High power consumption**: Your home is using more power than expected
2. **Low battery level**: Battery is nearly empty
3. **Incorrect capacity**: Battery capacity might be set too low
4. **Wrong power entity**: You might be monitoring the wrong power sensor

## Customization

### Styling

The card uses Home Assistant's CSS variables for theming. It will automatically adapt to:
- Light/dark themes
- Custom themes
- High contrast mode

### Advanced Styling

You can override styles by adding custom CSS to your theme:

```yaml
# In your theme file
card-mod-battery-runtime-calculator:
  --battery-color-low: "#ff4444"
  --battery-color-medium: "#ffaa00"
  --battery-color-high: "#44ff44"
```

## Integration Examples

### With LuxPower (Recommended)
```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.luxpower_battery_soc
power_entity: sensor.luxpower_load_power
generation_entity: sensor.luxpower_solar_power
grid_charging_entity: sensor.luxpower_grid_power
battery_charging_entity: sensor.luxpower_battery_charge_power
battery_discharging_entity: sensor.luxpower_battery_discharge_power
battery_capacity: 23.8
```

### With SolarEdge
```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.solaredge_battery_level
power_entity: sensor.solaredge_consumption
battery_capacity: 13.5
```

### With Tesla Powerwall
```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.powerwall_battery_level
power_entity: sensor.powerwall_load
battery_capacity: 13.5
```

### With Generic Battery Monitor
```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.battery_percentage
power_entity: sensor.total_power_usage
battery_capacity: 10.0
name: "Backup Battery Status"
```

## Support

If you encounter issues:

1. Check the Home Assistant logs for errors
2. Verify your entity IDs in Developer Tools → States
3. Ensure your battery and power entities are working correctly
4. Check that the card resource is loaded properly

## License

This project is licensed under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

---

**Note**: This card is designed for home battery backup systems. For best results, ensure your battery and power monitoring integrations are properly configured and providing accurate data.
