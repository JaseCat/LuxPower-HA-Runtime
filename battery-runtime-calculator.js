class BatteryRuntimeCalculator extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._batteryLevel = 0;
    this._batteryCapacity = 0;
    this._powerConsumption = 0;
    this._powerGeneration = 0;
    this._gridCharging = 0;
    this._runtime = 0;
    this._chargeTime = 0;
    this._isCharging = false;
    this._lastUpdate = null;
  }

  setConfig(config) {
    if (!config.battery_entity) {
      throw new Error('battery_entity is required');
    }
    if (!config.power_entity) {
      throw new Error('power_entity is required');
    }
    
    this._config = {
      name: 'House Battery',
      show_power: true,
      show_capacity: true,
      show_runtime: true,
      show_charge_time: true,
      update_interval: 30,
      ...config
    };
  }

  getCardSize() {
    return 3;
  }

  set hass(hass) {
    this._hass = hass;
    this.updateData();
  }

  updateData() {
    const batteryState = this._hass.states[this._config.battery_entity];
    const powerState = this._hass.states[this._config.power_entity];
    
    if (!batteryState || !powerState) {
      this.render();
      return;
    }

    this._batteryLevel = parseFloat(batteryState.state) || 0;
    this._powerConsumption = Math.abs(parseFloat(powerState.state) || 0);
    
    // Get power generation if available
    if (this._config.generation_entity) {
      const generationState = this._hass.states[this._config.generation_entity];
      if (generationState) {
        this._powerGeneration = Math.abs(parseFloat(generationState.state) || 0);
      }
    }
    
    // Get grid charging power if available
    if (this._config.grid_charging_entity) {
      const gridChargingState = this._hass.states[this._config.grid_charging_entity];
      if (gridChargingState) {
        // Grid power is typically negative when charging battery
        // We need to subtract house consumption to get net charging power
        const gridPower = parseFloat(gridChargingState.state) || 0;
        const netGridCharging = Math.abs(gridPower) - this._powerConsumption;
        this._gridCharging = Math.max(0, netGridCharging); // Only positive charging power
      }
    }
    
    // Try to get battery capacity from attributes
    this._batteryCapacity = batteryState.attributes.capacity || 
                          batteryState.attributes.battery_capacity || 
                          this._config.battery_capacity || 
                          0;

    // Determine if battery is charging
    this._isCharging = (this._powerGeneration + this._gridCharging) > 0;
    
    // Calculate runtime and charge time
    this.calculateRuntime();
    this.calculateChargeTime();
    this._lastUpdate = new Date();
    this.render();
  }

  calculateRuntime() {
    if (this._batteryCapacity <= 0 || this._powerConsumption <= 0) {
      this._runtime = 0;
      return;
    }

    // Calculate available energy (kWh)
    const availableEnergy = (this._batteryLevel / 100) * this._batteryCapacity;
    
    // Convert power consumption from watts to kilowatts
    const powerConsumptionKW = this._powerConsumption / 1000;
    
    // Calculate runtime in hours
    const runtimeHours = availableEnergy / powerConsumptionKW;
    
    // Store runtime in hours
    this._runtime = runtimeHours;
  }

  calculateChargeTime() {
    if (this._batteryCapacity <= 0) {
      this._chargeTime = 0;
      return;
    }

    // Calculate total charging power (solar + grid)
    const totalChargingPower = this._powerGeneration + this._gridCharging;

    if (totalChargingPower <= 0) {
      this._chargeTime = 0;
      return;
    }

    // Calculate energy needed to reach 100% (kWh)
    const currentEnergy = (this._batteryLevel / 100) * this._batteryCapacity;
    const maxEnergy = this._batteryCapacity;
    const energyNeeded = maxEnergy - currentEnergy;

    // Convert total charging power from watts to kilowatts
    const totalChargingPowerKW = totalChargingPower / 1000;

    // Calculate charge time in hours
    const chargeTimeHours = energyNeeded / totalChargingPowerKW;

    // Store charge time in hours
    this._chargeTime = chargeTimeHours;
  }

  formatRuntime(hours) {
    if (hours <= 0) return '0h 0m';
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  }

  formatChargeTime(hours) {
    if (hours <= 0) return 'Fully charged';
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${wholeHours}h`;
    } else {
      return `${wholeHours}h ${minutes}m`;
    }
  }

  formatPower(watts) {
    if (watts >= 1000) {
      return `${(watts / 1000).toFixed(1)} kW`;
    } else {
      return `${watts.toFixed(0)} W`;
    }
  }

  render() {
    const batteryPercentage = Math.round(this._batteryLevel);
    const runtimeFormatted = this.formatRuntime(this._runtime);
    const chargeTimeFormatted = this.formatChargeTime(this._chargeTime);
    const powerFormatted = this.formatPower(this._powerConsumption);
    const generationFormatted = this.formatPower(this._powerGeneration);
    const gridChargingFormatted = this.formatPower(this._gridCharging);
    const totalChargingFormatted = this.formatPower(this._powerGeneration + this._gridCharging);
    const capacityFormatted = this._batteryCapacity > 0 ? `${this._batteryCapacity} kWh` : 'Unknown';
    
    // Determine battery status color
    let batteryColor = '#4CAF50'; // Green
    if (batteryPercentage < 20) {
      batteryColor = '#f44336'; // Red
    } else if (batteryPercentage < 50) {
      batteryColor = '#ff9800'; // Orange
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          font-family: var(--ha-card-header-font-family, inherit);
        }
        
        .card {
          background: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
          overflow: hidden;
        }
        
        .header {
          padding: 16px 16px 0 16px;
          font-size: 16px;
          font-weight: 500;
          color: var(--primary-text-color, #000);
        }
        
        .content {
          padding: 16px;
        }
        
        .battery-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        
        .battery-icon {
          width: 40px;
          height: 20px;
          border: 2px solid var(--primary-text-color, #000);
          border-radius: 3px;
          position: relative;
          margin-right: 12px;
        }
        
        .battery-icon::after {
          content: '';
          position: absolute;
          right: -4px;
          top: 4px;
          width: 2px;
          height: 8px;
          background: var(--primary-text-color, #000);
          border-radius: 0 1px 1px 0;
        }
        
        .battery-fill {
          height: 100%;
          background: ${batteryColor};
          border-radius: 1px;
          transition: width 0.3s ease;
          width: ${batteryPercentage}%;
        }
        
        .battery-text {
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-text-color, #000);
        }
        
        .battery-left {
          display: flex;
          align-items: center;
        }
        
        .battery-capacity {
          font-size: 18px;
          font-weight: 600;
          color: var(--secondary-text-color, #666);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .stat-item {
          text-align: center;
          padding: 12px;
          background: var(--divider-color, #f0f0f0);
          border-radius: 8px;
        }
        
        .stat-label {
          font-size: 12px;
          color: var(--secondary-text-color, #666);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color, #000);
        }
        
        .runtime-display {
          text-align: center;
          padding: 16px;
          background: linear-gradient(135deg, ${batteryColor}20, ${batteryColor}10);
          border-radius: 8px;
          border: 1px solid ${batteryColor}40;
        }
        
        .runtime-label {
          font-size: 14px;
          color: var(--secondary-text-color, #666);
          margin-bottom: 8px;
        }
        
        .runtime-value {
          font-size: 24px;
          font-weight: 700;
          color: ${batteryColor};
        }
        
        .last-update {
          text-align: center;
          font-size: 11px;
          color: var(--secondary-text-color, #999);
          margin-top: 12px;
        }
        
        .warning {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 12px;
        }
        
        .error {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          margin-bottom: 12px;
        }
      </style>
      
      <div class="card">
        <div class="header">${this._config.name}</div>
        <div class="content">
          ${this.renderWarnings()}
          
          <div class="battery-container">
            <div class="battery-left">
              <div class="battery-icon">
                <div class="battery-fill"></div>
              </div>
              <div class="battery-text">${batteryPercentage}%</div>
            </div>
            <div class="battery-capacity">${capacityFormatted}</div>
          </div>
          
          <div class="stats-grid">
            ${this._config.show_power ? `
              <div class="stat-item">
                <div class="stat-label">Power Usage</div>
                <div class="stat-value">${powerFormatted}</div>
              </div>
            ` : ''}
            
            ${this._config.generation_entity && this._isCharging ? `
              <div class="stat-item">
                <div class="stat-label">Solar</div>
                <div class="stat-value">${generationFormatted}</div>
              </div>
            ` : ''}
            
            ${this._config.grid_charging_entity && this._isCharging ? `
              <div class="stat-item">
                <div class="stat-label">Grid Charge</div>
                <div class="stat-value">${gridChargingFormatted}</div>
              </div>
            ` : ''}
            
            ${(this._config.generation_entity || this._config.grid_charging_entity) && this._isCharging ? `
              <div class="stat-item">
                <div class="stat-label">Total Charge</div>
                <div class="stat-value">${totalChargingFormatted}</div>
              </div>
            ` : ''}
            
          </div>
          
          ${this._config.show_runtime && !this._isCharging ? `
            <div class="runtime-display">
              <div class="runtime-label">Estimated Runtime</div>
              <div class="runtime-value">${runtimeFormatted}</div>
            </div>
          ` : ''}
          
          ${this._config.show_charge_time && this._isCharging && (this._config.generation_entity || this._config.grid_charging_entity) ? `
            <div class="runtime-display" style="background: linear-gradient(135deg, #2196F320, #2196F310); border-color: #2196F340;">
              <div class="runtime-label">Charge Time Remaining</div>
              <div class="runtime-value" style="color: #2196F3;">${chargeTimeFormatted}</div>
            </div>
          ` : ''}
          
          ${this._lastUpdate ? `
            <div class="last-update">
              Last updated: ${this._lastUpdate.toLocaleTimeString()}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  renderWarnings() {
    const warnings = [];
    
    if (this._batteryLevel < 20) {
      warnings.push('<div class="warning">⚠️ Low battery level!</div>');
    }
    
    if (this._batteryCapacity <= 0) {
      warnings.push('<div class="error">❌ Battery capacity not configured</div>');
    }
    
    if (this._powerConsumption <= 0) {
      warnings.push('<div class="error">❌ No power consumption data</div>');
    }
    
    
    return warnings.join('');
  }

  connectedCallback() {
    if (this._config.update_interval > 0) {
      this._interval = setInterval(() => {
        this.updateData();
      }, this._config.update_interval * 1000);
    }
  }

  disconnectedCallback() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }
}

customElements.define('battery-runtime-calculator', BatteryRuntimeCalculator);

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'battery-runtime-calculator',
  name: 'House Battery Runtime Calculator',
  description: 'Calculate battery runtime and charge time for home battery systems',
  preview: true,
  documentationURL: 'https://github.com/your-username/house-battery-runtime-calculator'
});
