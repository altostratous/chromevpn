// Background service worker for ChromeVPN extension

class VPNManager {
  constructor() {
    this.isConnected = false;
    this.currentConfig = null;
    this.init();
  }

  init() {
    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep channel open for async response
    });

    // Restore connection state on startup
    this.restoreConnectionState();
  }

  async restoreConnectionState() {
    try {
      const result = await chrome.storage.local.get(['isConnected', 'config']);
      if (result.isConnected && result.config) {
        // Restore proxy settings
        await this.applyProxyConfig(result.config);
        this.isConnected = true;
        this.currentConfig = result.config;
        this.updateIcon('connected');
      }
    } catch (error) {
      console.error('Error restoring connection:', error);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      if (request.action === 'connect') {
        const result = await this.connect(request.config);
        sendResponse(result);
      } else if (request.action === 'disconnect') {
        const result = await this.disconnect();
        sendResponse(result);
      } else {
        sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }

  async connect(config) {
    try {
      await this.applyProxyConfig(config);
      this.isConnected = true;
      this.currentConfig = config;
      this.updateIcon('connected');
      return { success: true };
    } catch (error) {
      console.error('Connection error:', error);
      return { success: false, error: error.message };
    }
  }

  async disconnect() {
    try {
      // Clear proxy settings
      await chrome.proxy.settings.clear({ scope: 'regular' });
      this.isConnected = false;
      this.currentConfig = null;
      this.updateIcon('disconnected');
      return { success: true };
    } catch (error) {
      console.error('Disconnect error:', error);
      return { success: false, error: error.message };
    }
  }

  async applyProxyConfig(config) {
    if (!config || !config.type) {
      throw new Error('Invalid configuration');
    }

    let proxyConfig;

    if (config.type === 'socks') {
      // Configure SOCKS proxy
      proxyConfig = {
        mode: 'fixed_servers',
        rules: {
          singleProxy: {
            scheme: config.scheme || 'socks5',
            host: config.host,
            port: config.port
          },
          bypassList: ['localhost', '127.0.0.1']
        }
      };
    } else if (config.type === 'v2ray' || config.type === 'v2ray-config') {
      // For V2Ray, we need to parse the configuration
      // This is a simplified implementation - full V2Ray support would require
      // a more complex parser and potentially a local proxy server
      
      // For now, we'll extract SOCKS proxy information if available
      if (config.type === 'v2ray-config') {
        try {
          const v2rayConfig = JSON.parse(config.config);
          // Try to find SOCKS outbound
          const socksOutbound = v2rayConfig.outbounds?.find(o => o.protocol === 'socks');
          if (socksOutbound && socksOutbound.settings) {
            const servers = socksOutbound.settings.servers?.[0];
            if (servers) {
              proxyConfig = {
                mode: 'fixed_servers',
                rules: {
                  singleProxy: {
                    scheme: 'socks5',
                    host: servers.address || 'localhost',
                    port: servers.port || 1080
                  },
                  bypassList: ['localhost', '127.0.0.1']
                }
              };
            }
          }
        } catch (error) {
          throw new Error('Failed to parse V2Ray configuration');
        }
      } else {
        // V2Ray subscription link - simplified handling
        // In a real implementation, this would parse vmess://, vless://, etc.
        throw new Error('V2Ray subscription links require additional parsing. Please use V2Ray Configuration with a SOCKS outbound or configure a local V2Ray client with SOCKS proxy, then use the SOCKS option.');
      }
    }

    if (!proxyConfig) {
      throw new Error('Failed to create proxy configuration');
    }

    // Apply proxy settings
    await chrome.proxy.settings.set({
      value: proxyConfig,
      scope: 'regular'
    });

    console.log('Proxy configured:', proxyConfig);
  }

  updateIcon(status) {
    // Update badge to show connection status
    if (status === 'connected') {
      chrome.action.setBadgeText({ text: 'ON' });
      chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  }
}

// Initialize VPN manager
const vpnManager = new VPNManager();
