import { LitElement, html, css, } from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";
class NetworkTariffCard extends LitElement {
    constructor() {
        super(...arguments);
        // Declare variables globally
        this.entity = null;
        this.blocksArray = [];
        this.defaultColorMap = {
            1: '#03045e',
            2: '#0077b6',
            3: '#00b4d8',
            4: '#90e0ef',
            5: '#caf0f8'
        };
        this.colorMap = null;
    }
    static get properties() {
        return {
            hass: { type: Object },
            config: { type: Object },
        };
    }
    setConfig(config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        this.config = Object.assign({ showHours: (() => {
                if (config.showHours !== undefined) { // Check if showHours is present
                    if (typeof config.showHours === 'boolean') {
                        return config.showHours; // Return the valid boolean value
                    }
                    else {
                        throw new Error(`Invalid value for showHours: ${config.showHours}. It must be a boolean. True or False.`);
                    }
                }
                return true; // Default to true if showHours is not present
            })(), offsetHours: (() => {
                if (config.offsetHours !== undefined) { // Check if offsetHours is present
                    if (typeof config.offsetHours === 'boolean') {
                        return config.offsetHours; // Return the valid boolean value
                    }
                    else {
                        throw new Error(`Invalid value for offsetHours: ${config.offsetHours}. It must be a boolean. True or False.`);
                    }
                }
                return false; // Default to true if offsetHours is not present
            })(), outerRadius: config.outerRadius || 40, innerRadius: config.innerRadius || 32, name: config.name || '', colorMap: Object.assign({}, config.colorMap // User-defined colors will overwrite defaults
            ) }, config);

    }
    // The createSegment function now calculates each path segment of the donut chart
    createSegment(i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor, offsetHours, showHours) {
        const angle = (2 * Math.PI) / totalSegments; // Angle per segment
        const offset = showHours ? 0 : 5;
        const offsetAngle = offsetHours ? 0.132 : 0;
        // Calculate coordinates for the outer arc
        const x1 = 50 + (outerRadius + offset) * Math.cos(i * angle - Math.PI / 2);
        const y1 = 50 + (outerRadius + offset) * Math.sin(i * angle - Math.PI / 2);
        const x2 = 50 + (outerRadius + offset) * Math.cos((i + 1) * angle - Math.PI / 2);
        const y2 = 50 + (outerRadius + offset) * Math.sin((i + 1) * angle - Math.PI / 2);
        // Calculate coordinates for the inner arc (the hole)
        const x3 = 50 + (innerRadius + offset) * Math.cos((i + 1) * angle - Math.PI / 2);
        const y3 = 50 + (innerRadius + offset) * Math.sin((i + 1) * angle - Math.PI / 2);
        const x4 = 50 + (innerRadius + offset) * Math.cos(i * angle - Math.PI / 2);
        const y4 = 50 + (innerRadius + offset) * Math.sin(i * angle - Math.PI / 2);
        const segmentValue = this.blocksArray[i];
        // Determine the segment color
        const segmentColor = (this.colorMap[segmentValue] !== undefined ? this.colorMap[segmentValue] : this.defaultColorMap[segmentValue]) || '#000'; // Default to black if no match
        // Calculate the position for the number label
        const labelRadius = outerRadius + 5; // Slightly outside the outer radius
        const labelX = 50 + labelRadius * Math.cos((i + 0.5) * angle - Math.PI / 2 + offsetAngle);
        const labelY = 50 + labelRadius * Math.sin((i + 0.5) * angle - Math.PI / 2 + offsetAngle);
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
    }
	
	// Check if 'hass' has changed
	updated(changedProperties) {
        if (changedProperties.has('hass')) {
            this.firstUpdated(); // Call update whenever 'hass' changes
        }
    }

	// Draw SVG
    firstUpdated() {
        const svg = this.shadowRoot.querySelector(".circle-clock");
        // Access the entity from Home Assistant's hass object
        this.entity = this.hass.states[this.config.entity];
        if (!this.entity)
            return; // Exit if the entity is not available
        const state = this.entity ? this.entity.state : 'Unavailable';
        this.blocks = this.entity.attributes.blocks || Array(24).fill(1);
        this.blocksArray = Array.isArray(this.blocks) ? this.blocks : this.blocks.split(',').map(Number);
		
        const now = new Date();
        const currentHour = now.getHours();
        //const colorMap = this.config.colorMap;
        this.colorMap = this.config.colorMap;
        const totalSegments = 24;
        const outerRadius = this.config.outerRadius !== undefined ? this.config.outerRadius : 40;
        const innerRadius = this.config.innerRadius !== undefined ? this.config.innerRadius : 32;
        const offsetHours = this.config.offsetHours !== undefined ? this.config.offsetHours : false;
        const showHours = this.config.showHours !== undefined ? this.config.showHours : true;
        const strokeColor = "rgba(0, 0, 0, 1)"; // Line separating each segment
        const strokeWidth = 0.3;
        const textColor = "rgba(150, 150, 150, 1)";
        // Create daily blocks
        const segments = Array.from({ length: totalSegments }, (_, i) => this.createSegment(i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor, offsetHours, showHours)).join('');
        // Create current hour section
        const currentHourSegment = this.createSegment(currentHour, totalSegments, innerRadius - 1, innerRadius - 5, 'black', 0.3, 'rgba(0, 0, 0, 0)', offsetHours, showHours);
        // Render out
        svg.innerHTML = segments + currentHourSegment;
    }
    render() {
        const entity = this.hass.states[this.config.entity];
        const state = entity ? entity.state : 'Unavailable';
        return html `
		  <ha-card>
			<div class="tariffcard">
			  <div class="name">${this.config.name || 'Entity'}</div>
			  <div class="circle-container">
				<div class="state">${state}</div>
				<svg class="circle-clock" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"></svg>
			  </div>
			</div>
		  </ha-card>
		`;
    }
}
NetworkTariffCard.styles = css `
		.tariffcard {
		  display: flex;
		  justify-content: center;
		  align-items: center;
		  text-align: center;
		  padding: 20px;
		  
		  color: var(--tariff-card-text-color, var(--primary-text-color, black));
		  border-radius: var(--tariff-card-border-radius, var(--ha-card-border-radius, 12px));
		  box-shadow: var(--ha-card-box-shadow, none);
		  position: relative;
		  overflow: hidden;
		  width: calc(100% - 40px);
		  height: calc(100% - 40px);
		}

		.circle-container {
		  position: relative;
		  width: 100%;
		  height: 100%;
		  max-width: min(100vw, 100vh);
		  max-height: min(100vw, 100vh);
		  margin: 0 auto;
		}

		.circle-clock {
		  width: 100%;
		  height: 100%;
		  display: block;
		  
		}

		.state {
		  font-size: var(--tariff-card-state-font-size, 48px);
		  position: absolute;
		  top: 50%;
		  left: 50%;
		  transform: translate(-50%, -50%);
		  z-index: 1;
		}

		.name {
		  font-size: var(--tariff-card-name-font-size, 12px);
		  position: absolute;
		  top: calc(50% - 25px);
		  left: 50%;
		  transform: translate(-50%, -50%);
		  z-index: 1;
		}
	  `;
customElements.define('network-tariff-card', NetworkTariffCard);
console.info("%c  NETWORK-TARIFF-CARD  %c  Version: " + "v1.0.4".padEnd(7, " "), "color: orange; font-weight: bold; background: black", "color: white; font-weight: bold; background: dimgray");