# Debug Battery Runtime Calculation

## Step-by-Step Debugging Process

Since your entities look correct but the calculation is still wrong, let's debug this systematically.

## Step 1: Check Current Values

Go to **Settings** → **Devices & Services** → **Entities** and find your entities. Tell me:

1. **Battery Entity**: What's the current state value? (should be 0-100)
2. **Power Entity**: What's the current state value? (should be in watts)
3. **Battery Capacity**: What did you set in the card config?

## Step 2: Manual Calculation Test

Let's calculate what the runtime should be manually:

**Formula**: `Runtime (hours) = (Battery Level % / 100) × Battery Capacity (kWh) / Power Consumption (kW)`

**Example with your values**:
- Battery Level: 80%
- Battery Capacity: 13.5 kWh
- Power Consumption: 2.5 kW

**Calculation**: `(80 / 100) × 13.5 / 2.5 = 0.8 × 13.5 / 2.5 = 4.32 hours = 4h 19m`

## Step 3: Common Calculation Issues

### Issue 1: Power Units Mismatch
**Problem**: Power entity shows watts, but calculation expects kilowatts
**Example**: 2500W should be 2.5kW
**Solution**: The card should handle this automatically, but let's verify

### Issue 2: Battery Capacity Units
**Problem**: Capacity set in wrong units
**Example**: 13500Wh instead of 13.5kWh
**Solution**: Make sure capacity is in kWh, not Wh

### Issue 3: Power Entity Shows Total Instead of Consumption
**Problem**: Using total power instead of consumption
**Example**: Total power might be 10kW, but consumption is only 2kW
**Solution**: Use the consumption entity, not total power

## Step 4: Test with Known Values

Try this test configuration with known values:

```yaml
type: custom:battery-runtime-calculator
name: "Debug Test"
battery_entity: sensor.luxpower_battery_soc
power_entity: sensor.luxpower_load_power
battery_capacity: 13.5
```

Then manually calculate what the runtime should be and compare.

## Step 5: Check for Data Issues

### Power Consumption Issues
- **Too high**: You might be monitoring total power instead of consumption
- **Negative values**: Some systems show negative for consumption
- **Zero values**: Power entity might not be updating
- **Stuck values**: Entity might not be updating

### Battery Level Issues
- **Zero**: Battery entity might not be working
- **Very low**: Battery might actually be low
- **Stuck value**: Entity might not be updating

## Step 6: Alternative Power Entities to Try

If your current power entity isn't working, try these:

1. `sensor.luxpower_load_power` (Home consumption)
2. `sensor.luxpower_grid_power` (Grid consumption)
3. `sensor.luxpower_total_power` (Total power)
4. `sensor.luxpower_consumption` (Consumption)

## Step 7: Debug Configuration

Add this debug configuration to see what's happening:

```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.luxpower_battery_soc
power_entity: sensor.luxpower_load_power
battery_capacity: 13.5
name: "Debug Battery Runtime"
update_interval: 10
```

## Step 8: Check Browser Console

1. **Press F12** in your browser
2. **Go to Console tab**
3. **Look for any JavaScript errors**
4. **Check if the card is receiving data**

## Step 9: Manual Verification

Calculate what the runtime should be manually:

1. **Get your current battery percentage** (e.g., 80%)
2. **Get your current power consumption** (e.g., 2500W = 2.5kW)
3. **Get your battery capacity** (e.g., 13.5kWh)
4. **Calculate**: `(80/100) × 13.5 / 2.5 = 4.32 hours`

If the manual calculation gives you a reasonable runtime but the card shows 2 minutes, there's a data issue.

## Step 10: What to Check

Please provide:

1. **Current battery percentage** from your entity
2. **Current power consumption** from your entity (in watts)
3. **Battery capacity** you set in the card config
4. **What the manual calculation gives you**
5. **What the card is showing**

With this information, I can identify exactly what's wrong with the calculation.
