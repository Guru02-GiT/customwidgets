class CustomGaugeChart extends HTMLElement {
  constructor() {
    super();
    // Attach a shadow DOM for style encapsulation
    this.attachShadow({ mode: 'open' });
    // Initial render of the component
    this.render();
  }
 
  // Setter to receive data from SAC binding
  set dataSource(dataBinding) {
    if (dataBinding && dataBinding.data) {
      // Extract the measure value; adapt this as per your data structure
      const measure = dataBinding.data[0]?.measureValues[0]?.raw;
      if (measure !== undefined) {
        this.renderGauge(measure);
      }
    }
  }
 
  // Render the basic structure and styles
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        @import "./style.css";
      </style>
      <div class="gauge-container">
        <svg viewBox="0 0 200 100" class="gauge-svg">
          <!-- Background arc -->
          <path class="gauge-bg" d="M10,100 A90,90 0 0,1 190,100" />
          <!-- Foreground dynamic fill; this path gets updated dynamically -->
          <path id="gauge-fill" class="gauge-fill" d="" />
        </svg>
        <!-- Center text to show the measure value -->
        <div id="gauge-value" class="gauge-value">0</div>
      </div>
    `;
  }
 
  // Update the gauge fill and center text based on the value
  renderGauge(value) {
    // Calculate the angle; assuming value is between 0 and 100.
    // Multiply by 1.8 to map 100 to 180 degrees.
    const angle = Math.min(Math.max(value, 0), 100) * 1.8;
    // Compute the end point on the arc using basic circle math
    const x = 100 + 90 * Math.cos((180 - angle) * Math.PI / 180);
    const y = 100 - 90 * Math.sin((180 - angle) * Math.PI / 180);
    // Determine if the arc should be large (for values over 50)
    const largeArc = value > 50 ? 1 : 0;
 
    // Create an SVG path for the dynamic fill
    const path = `M10,100 A90,90 0 ${largeArc},1 ${x},${y}`;
    // Update the SVG path attribute
    this.shadowRoot.getElementById('gauge-fill').setAttribute('d', path);
    // Update the text in the center
    this.shadowRoot.getElementById('gauge-value').textContent = value;
  }
}
 
// Define the custom element so it can be used as <custom-gauge-chart>
customElements.define('custom-gauge-chart', CustomGaugeChart);