"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var NetworkTariffCard = /** @class */ (function (_super) {
    __extends(NetworkTariffCard, _super);
    function NetworkTariffCard() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NetworkTariffCard.prototype.setConfig = function (config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        // Set the default hole size if not provided
        this.config = __assign({ showHours: (function () {
                if (config.showHours !== undefined) { // Check if showHours is present
                    if (typeof config.showHours === 'boolean') {
                        return config.showHours; // Return the valid boolean value
                    }
                    else {
                        throw new Error("Invalid value for showHours: ".concat(config.showHours, ". It must be a boolean."));
                    }
                }
                return true; // Default to true if showHours is not present
            })(), outerRadius: config.outerRadius || 40, innerRadius: config.innerRadius || 32, colorMap: __assign({}, config.colorMap // User-defined colors will overwrite defaults
            ) }, config);
        this.attachShadow({ mode: 'open' });
    };
    Object.defineProperty(NetworkTariffCard.prototype, "hass", {
        set: function (hass) {
            var _this = this;
            var entity = hass.states[this.config.entity];
            var state = entity ? entity.state : 'Unavailable';
            // Retrieve blocks from entity attributes and handle cases where it's not defined
            var blocks = entity.attributes.blocks || Array(24).fill(1); // Default to 24 hours with value 1 if blocks are not present
            var blocksArray = Array.isArray(blocks) ? blocks : blocks.split(',').map(Number); // Support both array and comma-separated string
            // Get current hour
            var now = new Date();
            var currentHour = now.getHours();
            if (!this.shadowRoot)
                return;
            // Use user-defined colorMap or default to predefined colors
            var colorMap = this.config.colorMap;
            // Helper function to create each segment as a donut slice for a 24-hour clock
            var createSegment = function (i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor) {
                if (showHours !== true) {
                    outerRadius = outerRadius + 5;
                    innerRadius = innerRadius + 5;
                }
                var angle = (2 * Math.PI) / totalSegments; // Angle per segment
                // Calculate coordinates for the outer arc
                var x1 = 50 + outerRadius * Math.cos(i * angle - Math.PI / 2);
                var y1 = 50 + outerRadius * Math.sin(i * angle - Math.PI / 2);
                var x2 = 50 + outerRadius * Math.cos((i + 1) * angle - Math.PI / 2);
                var y2 = 50 + outerRadius * Math.sin((i + 1) * angle - Math.PI / 2);
                // Calculate coordinates for the inner arc (the hole)
                var x3 = 50 + innerRadius * Math.cos((i + 1) * angle - Math.PI / 2);
                var y3 = 50 + innerRadius * Math.sin((i + 1) * angle - Math.PI / 2);
                var x4 = 50 + innerRadius * Math.cos(i * angle - Math.PI / 2);
                var y4 = 50 + innerRadius * Math.sin(i * angle - Math.PI / 2);
                // Get color based on the value for this hour (use user-defined color map or default to predefined colors)
                var segmentValue = blocksArray[i];
                var defaultColorMap = {
                    1: '#03045e',
                    2: '#0077b6',
                    3: '#00b4d8',
                    4: '#90e0ef',
                    5: '#caf0f8'
                };
                // Determine the segment color
                var segmentColor = (colorMap[segmentValue] !== undefined ? colorMap[segmentValue] : defaultColorMap[segmentValue]) || '#000'; // Default to black if no match
                // Calculate the position for the number label
                var labelRadius = outerRadius + 5; // Slightly outside the outer radius
                var labelX = 50 + labelRadius * Math.cos((i + 0.5) * angle - Math.PI / 2);
                var labelY = 50 + labelRadius * Math.sin((i + 0.5) * angle - Math.PI / 2);
                // Create the donut segment path and number label
                return "\n\t\t<path\n\t\t  d=\"M".concat(x1, ",").concat(y1, " A").concat(outerRadius, ",").concat(outerRadius, " 0 0,1 ").concat(x2, ",").concat(y2, " \n\t\t\t L").concat(x3, ",").concat(y3, " A").concat(innerRadius, ",").concat(innerRadius, " 0 0,0 ").concat(x4, ",").concat(y4, " Z\"\n\t\t  fill=\"").concat(segmentColor, "\" \n\t\t  stroke=\"").concat(strokeColor, "\" stroke-width=\"").concat(strokeWidth, "\"\n\t\t/>\n\t\t").concat(showHours ? "<text x=\"".concat(labelX, "\" y=\"").concat(labelY, "\" fill=\"").concat(textColor, "\" font-size=\"5\" text-anchor=\"middle\" alignment-baseline=\"middle\">").concat(i + 1, "</text>") : '', "\n\t  ");
            };
            // Generate the 24 segments for the donut clock
            var totalSegments = 24;
            var showHours = this.config.showHours;
            var outerRadius = this.config.outerRadius; // Customizable inner radius (hole size)
            var innerRadius = this.config.innerRadius; // Customizable inner radius (hole size)
            var strokeColor = "rgba(0, 0, 0, 1)"; // Line separating each segment
            var strokeWidth = 0.3;
            var textColor = "rgba(150, 150, 150, 1)";
            var segments = Array.from({ length: totalSegments }, function (_, i) {
                return createSegment.call(_this, i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor);
            }).join('');
            // Create current hour section
            var currentHourSegment = createSegment.call(this, currentHour, totalSegments, innerRadius - 1, innerRadius - 5, 'black', 0.3, 'rgba(0, 0, 0, 0)');
            // Update the shadow DOM with the correct SVG for the donut clock
            this.shadowRoot.innerHTML = "\n<style>\n  .tariffcard {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    text-align: center;\n    padding: 20px;\n\n    background-color: var(--ha-card-background, var(--card-background-color, #fff));\n    color: var(--primary-text-color, black);\n    border-radius: var(--ha-card-border-radius, 12px);\n    box-shadow: var(--ha-card-box-shadow, none);\n    position: relative;\n    overflow: hidden; /* Prevent overflow */\n    width: calc(100% - 40px); /* Subtract left + right padding (20px each) */\n    height: calc(100% - 40px); /* Subtract top + bottom padding */\n  }\n\n  .circle-container {\n    position: relative;\n    width: 100%; /* Let it be responsive to the parent's width */\n    height: 100%; /* Responsive to height */\n    max-width: min(100vw, 100vh); /* Ensure it fits within the smallest viewport dimension */\n    max-height: min(100vw, 100vh); /* Use the smallest dimension to avoid overflow */\n    margin: 0 auto; /* Center horizontally */\n  }\n\n  .circle-clock {\n    width: 100%;\n    height: 100%;\n    display: block;\n  }\n\n  .state {\n    font-size: 48px;\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n    z-index: 1;\n  }\n\n  .name {\n    font-size: 12px;\n    margin-bottom: 10px;\n    position: absolute;\n    top: calc(50% - 25px);\n    left: 50%;\n    transform: translate(-50%, -50%);\n    z-index: 1;\n  }\n  }\n</style>\n\n<div class=\"tariffcard\">\n  <div class=\"name\">".concat(this.config.name || 'Entity', "</div>\n  <div class=\"circle-container\">\n    <div class=\"state\">").concat(state, "</div>\n    <svg class=\"circle-clock\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\">\n      ").concat(segments, "\n      ").concat(currentHourSegment, " <!-- Add the current hour segment here -->\n    </svg>\n  </div>\n</div>\n\n\n    ");
        },
        enumerable: false,
        configurable: true
    });
    NetworkTariffCard.prototype.getCardSize = function () {
        return 1;
    };
    return NetworkTariffCard;
}(HTMLElement));
customElements.define('network-tariff-card', NetworkTariffCard);
