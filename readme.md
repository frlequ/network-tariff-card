# Network Tariff Card for Home Assistant
A custom card for Home Assistant that visually displays the current electricity tariff block in a circled 24-hour clock format. This card allows customization of colors for different tariff blocks and offers the option to show or hide the hour labels.

![Network Tariff Card](https://github.com/frlequ/network-tariff-card/blob/main/assets/network-tariff-card.jpg)



## Features

- **Current Tariff Block**: Displays the current electricity tariff block based on your Home Assistant sensor.
- **24-Hour Clock Format**: Visual representation of the tariff blocks in a circular layout.
- **Customizable Colors**: Set different colors for each tariff block to easily distinguish between them.
- **Toggle Hour Labels**: Option to show or hide hour text for a cleaner design.


> [!NOTE]
> Please ensure you are using the latest version of the custom component **[Home Assistant Network Tariff](https://github.com/frlequ/home-assistant-network-tariff)**. This card is designed to work with this component.

## Installation
Ensure you have [HACS](https://hacs.xyz/) installed in your Home Assistant.

### Method 1 _(easiest)_:
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=frlequ&repository=network-tariff-card&category=plugin)

### Method 2: 

1. **Add Repository**:
   - Go to HACS in Home Assistant.
   - Click on "Frontend."
   - Click on the "+" icon in the bottom right corner.
   - Search for `Network Tariff Card` or add the repository URL directly.

2. **Install**: Click on the repository and follow the prompts to install the card.

3. **Add to Lovelace UI**:
   - Go to your Lovelace dashboard.
   - Click on the three-dot menu (top right) and select "Edit Dashboard."
   - Click on "Add Card" and choose "Manual."
   - Use the following configuration:

## Configuration
   Basic configuration. Please keep in mind that this card only supports the home-assistant-network-tariff custom component.
   ```yaml
      type: custom:network-tariff-card
      entity: sensor.elektro_network_tariff
      name: Trenutni blok
   ```

## Customize
   You can hide numeric hours, change outer and inner radius, color-code your own colors.
   ```yaml
      showHours: false
      outerRadius: 40
      innerRadius: 32
      colorMap:
        1: '#03045e'
        2: '#0077b6'
        3: '#00b4d8'
        4: '#90e0ef'
        5: '#caf0f8'
   ```  
