# ChromeVPN - Quick Start Guide

## What is ChromeVPN?

ChromeVPN is the first and best open source modular Chrome extension that supports multiple VPN clients. It provides a simple interface to connect to VPN servers using various protocols.

## Supported Protocols

- **SOCKS5/SOCKS4** - Most common and easiest to set up
- **V2Ray** - Advanced protocol with JSON configuration support
- **More coming soon!** - The modular design makes it easy to add new protocols

## Quick Start

### Option 1: SOCKS Proxy (Easiest)

If you have a SOCKS proxy server:

1. Click the ChromeVPN extension icon
2. Select **"SOCKS Proxy"** from the dropdown
3. Enter your SOCKS URL or details:
   - URL format: `socks5://username:password@host:port`
   - Example: `socks5://127.0.0.1:1080`
4. Click **"Connect"**

### Option 2: V2Ray with Local Client

If you have V2Ray installed locally:

1. Configure V2Ray to listen on a SOCKS port (usually 1080)
2. In ChromeVPN, select **"SOCKS Proxy"**
3. Enter: `socks5://127.0.0.1:1080`
4. Click **"Connect"**

### Option 3: V2Ray JSON Configuration

If you have a V2Ray configuration file:

1. Select **"V2Ray Configuration"**
2. Paste your JSON configuration
3. Click **"Save Configuration"**
4. Click **"Connect"**

**Note:** The configuration must include a SOCKS outbound for the extension to connect.

## Getting a VPN Service

### Free Trial Available! 🎁

Click the **"Get Free Trial at HourlyVPN"** button in the extension to visit [HourlyVPN.ca](https://hourlyvpn.ca) for:

- Free trial access
- Hourly VPN plans (pay only for what you use)
- No long-term commitments
- Multiple server locations
- V2Ray and SOCKS support

## Common Use Cases

### 1. Privacy Protection
Route all browser traffic through a VPN to protect your privacy and hide your IP address.

### 2. Access Geo-Restricted Content
Connect to servers in different countries to access region-locked content.

### 3. Secure Public WiFi
Protect your data when using public WiFi networks at cafes, airports, etc.

### 4. Development & Testing
Test websites and applications from different geographic locations.

## Troubleshooting

### "Connection failed"
- Verify your proxy server is running
- Check host and port are correct
- Ensure firewall allows the connection
- Try with authentication disabled first

### V2Ray subscription not loading
- Verify the URL is accessible
- Check if the subscription uses base64 encoding
- Try using V2Ray Configuration or SOCKS instead

### Extension not working
1. Check if extension is enabled in `chrome://extensions/`
2. Try disconnecting and reconnecting
3. Reload the extension
4. Check browser console for errors

## Privacy & Security

Your privacy matters. ChromeVPN:

- ✓ Stores credentials locally only
- ✓ Does not send data to external servers (except your chosen VPN)
- ✓ Open source - you can review the code
- ✓ No tracking or analytics

For full details, see our [Privacy Policy](https://hourlyvpn.ca/en/info/tos).

## Need Help?

- Check the [README.md](README.md) for technical details
- Review [TESTING.md](TESTING.md) for detailed testing procedures
- Visit [HourlyVPN.ca](https://hourlyvpn.ca) for VPN service support

## Contributing

This is an open source project! Contributions are welcome:

- Report bugs
- Suggest features
- Add new VPN protocol support
- Improve documentation

Visit the GitHub repository to contribute.
