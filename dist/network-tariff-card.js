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
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var lit_element_js_module_1 = require("https://unpkg.com/lit-element@2.0.1/lit-element.js?module");
var NetworkTariffCard = /** @class */ (function (_super) {
    __extends(NetworkTariffCard, _super);
    function NetworkTariffCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Declare variables globally
        _this.entity = null;
        _this.blocksArray = [];
        _this.defaultColorMap = {
            1: '#03045e',
            2: '#0077b6',
            3: '#00b4d8',
            4: '#90e0ef',
            5: '#caf0f8'
        };
        _this.colorMap = null;
        return _this;
    }
    Object.defineProperty(NetworkTariffCard, "properties", {
        get: function () {
            return {
                hass: { type: Object },
                config: { type: Object },
            };
        },
        enumerable: false,
        configurable: true
    });
    NetworkTariffCard.prototype.setConfig = function (config) {
        if (!config.entity) {
            throw new Error('You need to define an entity');
        }
        this.config = __assign({ showHours: (function () {
                if (config.showHours !== undefined) { // Check if showHours is present
                    if (typeof config.showHours === 'boolean') {
                        return config.showHours; // Return the valid boolean value
                    }
                    else {
                        throw new Error("Invalid value for showHours: ".concat(config.showHours, ". It must be a boolean. True or False."));
                    }
                }
                return true; // Default to true if showHours is not present
            })(), offsetHours: (function () {
                if (config.offsetHours !== undefined) { // Check if offsetHours is present
                    if (typeof config.offsetHours === 'boolean') {
                        return config.offsetHours; // Return the valid boolean value
                    }
                    else {
                        throw new Error("Invalid value for offsetHours: ".concat(config.offsetHours, ". It must be a boolean. True or False."));
                    }
                }
                return false; // Default to true if offsetHours is not present
            })(), outerRadius: config.outerRadius || 40, innerRadius: config.innerRadius || 32, name: config.name || '', colorMap: __assign({}, config.colorMap // User-defined colors will overwrite defaults
            ) }, config);
        //this.attachShadow({ mode: 'open' });
    };
    // The createSegment function now calculates each path segment of the donut chart
    NetworkTariffCard.prototype.createSegment = function (i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor, offsetHours, showHours) {
        var angle = (2 * Math.PI) / totalSegments; // Angle per segment
        var offset = showHours ? 0 : 5;
        var offsetAngle = offsetHours ? 0.132 : 0;
        // Calculate coordinates for the outer arc
        var x1 = 50 + (outerRadius + offset) * Math.cos(i * angle - Math.PI / 2);
        var y1 = 50 + (outerRadius + offset) * Math.sin(i * angle - Math.PI / 2);
        var x2 = 50 + (outerRadius + offset) * Math.cos((i + 1) * angle - Math.PI / 2);
        var y2 = 50 + (outerRadius + offset) * Math.sin((i + 1) * angle - Math.PI / 2);
        // Calculate coordinates for the inner arc (the hole)
        var x3 = 50 + (innerRadius + offset) * Math.cos((i + 1) * angle - Math.PI / 2);
        var y3 = 50 + (innerRadius + offset) * Math.sin((i + 1) * angle - Math.PI / 2);
        var x4 = 50 + (innerRadius + offset) * Math.cos(i * angle - Math.PI / 2);
        var y4 = 50 + (innerRadius + offset) * Math.sin(i * angle - Math.PI / 2);
        var segmentValue = this.blocksArray[i];
        // Determine the segment color
        var segmentColor = (this.colorMap[segmentValue] !== undefined ? this.colorMap[segmentValue] : this.defaultColorMap[segmentValue]) || '#000'; // Default to black if no match
        // Calculate the position for the number label
        var labelRadius = outerRadius + 5; // Slightly outside the outer radius
        var labelX = 50 + labelRadius * Math.cos((i + 0.5) * angle - Math.PI / 2 + offsetAngle);
        var labelY = 50 + labelRadius * Math.sin((i + 0.5) * angle - Math.PI / 2 + offsetAngle);
        // Create the donut segment path and number label
        return "\n\t\t  <path\n\t\t\td=\"M".concat(x1, ",").concat(y1, " A").concat(outerRadius, ",").concat(outerRadius, " 0 0,1 ").concat(x2, ",").concat(y2, " \n\t\t\t   L").concat(x3, ",").concat(y3, " A").concat(innerRadius, ",").concat(innerRadius, " 0 0,0 ").concat(x4, ",").concat(y4, " Z\"\n\t\t\tfill=\"").concat(segmentColor, "\" \n\t\t\tstroke=\"").concat(strokeColor, "\" stroke-width=\"").concat(strokeWidth, "\"\n\t\t  />\n\t\t  ").concat(showHours ? "<text x=\"".concat(labelX, "\" y=\"").concat(labelY, "\" fill=\"").concat(textColor, "\" font-size=\"5\" text-anchor=\"middle\" alignment-baseline=\"middle\">").concat(i + 1, "</text>") : '', "\n\t\t");
    };
    NetworkTariffCard.prototype.firstUpdated = function () {
        var _this = this;
        var svg = this.shadowRoot.querySelector(".circle-clock");
        // Access the entity from Home Assistant's hass object
        this.entity = this.hass.states[this.config.entity];
        if (!this.entity)
            return; // Exit if the entity is not available
        var state = this.entity ? this.entity.state : 'Unavailable';
        this.blocks = this.entity.attributes.blocks || Array(24).fill(1);
        this.blocksArray = Array.isArray(this.blocks) ? this.blocks : this.blocks.split(',').map(Number);
        var now = new Date();
        var currentHour = now.getHours();
        //const colorMap = this.config.colorMap;
        this.colorMap = this.config.colorMap;
        var totalSegments = 24;
        var outerRadius = this.config.outerRadius !== undefined ? this.config.outerRadius : 40;
        var innerRadius = this.config.innerRadius !== undefined ? this.config.innerRadius : 32;
        var offsetHours = this.config.offsetHours !== undefined ? this.config.offsetHours : false;
        var showHours = this.config.showHours !== undefined ? this.config.showHours : true;
        var strokeColor = "rgba(0, 0, 0, 1)"; // Line separating each segment
        var strokeWidth = 0.3;
        var textColor = "rgba(150, 150, 150, 1)";
        // Create daily blocks
        var segments = Array.from({ length: totalSegments }, function (_, i) {
            return _this.createSegment(i, totalSegments, outerRadius, innerRadius, strokeColor, strokeWidth, textColor, offsetHours, showHours);
        }).join('');
        // Create current hour section
        var currentHourSegment = this.createSegment(currentHour, totalSegments, innerRadius - 1, innerRadius - 5, 'black', 0.3, 'rgba(0, 0, 0, 0)', offsetHours, showHours);
        // Render out
        svg.innerHTML = segments + currentHourSegment;
    };
    NetworkTariffCard.prototype.render = function () {
        var entity = this.hass.states[this.config.entity];
        var state = entity ? entity.state : 'Unavailable';
        return (0, lit_element_js_module_1.html)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n\t\t  <ha-card>\n\t\t\t<div class=\"tariffcard\">\n\t\t\t  <div class=\"name\">", "</div>\n\t\t\t  <div class=\"circle-container\">\n\t\t\t\t<div class=\"state\">", "</div>\n\t\t\t\t<svg class=\"circle-clock\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"></svg>\n\t\t\t  </div>\n\t\t\t</div>\n\t\t  </ha-card>\n\t\t"], ["\n\t\t  <ha-card>\n\t\t\t<div class=\"tariffcard\">\n\t\t\t  <div class=\"name\">", "</div>\n\t\t\t  <div class=\"circle-container\">\n\t\t\t\t<div class=\"state\">", "</div>\n\t\t\t\t<svg class=\"circle-clock\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\"></svg>\n\t\t\t  </div>\n\t\t\t</div>\n\t\t  </ha-card>\n\t\t"])), this.config.name || 'Entity', state);
    };
    NetworkTariffCard.styles = (0, lit_element_js_module_1.css)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n\t\t.tariffcard {\n\t\t  display: flex;\n\t\t  justify-content: center;\n\t\t  align-items: center;\n\t\t  text-align: center;\n\t\t  padding: 20px;\n\t\t  \n\t\t  color: var(--tariff-card-text-color, var(--primary-text-color, black));\n\t\t  border-radius: var(--tariff-card-border-radius, var(--ha-card-border-radius, 12px));\n\t\t  box-shadow: var(--ha-card-box-shadow, none);\n\t\t  position: relative;\n\t\t  overflow: hidden;\n\t\t  width: calc(100% - 40px);\n\t\t  height: calc(100% - 40px);\n\t\t}\n\n\t\t.circle-container {\n\t\t  position: relative;\n\t\t  width: 100%;\n\t\t  height: 100%;\n\t\t  max-width: min(100vw, 100vh);\n\t\t  max-height: min(100vw, 100vh);\n\t\t  margin: 0 auto;\n\t\t}\n\n\t\t.circle-clock {\n\t\t  width: 100%;\n\t\t  height: 100%;\n\t\t  display: block;\n\t\t  \n\t\t}\n\n\t\t.state {\n\t\t  font-size: var(--tariff-card-state-font-size, 48px);\n\t\t  position: absolute;\n\t\t  top: 50%;\n\t\t  left: 50%;\n\t\t  transform: translate(-50%, -50%);\n\t\t  z-index: 1;\n\t\t}\n\n\t\t.name {\n\t\t  font-size: var(--tariff-card-name-font-size, 12px);\n\t\t  position: absolute;\n\t\t  top: calc(50% - 25px);\n\t\t  left: 50%;\n\t\t  transform: translate(-50%, -50%);\n\t\t  z-index: 1;\n\t\t}\n\t  "], ["\n\t\t.tariffcard {\n\t\t  display: flex;\n\t\t  justify-content: center;\n\t\t  align-items: center;\n\t\t  text-align: center;\n\t\t  padding: 20px;\n\t\t  \n\t\t  color: var(--tariff-card-text-color, var(--primary-text-color, black));\n\t\t  border-radius: var(--tariff-card-border-radius, var(--ha-card-border-radius, 12px));\n\t\t  box-shadow: var(--ha-card-box-shadow, none);\n\t\t  position: relative;\n\t\t  overflow: hidden;\n\t\t  width: calc(100% - 40px);\n\t\t  height: calc(100% - 40px);\n\t\t}\n\n\t\t.circle-container {\n\t\t  position: relative;\n\t\t  width: 100%;\n\t\t  height: 100%;\n\t\t  max-width: min(100vw, 100vh);\n\t\t  max-height: min(100vw, 100vh);\n\t\t  margin: 0 auto;\n\t\t}\n\n\t\t.circle-clock {\n\t\t  width: 100%;\n\t\t  height: 100%;\n\t\t  display: block;\n\t\t  \n\t\t}\n\n\t\t.state {\n\t\t  font-size: var(--tariff-card-state-font-size, 48px);\n\t\t  position: absolute;\n\t\t  top: 50%;\n\t\t  left: 50%;\n\t\t  transform: translate(-50%, -50%);\n\t\t  z-index: 1;\n\t\t}\n\n\t\t.name {\n\t\t  font-size: var(--tariff-card-name-font-size, 12px);\n\t\t  position: absolute;\n\t\t  top: calc(50% - 25px);\n\t\t  left: 50%;\n\t\t  transform: translate(-50%, -50%);\n\t\t  z-index: 1;\n\t\t}\n\t  "])));
    return NetworkTariffCard;
}(lit_element_js_module_1.LitElement));
customElements.define('network-tariff-card', NetworkTariffCard);
var templateObject_1, templateObject_2;
