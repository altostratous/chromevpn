# ChromeVPN Extension - Testing Guide

## Installation Testing

1. Open Chrome/Chromium browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the chromevpn directory
6. Verify the extension appears in the list

## Feature Testing

### 1. Extension Icon
- ✓ Icon should appear in browser toolbar
- ✓ Clicking icon should open popup

### 2. Promo Button
- ✓ "Get Free Trial at HourlyVPN" button is visible
- ✓ Clicking opens https://hourlyvpn.ca in new tab

### 3. SOCKS Proxy Configuration

#### Test with URL format:
1. Select "SOCKS Proxy" from Configuration Type
2. Enter: `socks5://127.0.0.1:1080`
3. Click "Connect"
4. Verify connection status changes to "Connected"
5. Badge shows "ON" on extension icon
6. Click "Disconnect"
7. Verify status returns to "Disconnected"

#### Test with separate fields:
1. Select "SOCKS Proxy"
2. Enter Host: `127.0.0.1`
3. Enter Port: `1080`
4. Optionally add username/password
5. Click "Connect"
6. Verify connection works

### 4. V2Ray Configuration

#### Test JSON config:
1. Select "V2Ray Configuration"
2. Paste valid V2Ray JSON with SOCKS outbound:
```json
{
  "outbounds": [{
    "protocol": "socks",
    "settings": {
      "servers": [{
        "address": "127.0.0.1",
        "port": 1080
      }]
    }
  }]
}
```
3. Click "Save Configuration"
4. Click "Connect"
5. Verify connection

### 5. V2Ray Subscription

1. Select "V2Ray Subscription"
2. Enter a test subscription URL
3. Click "Fetch Subscription"
4. Verify servers appear in list
5. Click a server to select
6. Click "Connect"

### 6. Footer Links
- ✓ "Terms of Service" link opens https://hourlyvpn.ca/en/info/tos
- ✓ "Privacy Policy" link opens https://hourlyvpn.ca/en/info/tos

### 7. Connection Persistence
1. Connect to a proxy
2. Close popup
3. Reopen popup
4. Verify connection status is maintained
5. Close browser
6. Reopen browser
7. Check if connection is restored

## Expected Behaviors

### Success States
- Status indicator: Green dot with glow
- Status text: "Connected"
- Connect button: Hidden
- Disconnect button: Visible
- Success message: Green background
- Extension badge: "ON" in green

### Error States
- Invalid URL: Red error message
- Connection failure: Status remains "Disconnected"
- Invalid JSON: "Invalid JSON configuration" error
- Missing fields: Appropriate error message

### Loading States
- Status indicator: Orange dot with pulse animation
- Status text: "Connecting..."

## Browser Compatibility

✓ Chrome (version 88+)
✓ Chromium
✓ Edge (Chromium-based)
✓ Brave
✓ Opera (Chromium-based)

## Known Limitations

1. V2Ray subscription links require base64-encoded format
2. V2Ray direct protocol support (vmess://, vless://, etc.) requires local V2Ray client
3. For best V2Ray support, run V2Ray locally with SOCKS outbound and use SOCKS option

## Security Notes

✓ No security vulnerabilities detected by CodeQL
✓ Proper error handling for malformed input
✓ HTTPS required for subscription URLs (recommended)
✓ Credentials stored locally in Chrome's secure storage
