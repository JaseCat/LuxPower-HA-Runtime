# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2024-01-XX

### Added
- Initial release of House Battery Runtime Calculator
- Battery runtime calculation based on current power consumption
- Charge time calculation for solar and grid charging
- Smart display logic (shows runtime when discharging, charge time when charging)
- Visual battery indicator with color-coded status
- Support for LuxPower hybrid inverters
- Configurable display options
- Modern, responsive UI design
- Real-time updates with configurable intervals

### Features
- **Runtime Calculation**: Accurate estimation of remaining runtime
- **Charge Time Calculation**: Shows time to fully charge from solar and grid
- **Smart Display**: Automatically shows relevant information based on battery state
- **Grid Charging Support**: Accounts for house consumption when calculating grid charging
- **Visual Indicators**: Color-coded battery status and warnings
- **Configurable**: Customizable display options and update intervals

### Technical Details
- Built as a Home Assistant custom card
- Supports both manual installation and HACS
- Compatible with various battery systems (LuxPower, Tesla Powerwall, SolarEdge, etc.)
- Responsive design that adapts to Home Assistant themes
- Clean, production-ready code with proper error handling
