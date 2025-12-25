# ChromeVPN - Modular VPN Extension

The first and best open source modular Chrome extension that supports a multitude of VPN clients.

## Features

- 🔐 **Multiple VPN Protocol Support**
  - V2Ray subscription links
  - V2Ray JSON configurations
  - SOCKS5/SOCKS4 proxies
  
- 🎁 **Free Trial Available**
  - Get your free trial or hourly VPN at [HourlyVPN.ca](https://hourlyvpn.ca)
  
- 🔧 **Modular Design**
  - Easy to extend with additional VPN protocols
  - Clean separation of concerns
  - Modern Chrome Extension Manifest V3

## Installation

### From Source

1. Clone this repository:
   ```bash
   git clone https://github.com/altostratous/chromevpn.git
   cd chromevpn
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top right)

4. Click "Load unpacked" and select the chromevpn directory

5. The ChromeVPN extension should now appear in your extensions list

## Usage

### SOCKS Proxy Configuration

1. Click the ChromeVPN extension icon
2. Select "SOCKS Proxy" from the configuration type dropdown
3. Enter either:
   - A SOCKS URL: `socks5://user:pass@host:port`
   - Or fill in the individual fields (Host, Port, Username, Password)
4. Click "Connect"

### V2Ray Configuration

1. Click the ChromeVPN extension icon
2. Select "V2Ray Configuration" from the configuration type dropdown
3. Paste your V2Ray JSON configuration
4. Click "Save Configuration"
5. Click "Connect"

### V2Ray Subscription

1. Click the ChromeVPN extension icon
2. Select "V2Ray Subscription" from the configuration type dropdown
3. Enter your subscription URL
4. Click "Fetch Subscription"
5. Select a server from the list
6. Click "Connect"

**Note:** V2Ray subscription and direct protocol support requires a local V2Ray client configured with a SOCKS outbound. For best results, run V2Ray locally and use the SOCKS proxy option to connect through it.

## Architecture

- **manifest.json** - Extension configuration and permissions
- **popup.html/css/js** - User interface for configuration and control
- **background.js** - Service worker handling proxy configuration
- **icons/** - Extension icons in multiple sizes

## Privacy & Terms

- [Terms of Service](https://hourlyvpn.ca/en/info/tos)
- [Privacy Policy](https://hourlyvpn.ca/en/info/tos)

## Contributing

Contributions are welcome! This is an open source project aimed at providing a flexible, modular VPN solution for Chrome users.

### Adding New VPN Protocols

1. Add UI elements in `popup.html` for the new protocol
2. Add configuration handling in `popup.js`
3. Implement proxy configuration in `background.js`
4. Update this README with usage instructions

## License

This project is open source and available for use and modification.

## Support

For free trials and hourly VPN access, visit [HourlyVPN.ca](https://hourlyvpn.ca)
