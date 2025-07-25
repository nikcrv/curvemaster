# Интерактивная карта экосистемы Curve

!!! warning "В разработке"
    Интерактивная карта находится в активной разработке. Данные на карте являются тестовыми и неполными. Некоторые функции могут работать нестабильно.

<div class="ecosystem-container">
  <div id="ecosystem-map" style="width: 100%; background: var(--md-default-bg-color--lighter); border-radius: 8px; padding: 20px; margin: 0; min-height: 600px;">
    <p style="text-align: center; color: var(--md-default-fg-color--lighter);">
      <span class="loading-spinner"></span>
      Загрузка интерактивной карты...
    </p>
  </div>
  <div class="ecosystem-controls-wrapper">
    <div class="ecosystem-controls-row"></div>
  </div>
</div>

<style>
/* Main container */
.ecosystem-container {
  width: 100%;
  margin: 0 auto;
}

/* Ecosystem map container */
#ecosystem-map {
  position: relative;
  background: linear-gradient(135deg, 
    var(--md-default-bg-color) 0%, 
    var(--md-default-bg-color--lighter) 50%, 
    var(--md-default-bg-color--light) 100%);
  min-height: 600px;
}

/* Controls wrapper below map */
.ecosystem-controls-wrapper {
  margin-top: 20px;
  width: 100%;
}

.ecosystem-controls-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

/* Controls */
.ecosystem-controls {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 10px;
  align-items: center;
}

.ecosystem-controls h3 {
  margin: 0;
  margin-right: 10px;
  font-size: 14px;
  color: var(--md-default-fg-color);
  font-weight: 500;
}

.ecosystem-controls button {
  padding: 6px 14px;
  background: var(--md-primary-fg-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.ecosystem-controls button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background: var(--md-primary-fg-color--light);
}

/* Legend */
.ecosystem-legend {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ecosystem-legend h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: var(--md-default-fg-color);
  font-weight: 500;
}

.legend-items {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--md-default-fg-color);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 6px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
}

/* Dark theme adjustments */
[data-md-color-scheme="slate"] .ecosystem-controls,
[data-md-color-scheme="slate"] .ecosystem-legend,
[data-md-color-scheme="curve-chad"] .ecosystem-controls,
[data-md-color-scheme="curve-chad"] .ecosystem-legend {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

[data-md-color-scheme="slate"] .ecosystem-controls button,
[data-md-color-scheme="curve-chad"] .ecosystem-controls button {
  background: rgba(255, 255, 255, 0.1);
  color: var(--md-default-fg-color);
}

[data-md-color-scheme="slate"] .ecosystem-controls button:hover,
[data-md-color-scheme="curve-chad"] .ecosystem-controls button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: var(--md-primary-fg-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 10px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Tooltip styles */
.ecosystem-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px;
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
  font-size: 13px;
  max-width: 250px;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.ecosystem-tooltip h4 {
  margin: 0 0 8px 0;
  color: #fff;
  font-size: 14px;
}

.ecosystem-tooltip p {
  margin: 4px 0;
  line-height: 1.4;
}

/* Node and link styles */
.node {
  cursor: pointer;
}

.node circle {
  transition: r 0.2s ease;
}

.node:hover {
  filter: brightness(1.2);
}

/* Fullscreen mode styles */
.ecosystem-container:fullscreen {
  padding: 20px;
  overflow: hidden;
}

.ecosystem-container:fullscreen .ecosystem-controls-wrapper {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  margin-top: 0;
}

.ecosystem-container:fullscreen #ecosystem-map {
  margin-bottom: 0;
}

/* Responsive */
@media screen and (max-width: 768px) {
  .ecosystem-controls-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .ecosystem-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .ecosystem-controls h3 {
    margin-bottom: 8px;
  }
  
  .ecosystem-controls button {
    width: 100%;
    justify-content: center;
  }
  
  .legend-items {
    flex-direction: column;
    gap: 8px;
  }
  
  .ecosystem-container:fullscreen .ecosystem-controls-wrapper {
    left: 20px;
    right: 20px;
    transform: none;
  }
}
</style>