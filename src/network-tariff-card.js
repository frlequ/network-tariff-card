class NetworkTariffCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }


    // Set the default hole size if not provided
	this.config = {
		showHours: (() => {
			if (config.showHours !== undefined) { // Check if showHours is present
				if (typeof config.showHours === 'boolean') {
					return config.showHours; // Return the valid boolean value
				} else {
					throw new Error(`Invalid value for showHours: ${config.showHours}. It must be a boolean.`);
				}
			}
			return true; // Default to true if showHours is not present
		})(),
	  outerRadius: config.outerRadius || 40, // Default hole size, can be adjusted
	  innerRadius: config.innerRadius || 32, // Default hole size, can be adjusted
	  colorMap: {

		...config.colorMap // User-defined colors will overwrite defaults
	  },
	  ...config
	};

    this.attachShadow({ mode: 'open' });
  }

  set hass(hass) {

    const entity = hass.states[this.config.entity];
    const state = entity ? entity.state : 'Unavailable';

    // Retrieve blocks from entity attributes and handle cases where it's not defined
    const blocks = entity.attributes.blocks || Array(24).fill(1); // Default to 24 hours with value 1 if blocks are not present
    const blocksArray = Array.isArray(blocks) ? blocks : blocks.split(',').map(Number); // Support both array and comma-separated string

    // Get current hour
    const now = new Date();
    const currentHour = now.getHours();

    if (!this.shadowRoot) return;

	// Use user-defined colorMap or default to predefined colors
	const colorMap = this.config.colorMap;
	

	// Helper function to create each segment as a donut slice for a 24-hour clock
	const createSegment = (i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor) => {
		
		
		if (showHours !== true) {
			outerRadius = outerRadius + 5;
			innerRadius = innerRadius + 5;
		}
	  const angle = (2 * Math.PI) / totalSegments; // Angle per segment

	  // Calculate coordinates for the outer arc
	  const x1 = 50 + outerRadius * Math.cos(i * angle - Math.PI / 2);
	  const y1 = 50 + outerRadius * Math.sin(i * angle - Math.PI / 2);
	  const x2 = 50 + outerRadius * Math.cos((i + 1) * angle - Math.PI / 2);
	  const y2 = 50 + outerRadius * Math.sin((i + 1) * angle - Math.PI / 2);

	  // Calculate coordinates for the inner arc (the hole)
	  const x3 = 50 + innerRadius * Math.cos((i + 1) * angle - Math.PI / 2);
	  const y3 = 50 + innerRadius * Math.sin((i + 1) * angle - Math.PI / 2);
	  const x4 = 50 + innerRadius * Math.cos(i * angle - Math.PI / 2);
	  const y4 = 50 + innerRadius * Math.sin(i * angle - Math.PI / 2);

	  // Get color based on the value for this hour (use user-defined color map or default to predefined colors)
	  const segmentValue = blocksArray[i];
	  const defaultColorMap = {
		1: '#03045e',
		2: '#0077b6',
		3: '#00b4d8',
		4: '#90e0ef',
		5: '#caf0f8'
	  };
	  // Determine the segment color
	  const segmentColor = (colorMap[segmentValue] !== undefined ? colorMap[segmentValue] : defaultColorMap[segmentValue]) || '#000'; // Default to black if no match

	  // Calculate the position for the number label
	  const labelRadius = outerRadius + 5; // Slightly outside the outer radius
	  const labelX = 50 + labelRadius * Math.cos((i + 0.5) * angle - Math.PI / 2);
	  const labelY = 50 + labelRadius * Math.sin((i + 0.5) * angle - Math.PI / 2);

	  // Create the donut segment path and number label
	  return `
		<path
		  d="M${x1},${y1} A${outerRadius},${outerRadius} 0 0,1 ${x2},${y2} 
			 L${x3},${y3} A${innerRadius},${innerRadius} 0 0,0 ${x4},${y4} Z"
		  fill="${segmentColor}" 
		  stroke="${strokeColor}" stroke-width="${strokeWidth}"
		/>
		${showHours ? `<text x="${labelX}" y="${labelY}" fill="${textColor}" font-size="5" text-anchor="middle" alignment-baseline="middle">${i + 1}</text>` : ''}
	  `;
	};
    // Generate the 24 segments for the donut clock
    const totalSegments = 24;
	const showHours = this.config.showHours;
    const outerRadius = this.config.outerRadius; // Customizable inner radius (hole size)
    const innerRadius = this.config.innerRadius; // Customizable inner radius (hole size)
    const strokeColor = "rgba(0, 0, 0, 1)"; // Line separating each segment
    const strokeWidth = 0.3;
	const textColor = "rgba(150, 150, 150, 1)";

    const segments = Array.from({ length: totalSegments }, (_, i) =>
      createSegment.call(this, i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor)
    ).join('');

    // Create current hour section
    const currentHourSegment = createSegment.call(this, currentHour, totalSegments, innerRadius - 1, innerRadius - 5, 'black', 0.3, 'rgba(0, 0, 0, 0)');
    
    // Update the shadow DOM with the correct SVG for the donut clock
    this.shadowRoot.innerHTML = `
<style>
  .tariffcard {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 20px;

    background-color: var(--ha-card-background, var(--card-background-color, #fff));
    color: var(--primary-text-color, black);
    border-radius: var(--ha-card-border-radius, 12px);
    box-shadow: var(--ha-card-box-shadow, none);
    position: relative;
    overflow: hidden; /* Prevent overflow */
    width: calc(100% - 40px); /* Subtract left + right padding (20px each) */
    height: calc(100% - 40px); /* Subtract top + bottom padding */
  }

  .circle-container {
    position: relative;
    width: 100%; /* Let it be responsive to the parent's width */
    height: 100%; /* Responsive to height */
    max-width: min(100vw, 100vh); /* Ensure it fits within the smallest viewport dimension */
    max-height: min(100vw, 100vh); /* Use the smallest dimension to avoid overflow */
    margin: 0 auto; /* Center horizontally */
  }

  .circle-clock {
    width: 100%;
    height: 100%;
    display: block;
  }

  .state {
    font-size: 48px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .name {
    font-size: 12px;
    margin-bottom: 10px;
    position: absolute;
    top: calc(50% - 25px);
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
  }
  }
</style>

<div class="tariffcard">
  <div class="name">${this.config.name || 'Entity'}</div>
  <div class="circle-container">
    <div class="state">${state}</div>
    <svg class="circle-clock" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      ${segments}
      ${currentHourSegment} <!-- Add the current hour segment here -->
    </svg>
  </div>
</div>


    `;
  }

  getCardSize() {
    return 1;
  }
}

customElements.define('network-tariff-card', NetworkTariffCard);
