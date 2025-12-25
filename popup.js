// Popup UI controller for ChromeVPN extension

class PopupController {
  constructor() {
    this.configType = '';
    this.currentConfig = null;
    this.isConnected = false;
    this.init();
  }

  init() {
    // Load saved state
    this.loadState();
    
    // Event listeners
    document.getElementById('promoButton').addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://hourlyvpn.ca' });
    });

    document.getElementById('configType').addEventListener('change', (e) => {
      this.handleConfigTypeChange(e.target.value);
    });

    document.getElementById('fetchV2rayButton')?.addEventListener('click', () => {
      this.fetchV2raySubscription();
    });

    document.getElementById('saveV2rayConfigButton')?.addEventListener('click', () => {
      this.saveV2rayConfig();
    });

    document.getElementById('connectButton').addEventListener('click', () => {
      this.connect();
    });

    document.getElementById('disconnectButton').addEventListener('click', () => {
      this.disconnect();
    });
  }

  async loadState() {
    try {
      const result = await chrome.storage.local.get(['isConnected', 'configType', 'config']);
      if (result.isConnected) {
        this.isConnected = true;
        this.updateConnectionStatus('connected', 'Connected');
        document.getElementById('connectButton').classList.add('hidden');
        document.getElementById('disconnectButton').classList.remove('hidden');
      }
      if (result.configType) {
        document.getElementById('configType').value = result.configType;
        this.handleConfigTypeChange(result.configType);
      }
    } catch (error) {
      console.error('Error loading state:', error);
    }
  }

  handleConfigTypeChange(type) {
    this.configType = type;
    
    // Hide all sections
    document.querySelectorAll('.config-section').forEach(section => {
      section.classList.add('hidden');
    });

    // Show selected section
    if (type === 'v2ray') {
      document.getElementById('v2raySubscriptionSection').classList.remove('hidden');
    } else if (type === 'v2ray-config') {
      document.getElementById('v2rayConfigSection').classList.remove('hidden');
    } else if (type === 'socks') {
      document.getElementById('socksSection').classList.remove('hidden');
    }
  }

  async fetchV2raySubscription() {
    const url = document.getElementById('v2rayUrl').value.trim();
    if (!url) {
      this.showMessage('Please enter a subscription URL', 'error');
      return;
    }

    this.showMessage('Fetching subscription...', 'info');

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.text();
      // V2Ray subscriptions are typically base64 encoded
      const decoded = atob(data);
      const servers = decoded.split('\n').filter(s => s.trim());
      
      this.displayV2rayServers(servers);
      this.showMessage(`Found ${servers.length} servers`, 'success');
    } catch (error) {
      this.showMessage(`Error fetching subscription: ${error.message}`, 'error');
    }
  }

  displayV2rayServers(servers) {
    const container = document.getElementById('v2rayServers');
    container.innerHTML = '';
    
    servers.forEach((server, index) => {
      const div = document.createElement('div');
      div.className = 'server-item';
      div.textContent = `Server ${index + 1}: ${server.substring(0, 50)}...`;
      div.dataset.config = server;
      div.addEventListener('click', () => {
        document.querySelectorAll('.server-item').forEach(item => {
          item.classList.remove('selected');
        });
        div.classList.add('selected');
        this.currentConfig = { type: 'v2ray', config: server };
      });
      container.appendChild(div);
    });
  }

  async saveV2rayConfig() {
    const config = document.getElementById('v2rayConfig').value.trim();
    if (!config) {
      this.showMessage('Please enter a configuration', 'error');
      return;
    }

    try {
      JSON.parse(config); // Validate JSON
      this.currentConfig = { type: 'v2ray-config', config: config };
      this.showMessage('Configuration saved', 'success');
    } catch (error) {
      this.showMessage('Invalid JSON configuration', 'error');
    }
  }

  async connect() {
    if (!this.configType) {
      this.showMessage('Please select a configuration type', 'error');
      return;
    }

    let config = null;

    if (this.configType === 'v2ray' || this.configType === 'v2ray-config') {
      if (!this.currentConfig) {
        this.showMessage('Please select or configure a server', 'error');
        return;
      }
      config = this.currentConfig;
    } else if (this.configType === 'socks') {
      config = this.getSOCKSConfig();
      if (!config) {
        return; // Error message already shown
      }
    }

    this.updateConnectionStatus('connecting', 'Connecting...');
    
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'connect',
        config: config
      });

      if (response.success) {
        this.isConnected = true;
        this.updateConnectionStatus('connected', 'Connected');
        document.getElementById('connectButton').classList.add('hidden');
        document.getElementById('disconnectButton').classList.remove('hidden');
        this.showMessage('Connected successfully', 'success');
        
        await chrome.storage.local.set({
          isConnected: true,
          configType: this.configType,
          config: config
        });
      } else {
        throw new Error(response.error || 'Connection failed');
      }
    } catch (error) {
      this.updateConnectionStatus('disconnected', 'Disconnected');
      this.showMessage(`Connection failed: ${error.message}`, 'error');
    }
  }

  async disconnect() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'disconnect'
      });

      if (response.success) {
        this.isConnected = false;
        this.updateConnectionStatus('disconnected', 'Disconnected');
        document.getElementById('connectButton').classList.remove('hidden');
        document.getElementById('disconnectButton').classList.add('hidden');
        this.showMessage('Disconnected', 'info');
        
        await chrome.storage.local.set({ isConnected: false });
      } else {
        throw new Error(response.error || 'Disconnect failed');
      }
    } catch (error) {
      this.showMessage(`Disconnect failed: ${error.message}`, 'error');
    }
  }

  getSOCKSConfig() {
    const url = document.getElementById('socksUrl').value.trim();
    
    if (url) {
      // Parse SOCKS URL (e.g., socks5://user:pass@host:port)
      try {
        const parsedUrl = new URL(url.replace(/^socks5?:\/\//, 'http://'));
        return {
          type: 'socks',
          scheme: url.startsWith('socks5') ? 'socks5' : 'socks4',
          host: parsedUrl.hostname,
          port: parseInt(parsedUrl.port) || 1080,
          username: parsedUrl.username || undefined,
          password: parsedUrl.password || undefined
        };
      } catch (error) {
        this.showMessage('Invalid SOCKS URL format', 'error');
        return null;
      }
    } else {
      // Use separate fields
      const host = document.getElementById('socksHost').value.trim();
      const port = document.getElementById('socksPort').value.trim();
      
      if (!host || !port) {
        this.showMessage('Please enter host and port', 'error');
        return null;
      }

      return {
        type: 'socks',
        scheme: 'socks5',
        host: host,
        port: parseInt(port),
        username: document.getElementById('socksUsername').value.trim() || undefined,
        password: document.getElementById('socksPassword').value.trim() || undefined
      };
    }
  }

  updateConnectionStatus(status, text) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    
    indicator.className = `status-indicator ${status}`;
    statusText.textContent = text;
  }

  showMessage(message, type = 'info') {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.className = `message-box ${type}`;
    messageBox.classList.remove('hidden');
    
    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        messageBox.classList.add('hidden');
      }, 3000);
    }
  }
}

// Initialize popup controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});
