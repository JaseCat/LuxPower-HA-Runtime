# Troubleshooting Battery Runtime Calculator

## Issue: Runtime Shows Only 2 Minutes

If your battery runtime is showing only 2 minutes, this usually indicates a data problem. Here's how to diagnose and fix it:

## Step 1: Check Your Entity Data

1. **Go to Settings** → **Devices & Services** → **Entities**
2. **Find your battery entity** (the one you're using in the card)
3. **Click on it** to see its current state and attributes
4. **Check the state value** - it should be a number between 0-100 (percentage)
5. **Look for capacity attributes** like `capacity`, `battery_capacity`, or `total_capacity`

## Step 2: Check Your Power Entity

1. **Find your power consumption entity**
2. **Check its current state** - it should be a positive number in watts
3. **Verify the unit** - it should be in watts (W), not kilowatts (kW)

## Step 3: Common Issues and Solutions

### Issue 1: Power Consumption Too High
**Symptoms**: Runtime shows very low (minutes)
**Cause**: Your power entity might be showing total power instead of consumption
**Solution**: 
- Check if you're using the right entity
- Look for entities like `sensor.home_power_consumption` instead of `sensor.total_power`
- Some entities show negative values for consumption - the card uses absolute values

### Issue 2: Battery Capacity Not Set
**Symptoms**: Runtime shows 0 or very low
**Cause**: Battery capacity is unknown
**Solution**:
- Add `battery_capacity: 13.5` to your card config (replace 13.5 with your actual capacity)
- Check your battery entity attributes for capacity information

### Issue 3: Wrong Units
**Symptoms**: Runtime calculation seems off
**Cause**: Units mismatch
**Solution**:
- Power should be in watts (W), not kilowatts (kW)
- Battery capacity should be in kilowatt-hours (kWh)
- Battery level should be percentage (0-100)

## Step 4: Test with Manual Values

Try this test configuration to verify the card works:

```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.your_battery_level
power_entity: sensor.your_power_consumption
battery_capacity: 13.5  # Set this to your actual battery capacity
name: "Test Battery Runtime"
```

## Step 5: Calculate Expected Runtime Manually

Use this formula to verify the calculation:

```
Runtime (hours) = (Battery Level % / 100) × Battery Capacity (kWh) / Power Consumption (kW)
```

**Example**:
- Battery Level: 80%
- Battery Capacity: 13.5 kWh
- Power Consumption: 2.5 kW

```
Runtime = (80 / 100) × 13.5 / 2.5 = 4.32 hours = 4h 19m
```

## Step 6: Check for Data Issues

### Power Consumption Issues
- **Too high**: You might be monitoring total power instead of consumption
- **Negative values**: Some systems show negative for consumption (card handles this)
- **Zero values**: Power entity might not be updating

### Battery Level Issues
- **Zero**: Battery entity might not be working
- **Very low**: Battery might actually be low
- **Stuck value**: Entity might not be updating

## Step 7: Alternative Entity Suggestions

If your current entities aren't working, try these common alternatives:

### Battery Entities
- `sensor.battery_level`
- `sensor.battery_percentage`
- `sensor.solar_battery_level`
- `sensor.powerwall_battery_level`
- `sensor.battery_soc` (State of Charge)

### Power Entities
- `sensor.home_power_consumption`
- `sensor.total_power_usage`
- `sensor.grid_power_consumption`
- `sensor.load_power`
- `sensor.consumption_power`

## Step 8: Debug Configuration

Add this debug configuration to see what data the card is receiving:

```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.your_battery_level
power_entity: sensor.your_power_consumption
battery_capacity: 13.5
name: "Debug Battery Runtime"
update_interval: 10  # Update every 10 seconds for testing
```

## Step 9: Check Home Assistant Logs

1. **Go to Settings** → **System** → **Logs**
2. **Look for errors** related to your entities
3. **Check if entities are updating** regularly

## Step 10: Common Battery System Configurations

### Tesla Powerwall
```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.powerwall_battery_level
power_entity: sensor.powerwall_load
battery_capacity: 13.5
```

### SolarEdge
```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.solaredge_battery_level
power_entity: sensor.solaredge_consumption
battery_capacity: 13.5
```

### Generic Battery Monitor
```yaml
type: custom:battery-runtime-calculator
battery_entity: sensor.battery_percentage
power_entity: sensor.total_power_usage
battery_capacity: 10.0  # Adjust to your battery size
```

## Still Having Issues?

If you're still seeing 2 minutes runtime, please check:

1. **What's your actual battery capacity?** (in kWh)
2. **What's your current power consumption?** (in watts)
3. **What's your current battery level?** (percentage)
4. **What entities are you using in the card config?**

With this information, I can help you calculate what the runtime should be and identify the issue.
