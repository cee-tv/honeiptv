// Import channels from channels.js
import { defaultChannelList } from './channels.js';

// Convert channel list to STREAMS format
const STREAMS = {};

defaultChannelList.forEach((channel, index) => {
    const streamKey = channel.id || `channel_${index}`;
    STREAMS[streamKey] = {
        url: channel.manifest,
        name: channel.name,
        format: channel.manifest.includes('.m3u8') ? 'HLS' : 'DASH',
        drm: channel.drm,
        image: channel.image
    };
});

// Viewer counting removed

// All viewer tracking removed

class JWPlayerDemo {
    constructor() {
        this.player = null;
        this.currentStream = null;
        this.loadTimeout = null;
        this.channelChangeTimer = null;
        this.tempSidebarTimer = null;
        this.manifestKeepAliveInterval = null;
        this.bufferStallTimer = null;
        this.bufferingSince = 0;
        this.qualityLocked = false; // Track if initial quality has been set
        
        // Numeric channel entry buffer (supports 100+ channels)
        this.numericBuffer = '';
        this.numericTimer = null;
        
        this.init();
    }

    init() {
        // Set JW Player key
        window.jwplayer.key = 'XSuP4qMl+9tK17QNb+4+th2Pm9AWgMO/cYH8CI0HGGr7bdjo';
        
        // Generate channel buttons
        this.generateChannelButtons();
        
        // Setup splash screen and handle user interaction
        this.setupSplashScreen();
        
        this.setupEventListeners();
        
        // Setup mobile optimizations
        this.setupMobileOptimizations();
    }

    generateChannelButtons() {
        const container = document.getElementById('channelsList');
        if (!container) return;

        // Clear existing channels
        container.innerHTML = '';

        // Create alphabetized array of channels
        const sortedChannels = Object.keys(STREAMS).map(streamKey => ({
            streamKey,
            stream: STREAMS[streamKey],
            originalIndex: Object.keys(STREAMS).indexOf(streamKey)
        })).sort((a, b) => a.stream.name.localeCompare(b.stream.name));

        // Generate channel items for each channel
        sortedChannels.forEach((channelData, index) => {
            const { streamKey, stream, originalIndex } = channelData;
            const channelItem = document.createElement('div');
            channelItem.className = `channel-item ${originalIndex === 0 ? 'active' : ''}`;
            channelItem.dataset.streamKey = streamKey;
            channelItem.dataset.originalIndex = originalIndex;
            channelItem.dataset.alphaIndex = index; // Add alphabetical index
            channelItem.dataset.channelId = stream.name.toLowerCase().replace(/[^a-z0-9]+/g, ''); // Add channel ID for viewer tracking
            
            channelItem.innerHTML = `
                <div class="channel-number">${index + 1}</div>
                <div class="channel-details">
                    <div class="channel-name-container">
                        <h6>${stream.name}</h6>
                        <div class="channel-status-indicator unknown"></div>
                    </div>
                </div>
            `;
            
            container.appendChild(channelItem);
        });
    }

    getPlayerConfig(stream) {
        // Mobile-specific optimizations
        const isMobile = window.innerWidth <= 768;
        
        const config = {
            file: stream.url,
            width: '100%',
            height: '100%',
            aspectratio: '16:9',
            autostart: true, // Auto-play when loaded
            autoplay: true, // Additional autoplay setting for better compatibility
            responsive: true,
            controls: true,
            displaytitle: true,
            pipIcon: true,
            liveTimeout: 0,
            stretching: 'uniform',
            style: {
                margin: '0',
                width: '100%',
                height: '100%'
            },
            // ENABLE AUTO QUALITY SELECTION FOR SLOW NETWORKS
            qualitySelection: 'auto', // Enable automatic quality selection
            defaultQuality: -1, // Auto quality selection based on bandwidth
            levels: [], // Will be populated by player, but ensure manual control
            // Chromecast support
            chromecast: {
                title: stream.name,
                description: 'Live TV Channel',
                image: stream.image || 'https://via.placeholder.com/400x300/000000/FFFFFF?text=Live+TV'
            },
            // Mobile-specific settings
            mobile: isMobile,
            playsinline: true, // Prevent fullscreen on iOS
            'webkit-playsinline': true, // iOS Safari support
            'x-webkit-airplay': 'allow', // AirPlay support
            // Optimize for mobile performance
            preload: isMobile ? 'metadata' : 'auto',
            autobuffer: !isMobile, // Disable autobuffer on mobile for better performance
            visualplaylist: false,
            primary: 'html5',
            hlshtml: true,
            // Enable audio after user interaction
            mute: false,
            volume: 100,
            // Timeout and retry settings for better error recovery
            timeout: 50000, // 50 second overall load timeout
            retryAttempts: 3, // Retry 3 times before giving up
            retryInterval: 300, // Wait 2 seconds between retries
            // Network error handling
            networkTimeout: 50000, // 50 second network timeout
            manifestTimeout: 50000, // 50 second manifest timeout
            segmentTimeout: 50000 // 50 second segment timeout
        };

        // Add DRM configuration if available
        if (stream.drm) {
            if (stream.drm.keyId && stream.drm.key) {
                // ClearKey DRM
                config.drm = {
                    clearkey: {
                        key: stream.drm.key,
                        keyId: stream.drm.keyId,
                    },
                };
            } else if (stream.drm.serverURL) {
                // Server-based DRM with robustness level
                config.drm = {
                    widevine: {
                        url: stream.drm.serverURL,
                        // Add robustness level to prevent warning
                        robustness: 'SW_SECURE_CRYPTO'
                    }
                };
            }
        }
        
        // Default DRM configuration for DASH streams to prevent robustness warnings
        if (!config.drm && stream.format === 'DASH') {
            config.drm = {
                widevine: {
                    robustness: 'SW_SECURE_CRYPTO'
                }
            };
        }

        // Add additional buffering settings for live streams to prevent decoding errors
        if (stream.url.includes('live') || stream.url.includes('cartoonnetwork') || stream.url.includes('akamaized')) {
            // Enhanced buffering for live streams
            config.bufferlength = 15; // 60 seconds buffer
            config.liveSyncDurationCount = 15; // 60 seconds delay
            config.liveSyncDuration = 15; // 60 seconds delay
            config.liveSyncDurationMax = 15; // Maximum 60 seconds delay
            config.liveSyncDurationMin = 15; // Minimum 60 seconds delay
            config.liveSyncDurationLimit = 15; // Limit to 60 seconds delay
            config.preload = 'metadata'; // Preload metadata only
            config.autostart = true; // Auto-start all streams including live ones
        }

        // JWPlayer DASH configuration - conservative bandwidth for auto quality
        config.defaultBandwidthEstimate = 2000000; // 2 Mbps - conservative estimate for slow networks
        config.displayPlaybackLabel = true; // Enable quality selection menu for manual control
        
        // Allow auto quality selection based on network conditions
        config.defaultQuality = -1; // Auto quality selection
        
        // HLS specific - enable ABR for automatic quality adjustment
        config.hlsConfig = {
            startLevel: -1, // -1 = auto-select based on bandwidth
            capLevelToPlayerSize: true, // Allow limiting quality based on player size
            maxLoadingDelay: 4, // Max delay for segment loading
            maxBufferLength: 30, // Buffer length in seconds
            liveSyncDurationCount: 3, // Live sync buffer
            liveMaxLatencyDurationCount: 10, // Max latency for live streams
            enableWorker: true, // Use web workers for better performance
            autoStartLoad: true, // Auto start loading
            testBandwidth: true, // Test bandwidth for quality selection
            // ENABLE ABR (Adaptive Bitrate) features for slow networks
            abrEnabled: true, // Enable ABR for automatic quality switching
            abrEwmaFastLive: 3, // Enable fast EWMA for ABR
            abrEwmaSlowLive: 9, // Enable slow EWMA for ABR  
            abrEwmaDefaultEstimate: 500000, // Conservative default estimate (500kbps)
            abrBandWidthFactor: 0.7, // Conservative bandwidth factor for slow networks
            abrBandWidthUpFactor: 0.7, // Conservative up factor
            maxStarvationDelay: 4, // Max delay before switching down
            maxLoadingDelay: 4, // Max loading delay
            lowLatencyMode: false // Keep low latency disabled
        };
        
        // DASH/MPD specific - enable adaptive streaming for slow networks
        config.dashConfig = {
            // Quality Selection - Allow automatic adjustment
            initialRepresentationRatio: 0.5, // Start with medium quality (50%)
            capLevelToPlayerSize: true, // Cap quality based on player size for efficiency
            
            // ENABLE ABR (Adaptive Bitrate) Rules for slow networks
            autoSwitchBitrate: true, // Enable automatic bitrate switching
            autoSwitchQuality: true, // Enable automatic quality switching
            enableBufferOccupancyABR: true, // Enable buffer-based ABR
            enableThroughputRule: true, // Enable throughput-based switching
            enableBolaRule: true, // Enable BOLA ABR algorithm
            enableAbrThroughputRule: true, // Enable ABR throughput rule
            enableInsufficientBufferRule: true, // Enable insufficient buffer rule
            enableSwitchHistoryRule: true, // Enable switch history rule
            enableDroppedFramesRule: true, // Enable dropped frames rule
            
            // Buffer Settings - Allow Quality Drops for slow networks
            fastSwitchEnabled: true, // Enable fast switching
            bufferTimeAtTopQuality: 30, // Reduced buffer time for top quality
            bufferTimeAtTopQualityLongForm: 60, // Reduced buffer for long content
            stableBufferTime: 12, // Reduced stable buffer time
            bufferToKeep: 20, // Reduced buffer to keep
            
            // Quality Selection Settings
            qualitySelectionMode: 'auto', // Enable automatic quality selection
            initialBitrate: { video: 1000000, audio: 128000 }, // Conservative initial bitrates
            maxBitrate: { video: 8000000, audio: 320000 }, // Reasonable max bitrates
            
            // Advanced ABR Settings for slow networks
            limitBitrateByPortal: true, // Limit by portal size for efficiency
            usePixelRatioInLimitBitrateByPortal: true, // Use pixel ratio
            streaming: {
                abr: {
                    autoSwitchBitrate: { video: true, audio: true }, // Enable for both
                    useDeadTimeLatency: true, // Enable dead time latency
                    limitBitrateByPortal: true, // Limit by portal
                    usePixelRatioInLimitBitrateByPortal: true // Use pixel ratio
                }
            }
        };
        
        // Quality labels for UI
        config.qualityLabels = {
            '2160': '4K',
            '1440': '1440p', 
            '1080': '1080p',
            '720': '720p', 
            '480': '480p',
            '360': '360p',
            '240': '240p'
        };
        
        // Format fallback chain for transmuxing
        config.fallback = {
            hls: ['dash', 'mp4'],
            dash: ['hls', 'mp4'],
            mp4: ['hls', 'dash']
        };
        
        // Codec fallback chain
        config.codecFallback = {
            'h265': ['h264', 'vp9'],
            'h264': ['vp9', 'h265'],
            'vp9': ['h264', 'h265']
        };

        return config;
    }

    loadStream(streamType) {
        // Clear any existing timeout
        if (this.loadTimeout) {
            clearTimeout(this.loadTimeout);
        }
        
        // Immediately highlight the selected channel in sidebar
        this.updateButtonStates(streamType);
        
        // Show channel popup and update channel number immediately
        const stream = STREAMS[streamType];
        if (stream) {
            this.showChannelPopup(stream.name);
            
            // Find the current channel's alphabetical position
            const currentChannelItem = document.querySelector('.channel-item.active');
            let alphaPosition = 1;
            if (currentChannelItem) {
                const visibleChannels = Array.from(document.querySelectorAll('.channel-item:not([style*="display: none"])'));
                alphaPosition = visibleChannels.indexOf(currentChannelItem) + 1;
            }
            
            this.updateChannelNumber(alphaPosition - 1);
            this.showNumberInputHint(alphaPosition);
        }
        
        // Set a 2-second delay before actually loading the channel
        this.loadTimeout = setTimeout(() => {
            this.actuallyLoadStream(streamType);
        }, 2000);
        
        // Show immediate feedback that channel selection is pending
        if (stream) {
            this.showSuccess(`Selected ${stream.name} - loading in 2 seconds...`);
        }
    }
    
    actuallyLoadStream(streamType) {
        const stream = STREAMS[streamType];
        if (!stream) {
            this.showError('Invalid stream type');
            return;
        }

        try {
            // Update UI
            this.updateButtonStates(streamType);

            // Destroy existing player and reset quality lock
            if (this.player) {
                this.player.remove();
            }
            this.qualityLocked = false; // Reset quality lock for new stream

            // Create new player
            this.player = window.jwplayer('video').setup(this.getPlayerConfig(stream));
            
            // Setup player events
            this.setupPlayerEvents();

            // Start manifest keep-alive polling for this stream - DISABLED
            // this.startManifestKeepAlive(stream);

            // Force autoplay for all channels (including TV)
            setTimeout(() => {
                if (this.player && this.currentStream === streamType) {
                    this.forceAutoplay();
                }
            }, 500); // Slight delay to ensure player is ready

            this.currentStream = streamType;
            this.showSuccess(`Loading ${stream.name}...`);
            
            // Update URL hash
            this.updateUrlHash(streamType);
            
            // Reset sidebar hover state to ensure proper behavior
            this.resetSidebarHoverState();
            
            // Track viewer count for this channel
            // Viewer tracking removed

        } catch (error) {
            console.error('Error loading stream:', error);
            this.showError(`Failed to load ${stream.name}`);
        }
    }



    setupPlayerEvents() {
        if (!this.player) return;

        this.player.on('ready', () => {
            console.log('JW Player is ready');
            
            // Allow ABR to automatically select quality based on network conditions
            console.log('ABR enabled - quality will auto-adjust based on network conditions');
            
            // Force autoplay when player is ready
            setTimeout(() => {
                if (this.player) {
                    try {
                        const playPromise = this.player.play();
                        if (playPromise && typeof playPromise.then === 'function') {
                            playPromise.then(() => {
                        console.log('Autoplay successful');
                    }).catch((error) => {
                        console.log('Autoplay failed, waiting for user interaction:', error);
                    });
                        } else {
                            console.log('Forced autoplay called (no Promise returned)');
                        }
                    } catch (error) {
                        console.log('Autoplay error:', error);
                    }
                }
            }, 100);
            
            // Setup quality monitoring (non-aggressive) - DISABLED for ABR
            // this.setupQualityEnforcement();
            
            // Initialize quality monitoring (disabled)
            this.startQualityMonitoring();
            
            // Initialize channelapi-style sidebar behavior
            this.initializeChannelApiSidebarBehavior();
        });

        // Track buffering and attempt recovery if it lasts too long
        this.player.on('buffer', () => {
            this.bufferingSince = Date.now();
            if (this.bufferStallTimer) clearTimeout(this.bufferStallTimer);
            this.bufferStallTimer = setTimeout(() => {
                // If still buffering after timeout, try a gentle reload
                if (this.bufferingSince && Date.now() - this.bufferingSince >= 12000) {
                    this.reloadCurrentStream();
                }
            }, 12000);
        });

        const clearBufferWatch = () => {
            this.bufferingSince = 0;
            if (this.bufferStallTimer) {
                clearTimeout(this.bufferStallTimer);
                this.bufferStallTimer = null;
            }
        };

        this.player.on('firstFrame', clearBufferWatch);
        this.player.on('play', clearBufferWatch);
        this.player.on('time', clearBufferWatch);

        this.player.on('play', () => {
            console.log('Video started playing');
        });

        this.player.on('pause', () => {
            console.log('Video paused');
        });

        this.player.on('error', (error) => {
            console.error('Player error:', error);
            
            // Check for network errors (241001, 244001, 244002, 244003) and auto-replay
            if (error.code === 241001 || error.code === 244001 || error.code === 244002 || error.code === 244003 || error.code === 230011) {
                console.log(`Network error detected (${error.code}), attempting to replay...`);
                this.showError('Network error detected. Attempting to replay...');
                
                // Immediate replay without delay to avoid sidemenu debouncing
                if (this.currentStream) {
                    console.log('Replaying stream:', this.currentStream);
                    this.reloadCurrentStream();
                }
            } else {
                this.showError('Error loading video stream. Please try a different stream.');
            }
        });

        this.player.on('setupError', (error) => {
            console.error('Setup error:', error);
            
            // Check for error 244002 or 230011 in setup errors too
            if (error.code === 244002 || error.code === 230011) {
                console.log('Setup network error detected (244002), attempting to replay...');
                this.showError('Network error during setup. Attempting to replay...');
                
                // Wait 2 seconds then replay the current stream
                setTimeout(() => {
                    if (this.currentStream) {
                        console.log('Replaying stream after setup error:', this.currentStream);
                        this.reloadCurrentStream();
                    }
                }, 2000);
            } else {
                // Handle unsupported codec errors
                if (error.code === 230001 || error.message.includes('codec') || error.message.includes('unsupported')) {
                    console.log('Unsupported codec detected');
                    this.showError('Unsupported video codec detected. Please try a different channel.');
                } else {
                    this.showError('Error setting up video stream.');
                }
            }
        });
    }

    // Keep requesting the manifest in the background so it never stops
    startManifestKeepAlive(stream) {
        // Manifest polling disabled - no longer making requests to manifests
        console.log('Manifest keep-alive polling disabled');
        return;
    }

    stopManifestKeepAlive() {
        if (this.manifestKeepAliveInterval) {
            clearInterval(this.manifestKeepAliveInterval);
            this.manifestKeepAliveInterval = null;
        }
    }

    // Gentle in-place reload of the current item without full UI reset
    reloadCurrentStream() {
        try {
            if (!this.player || !this.currentStream) return;
            const stream = STREAMS[this.currentStream];
            if (!stream) return;
            const source = { file: stream.url, type: stream.format === 'DASH' ? 'dash' : 'hls' };
            // Prefer in-place load to avoid 2s delayed flow
            this.player.load([source]);
            this.player.play().catch(() => {});
            this.showNotification('Recovering stream…', 'info');
            // Restart keep-alive for good measure - DISABLED
            // this.startManifestKeepAlive(stream);
        } catch (_) {
            // Fall back to full reload path
            this.actuallyLoadStream(this.currentStream);
        }
    }

    setupEventListeners() {
        // Dynamic event listeners for channel items
        const container = document.getElementById('channelsList');
        if (container) {
            container.addEventListener('click', (event) => {
                const channelItem = event.target.closest('.channel-item');
                if (channelItem) {
                    const streamKey = channelItem.dataset.streamKey;
                    if (streamKey) {
                        this.loadStream(streamKey);
                        this.showSidebarTemporarily();
                    }
                }
            });
        }

        // Menu toggle button
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const sidebar = document.getElementById('channelSidebar');
        if (menuToggleBtn && sidebar) {
            menuToggleBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Sidebar close button (mobile)
        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose && sidebar) {
            sidebarClose.addEventListener('click', () => {
                this.hideSidebar();
            });
        }

        // Search functionality
        const searchInput = document.getElementById('channelSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterChannels(e.target.value);
            });
        }

        // Scroll wheel functionality for channel navigation
        const channelsList = document.getElementById('channelsList');
        if (channelsList) {
            channelsList.addEventListener('wheel', (e) => {
                // Allow normal scrolling within sidebar, don't change channels
                // Only prevent default if we want to change channels
                // For now, let it scroll normally
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Listen for browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleUrlHash();
        });

        // Show menu button on video hover
        const videoContainer = document.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.addEventListener('mouseenter', () => {
                menuToggleBtn.classList.add('show');
            });
            
            videoContainer.addEventListener('mouseleave', () => {
                if (!sidebar.classList.contains('show')) {
                    menuToggleBtn.classList.remove('show');
                }
            });

            // Add scroll navigation to video container
            videoContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                this.handleScrollNavigation(e);
            });

            // Enhanced hover functionality for desktop - Using channelapi mechanics
            if (window.innerWidth >= 993) {
                // Channelapi sidebar behavior is now handled in initializeChannelApiSidebarBehavior()
                // This ensures it's properly initialized after the player is ready
            }
        }

        // Auto-hide sidebar after inactivity
        this.setupSidebarAutoHide();
    }

    updateButtonStates(activeStream) {
        // Remove active class from all channel items
        document.querySelectorAll('.channel-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to clicked channel item
        const activeItem = document.querySelector(`[data-stream-key="${activeStream}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    filterChannels(searchTerm) {
        const channelItems = document.querySelectorAll('.channel-item');
        const searchLower = searchTerm.toLowerCase();

        channelItems.forEach(item => {
            const channelName = item.querySelector('h6').textContent.toLowerCase();
            if (channelName.includes(searchLower)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    handleKeyboardNavigation(e) {
        // Handle number input for multi-digit direct channel access
        if (e.key >= '0' && e.key <= '9') {
            e.preventDefault();
            this.handleDigitInput(e.key);
            return;
        }
        if (e.key === 'Enter' && this.numericBuffer.length > 0) {
            e.preventDefault();
            this.commitBufferedChannelNumber();
            return;
        }
        if (e.key === 'Backspace' && this.numericBuffer.length > 0) {
            e.preventDefault();
            this.numericBuffer = this.numericBuffer.slice(0, -1);
            this.showTypedNumber(this.numericBuffer);
            return;
        }

        const channelItems = Array.from(document.querySelectorAll('.channel-item:not([style*="display: none"])'));
        const currentIndex = channelItems.findIndex(item => item.classList.contains('active'));
        
        switch (e.key) {
            case 'ArrowUp':
                e.preventDefault();
                if (currentIndex > 0) {
                    this.loadStream(channelItems[currentIndex - 1].dataset.streamKey);
                    this.showSidebarForChannelChange();
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (currentIndex < channelItems.length - 1) {
                    this.loadStream(channelItems[currentIndex + 1].dataset.streamKey);
                    this.showSidebarForChannelChange();
                }
                break;
            case 's':
            case 'S':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    // Skip to next channel (skip broken ones)
                    if (currentIndex < channelItems.length - 1) {
                        this.loadStream(channelItems[currentIndex + 1].dataset.streamKey);
                        this.showSidebarForChannelChange();
                    }
                }
                break;
        }
    }

    // New: handle digit buffering for multi-digit channel selection
    handleDigitInput(digit) {
        // Append and display
        this.numericBuffer = (this.numericBuffer + digit).slice(0, 4); // allow up to 4 digits
        this.showTypedNumber(this.numericBuffer);
        
        // Reset commit timer
        if (this.numericTimer) clearTimeout(this.numericTimer);
        this.numericTimer = setTimeout(() => {
            this.commitBufferedChannelNumber();
        }, 1000); // auto-commit after 1s of inactivity
    }

    commitBufferedChannelNumber() {
        if (!this.numericBuffer) return;
        const number = parseInt(this.numericBuffer, 10);
        this.numericBuffer = '';
        this.showTypedNumber('');
        
        // Get visible channels in alphabetical order
        const visibleChannels = Array.from(document.querySelectorAll('.channel-item:not([style*="display: none"])'));
        const channelIndex = number - 1; // Convert to 0-based index
        
        if (channelIndex >= 0 && channelIndex < visibleChannels.length) {
            const channelItem = visibleChannels[channelIndex];
            const streamKey = channelItem.dataset.streamKey;
            this.loadStream(streamKey);
            this.showSuccess(`Switched to channel ${number}: ${STREAMS[streamKey].name}`);
            // Scroll into view
            setTimeout(() => channelItem.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
        } else {
            this.showError(`Channel ${number} not found`);
        }
    }

    // Show currently typed number in overlay while composing
    showTypedNumber(numberStr) {
        const channelNumberDisplay = document.getElementById('channelNumberDisplay');
        const channelNumberText = document.getElementById('channelNumberText');
        if (channelNumberDisplay && channelNumberText) {
            if (numberStr && numberStr.length > 0) {
                channelNumberText.textContent = numberStr;
                channelNumberDisplay.classList.add('show');
            } else {
                channelNumberDisplay.classList.remove('show');
            }
        }
    }

    handleScrollNavigation(e) {
        const channelItems = Array.from(document.querySelectorAll('.channel-item:not([style*="display: none"])'));
        const currentIndex = channelItems.findIndex(item => item.classList.contains('active'));
        
        if (channelItems.length === 0) return;
        
        // Determine scroll direction
        const scrollDirection = e.deltaY > 0 ? 1 : -1;
        
        // Calculate new index
        let newIndex = currentIndex + scrollDirection;
        
        // Handle wrap-around
        if (newIndex < 0) {
            newIndex = channelItems.length - 1;
        } else if (newIndex >= channelItems.length) {
            newIndex = 0;
        }
        
        // Load the new channel
                        if (newIndex !== currentIndex) {
                    const newChannelKey = channelItems[newIndex].dataset.streamKey;
                    if (newChannelKey) {
                        this.loadStream(newChannelKey);
                        this.showSidebarForChannelChange();
                        
                        // Scroll the channel into view
                        setTimeout(() => {
                            channelItems[newIndex].scrollIntoView({
                                behavior: 'smooth',
                                block: 'center'
                            });
                        }, 100);
                    }
                }
    }

    showChannelPopup(channelName) {
        const popup = document.getElementById('channelNamePopup');
        const channelNameElement = document.getElementById('currentChannelName');
        const channelInfoElement = document.getElementById('currentChannelInfo');
        
        if (popup && channelNameElement && channelInfoElement) {
            channelNameElement.textContent = channelName;
            popup.classList.add('show');
            
            setTimeout(() => {
                popup.classList.remove('show');
            }, 2000);
        }
    }

    updateChannelNumber(channelIndex) {
        const channelNumberDisplay = document.getElementById('channelNumberDisplay');
        const channelNumberText = document.getElementById('channelNumberText');
        
        if (channelNumberDisplay && channelNumberText) {
            channelNumberText.textContent = channelIndex + 1;
            channelNumberDisplay.classList.add('show');
            
            setTimeout(() => {
                channelNumberDisplay.classList.remove('show');
            }, 2000);
        }
    }

    showNumberInputHint(channelNumber) {
        const popup = document.getElementById('channelNamePopup');
        const channelInfoElement = document.getElementById('currentChannelInfo');
        
        if (popup && channelInfoElement) {
            // Find the current channel's alphabetical position
            const currentChannelItem = document.querySelector('.channel-item.active');
            let alphaPosition = 1;
            if (currentChannelItem) {
                const visibleChannels = Array.from(document.querySelectorAll('.channel-item:not([style*="display: none"])'));
                alphaPosition = visibleChannels.indexOf(currentChannelItem) + 1;
            }
            
            channelInfoElement.textContent = `Channel ${alphaPosition} • Type channel number (e.g., 12, 128) then Enter • Arrow keys to navigate`;
            
            // Show the popup briefly
            popup.classList.add('show');
            
            setTimeout(() => {
                popup.classList.remove('show');
            }, 3000);
        }
    }

    handleUrlHash() {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        
        if (hash) {
            // Try to find channel by hash
            const channelKey = this.findChannelByHash(hash);
            if (channelKey) {
                this.loadStream(channelKey);
                return;
            }
        }
        
        // If no hash or channel not found, load first channel
        const firstChannelKey = Object.keys(STREAMS)[0];
        if (firstChannelKey) {
            this.loadStream(firstChannelKey);
        }
    }

    findChannelByHash(hash) {
        // Try to find channel by exact key match
        if (STREAMS[hash]) {
            return hash;
        }
        
        // Try to find channel by name (case-insensitive)
        const normalizedHash = hash.toLowerCase().replace(/[^a-z0-9]/g, '');
        
        for (const [key, stream] of Object.entries(STREAMS)) {
            const normalizedName = stream.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (normalizedName === normalizedHash) {
                return key;
            }
        }
        
        return null;
    }

    updateUrlHash(channelKey) {
        const channel = STREAMS[channelKey];
        if (channel) {
            // Create a clean URL-friendly hash from channel name
            const hash = channel.name.toLowerCase()
                .replace(/[^a-z0-9]/g, '')
                .replace(/\s+/g, '');
            
            // Update URL without reloading the page
            window.history.replaceState(null, null, `#${hash}`);
        }
    }

    setHighestQualityLevel() {
        // Quality forcing disabled - letting ABR handle quality selection
        console.log('🚫 Quality forcing disabled - ABR will auto-select quality');
        return;
    }

    disableDashAdaptiveStreaming() {
        // DASH adaptive streaming is now ENABLED for slow networks
        console.log('✅ DASH adaptive streaming is enabled - letting ABR handle quality');
        return;
    }

    selectHighestQuality() {
        // Quality forcing disabled - letting ABR handle quality selection
        console.log('🚫 selectHighestQuality disabled - ABR will auto-select quality');
        return;
    }

    setupQualityEnforcement() {
        if (!this.player) return;
        
        console.log('🛡️ ABR enabled - allowing automatic quality adjustment');
        
        // Monitor quality changes for logging only
        this.player.on('levelsChanged', (event) => {
            console.log('🔄 Levels changed event:', event);
            // No quality forcing - let ABR handle it
        });
        
        this.player.on('visualQuality', (event) => {
            console.log('👁️ Visual quality changed:', event);
            // Just log the change, ABR is handling quality selection
            const currentLevel = event.level;
            if (currentLevel) {
                console.log(`📊 Current quality: ${currentLevel.height}p`);
            }
        });
        
        this.player.on('levels', (event) => {
            console.log('📊 Levels available:', event);
            // No quality forcing - let ABR select appropriate quality
        });
        
        // Monitor buffer events for informational purposes only
        this.player.on('bufferChange', (event) => {
            if (event.newstate === false) { // Buffer empty
                console.log('📦 Buffer empty');
                // Don't force quality changes on buffer events
            }
        });
    }
    
    startQualityMonitoring() {
        // Disable aggressive quality monitoring - let user control quality manually
        console.log('🔍 Quality monitoring disabled - user has manual control');
        
        // Clean up any existing monitoring
        if (this.qualityMonitorInterval) {
            clearInterval(this.qualityMonitorInterval);
            this.qualityMonitorInterval = null;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;

        if (type === 'error') {
            notification.style.background = '#dc3545';
        } else {
            notification.style.background = '#28a745';
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    // Sidebar management methods
    showSidebarTemporarily() {
        const sidebar = document.getElementById('channelSidebar');
        if (sidebar) {
            // Clear any existing temporary timer
            if (this.tempSidebarTimer) {
                clearTimeout(this.tempSidebarTimer);
            }
            
            sidebar.classList.add('show');
            
            // Auto-hide after 4 seconds
            this.tempSidebarTimer = setTimeout(() => {
                this.hideSidebar();
                this.tempSidebarTimer = null;
            }, 4000);
        }
    }
    
    showSidebarForChannelChange() {
        const sidebar = document.getElementById('channelSidebar');
        if (sidebar) {
            // Clear any existing channel change timer
            if (this.channelChangeTimer) {
                clearTimeout(this.channelChangeTimer);
            }
            
            sidebar.classList.add('show');
            
            // Auto-hide after 4 seconds for channel changes
            this.channelChangeTimer = setTimeout(() => {
                this.hideSidebar();
                this.channelChangeTimer = null;
            }, 4000);
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('channelSidebar');
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        
        if (sidebar && menuToggleBtn) {
            sidebar.classList.toggle('show');
            menuToggleBtn.classList.toggle('show');
            
            // Reset auto-hide timer when manually toggled
            if (sidebar.classList.contains('show')) {
                this.resetSidebarAutoHide();
            }
        }
    }

    hideSidebar() {
        const sidebar = document.getElementById('channelSidebar');
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        
        if (sidebar && menuToggleBtn) {
            sidebar.classList.remove('show');
            menuToggleBtn.classList.remove('show');
        }
    }

    setupSidebarAutoHide() {
        let autoHideTimer;
        const sidebar = document.getElementById('channelSidebar');
        
        if (sidebar) {
            // Auto-hide after 5 seconds of inactivity
            const startAutoHideTimer = () => {
                clearTimeout(autoHideTimer);
                autoHideTimer = setTimeout(() => {
                    this.hideSidebar();
                }, 5000);
            };

            // Reset timer on sidebar interaction
            sidebar.addEventListener('mouseenter', () => {
                clearTimeout(autoHideTimer);
            });

            sidebar.addEventListener('mouseleave', () => {
                // Don't start timer immediately when leaving sidebar
                // Let the video container handle the hiding logic
            });

            // Reset timer on any sidebar interaction
            sidebar.addEventListener('click', () => {
                clearTimeout(autoHideTimer);
                if (sidebar.classList.contains('show')) {
                    startAutoHideTimer();
                }
            });

            // Reset timer on scroll within sidebar
            sidebar.addEventListener('scroll', () => {
                clearTimeout(autoHideTimer);
                if (sidebar.classList.contains('show')) {
                    startAutoHideTimer();
                }
            });
        }
    }

    resetSidebarHoverState() {
        // Reset sidebar hover state to ensure proper behavior
        const sidebar = document.getElementById('channelSidebar');
        const videoContainer = document.querySelector('.video-container');
        
        if (sidebar && videoContainer && window.innerWidth >= 993) {
            // Force sidebar to hide after channel change to reset hover state
            setTimeout(() => {
                const sidebarRect = sidebar.getBoundingClientRect();
                const videoRect = videoContainer.getBoundingClientRect();
                
                // Check if mouse is actually over either element
                const mouseX = event?.clientX || 0;
                const mouseY = event?.clientY || 0;
                
                const isOverSidebar = (
                    mouseX >= sidebarRect.left &&
                    mouseX <= sidebarRect.right &&
                    mouseY >= sidebarRect.top &&
                    mouseY <= sidebarRect.bottom
                );
                
                const isOverVideo = (
                    mouseX >= videoRect.left &&
                    mouseX <= videoRect.right &&
                    mouseY >= videoRect.top &&
                    mouseY <= videoRect.bottom
                );
                
                // Only hide if mouse is not over either element
                if (!isOverSidebar && !isOverVideo) {
                    sidebar.classList.remove('show');
                }
            }, 100);
        }
    }

    initializeChannelApiSidebarBehavior() {
        // Implement channelapi's reliable sidebar hiding mechanics with improved detection
        if (window.innerWidth >= 993) {
            const sidebar = document.getElementById('channelSidebar');
            const videoContainer = document.querySelector('.video-container');
            let hideTimer;
            let videoInactivityTimer;
            let isMouseOnSidebar = false;
            let isMouseOnVideo = false;
            
            // Function to check if mouse is actually over elements
            const checkMousePosition = (event) => {
                const sidebarRect = sidebar.getBoundingClientRect();
                const videoRect = videoContainer.getBoundingClientRect();
                
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                
                // Check if mouse is over sidebar
                const isOverSidebar = (
                    mouseX >= sidebarRect.left &&
                    mouseX <= sidebarRect.right &&
                    mouseY >= sidebarRect.top &&
                    mouseY <= sidebarRect.bottom
                );
                
                // Check if mouse is over video
                const isOverVideo = (
                    mouseX >= videoRect.left &&
                    mouseX <= videoRect.right &&
                    mouseY >= videoRect.top &&
                    mouseY <= videoRect.bottom
                );
                
                return { isOverSidebar, isOverVideo };
            };
            
            // Global mouse move listener for accurate tracking
            document.addEventListener('mousemove', (event) => {
                const { isOverSidebar, isOverVideo } = checkMousePosition(event);
                
                // Update states based on actual mouse position
                if (isOverSidebar) {
                    isMouseOnSidebar = true;
                    isMouseOnVideo = false;
                    clearTimeout(hideTimer);
                    clearTimeout(videoInactivityTimer);
                    sidebar.classList.add('show');
                    this.adjustVideoPlayerForSidebar(true);
                } else if (isOverVideo) {
                    isMouseOnVideo = true;
                    isMouseOnSidebar = false;
                    clearTimeout(hideTimer);
                    sidebar.classList.add('show');
                    this.adjustVideoPlayerForSidebar(true);
                    
                    // Hide sidebar after 2 seconds of no mouse movement on video
                    clearTimeout(videoInactivityTimer);
                    videoInactivityTimer = setTimeout(() => {
                        if (isMouseOnVideo && !isMouseOnSidebar) {
                            sidebar.classList.remove('show');
                            this.adjustVideoPlayerForSidebar(false);
                        }
                    }, 2000);
                } else {
                    // Mouse is not over either element
                    isMouseOnVideo = false;
                    isMouseOnSidebar = false;
                    clearTimeout(hideTimer);
                    clearTimeout(videoInactivityTimer);
                    hideTimer = setTimeout(() => {
                        sidebar.classList.remove('show');
                        this.adjustVideoPlayerForSidebar(false);
                    }, 300);
                }
            });
            
            // Legacy event listeners for compatibility
            videoContainer.addEventListener('mouseenter', () => {
                isMouseOnVideo = true;
                clearTimeout(hideTimer);
                sidebar.classList.add('show');
                this.adjustVideoPlayerForSidebar(true);
            });
            
            videoContainer.addEventListener('mouseleave', () => {
                isMouseOnVideo = false;
                if (!isMouseOnSidebar) {
                    hideTimer = setTimeout(() => {
                        sidebar.classList.remove('show');
                        this.adjustVideoPlayerForSidebar(false);
                    }, 300);
                }
            });
            
            sidebar.addEventListener('mouseenter', () => {
                isMouseOnSidebar = true;
                clearTimeout(hideTimer);
                sidebar.classList.add('show');
                this.adjustVideoPlayerForSidebar(true);
            });
            
            sidebar.addEventListener('mouseleave', () => {
                isMouseOnSidebar = false;
                if (!isMouseOnVideo) {
                    hideTimer = setTimeout(() => {
                        sidebar.classList.remove('show');
                        this.adjustVideoPlayerForSidebar(false);
                    }, 300);
                }
            });
            
            // Force cleanup every 3 seconds to prevent stuck states
            setInterval(() => {
                if (sidebar.classList.contains('show')) {
                    const { isOverSidebar, isOverVideo } = checkMousePosition({ 
                        clientX: event?.clientX || 0, 
                        clientY: event?.clientY || 0 
                    });
                    
                    if (!isOverSidebar && !isOverVideo) {
                        sidebar.classList.remove('show');
                        this.adjustVideoPlayerForSidebar(false);
                        console.log('Sidebar force-hidden due to mouse position');
                    }
                }
            }, 3000);
            
            // Manual hide function for debugging
            window.hideSidebarManual = () => {
                sidebar.classList.remove('show');
                this.adjustVideoPlayerForSidebar(false);
                console.log('Sidebar manually hidden');
            };
            
            // Debug function to show current mouse position
            window.debugMousePosition = () => {
                const { isOverSidebar, isOverVideo } = checkMousePosition({ 
                    clientX: event?.clientX || 0, 
                    clientY: event?.clientY || 0 
                });
                console.log('Mouse position debug:', {
                    isOverSidebar,
                    isOverVideo,
                    sidebarVisible: sidebar.classList.contains('show'),
                    isMouseOnSidebar,
                    isMouseOnVideo
                });
            };
        }
    }

    adjustVideoPlayerForSidebar(sidebarVisible) {
        // Adjust video player position when sidebar shows/hides (big screens only, not TV)
        if (window.innerWidth >= 993 && window.innerWidth < 1920) {
            const videoContainer = document.querySelector('.video-container');
            const mainContent = document.querySelector('.main-content');
            
            if (videoContainer && mainContent) {
                if (sidebarVisible) {
                    // Move video player to the right when sidebar is visible
                    mainContent.style.marginLeft = '300px'; // Match sidebar width
                    mainContent.style.transition = 'margin-left 0.3s ease';
                    videoContainer.style.width = 'calc(100vw - 300px)';
                    videoContainer.style.transition = 'width 0.3s ease';
                } else {
                    // Reset video player position when sidebar is hidden
                    mainContent.style.marginLeft = '0';
                    videoContainer.style.width = '100vw';
                }
            }
        }
    }

    setupSplashScreen() {
        const splashScreen = document.getElementById('splashScreen');
        if (!splashScreen) return;
        
        // Show splash screen initially
        splashScreen.classList.remove('hidden');
        
        // Handle click on splash screen
        splashScreen.addEventListener('click', () => {
            // Hide splash screen
            splashScreen.classList.add('hidden');
            
            // Enable audio context (required for autoplay with audio)
            this.enableAudioContext();
            
            // Load initial channel after user interaction
            setTimeout(() => {
                this.handleUrlHash();
            }, 100);
        });
        
        // Also handle keyboard interaction
        document.addEventListener('keydown', (e) => {
            if (!splashScreen.classList.contains('hidden')) {
                splashScreen.classList.add('hidden');
                this.enableAudioContext();
                setTimeout(() => {
                    this.handleUrlHash();
                }, 100);
            }
        }, { once: true });
    }
    
    enableAudioContext() {
        // Create and resume audio context to enable autoplay with audio
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const audioContext = new AudioContext();
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
            }
        } catch (error) {
            console.log('Audio context not supported or already enabled');
        }
    }

    resetSidebarAutoHide() {
        // This method can be called to reset the auto-hide timer
        // Currently handled in setupSidebarAutoHide
    }
    
    handleFullscreenChange() {
        const menuToggleBtn = document.getElementById('menuToggleBtn');
        const channelNumberDisplay = document.getElementById('channelNumberDisplay');
        
        if (document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement) {
            // In fullscreen - hide controls
            if (menuToggleBtn) {
                menuToggleBtn.style.display = 'none';
            }
            if (channelNumberDisplay) {
                channelNumberDisplay.style.display = 'none';
            }
        } else {
            // Not in fullscreen - show controls
            if (menuToggleBtn) {
                menuToggleBtn.style.display = 'flex';
            }
            if (channelNumberDisplay) {
                channelNumberDisplay.style.display = 'block';
            }
        }
    }
    
    forceAutoplay() {
        // Force autoplay for TV and other devices
        if (this.player && typeof this.player.play === 'function') {
            try {
                const playPromise = this.player.play();
                
                // Check if play() returns a Promise
                if (playPromise && typeof playPromise.then === 'function') {
                    playPromise.then(() => {
                        console.log('Forced autoplay successful');
                        // Show success message when autoplay starts
                        if (this.currentStream) {
                            const stream = STREAMS[this.currentStream];
                            if (stream) {
                                this.showSuccess(`${stream.name} now playing`);
                            }
                        }
                    }).catch((error) => {
                        console.log('Forced autoplay failed:', error);
                        // Show user-friendly message
                        this.showNotification('Click play to start watching', 'info');
                    });
                } else {
                    // If play() doesn't return a Promise, assume it worked
                    console.log('Forced autoplay called (no Promise returned)');
                    if (this.currentStream) {
                        const stream = STREAMS[this.currentStream];
                        if (stream) {
                            this.showSuccess(`${stream.name} now playing`);
                        }
                    }
                }
            } catch (error) {
                console.log('Forced autoplay error:', error);
                this.showNotification('Click play to start watching', 'info');
            }
        } else {
            console.log('Player not ready for autoplay');
        }
    }
    
    setupMobileOptimizations() {
        // Mobile-specific optimizations
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Double tap to fullscreen functionality - only on video element
            let lastTouchEnd = 0;
            let touchCount = 0;
            let touchTimer = null;
            
            const videoContainer = document.querySelector('.video-container');
            if (videoContainer) {
                videoContainer.addEventListener('touchend', (event) => {
                    const now = (new Date()).getTime();
                    touchCount++;
                    
                    if (now - lastTouchEnd <= 300) {
                        // Double tap detected
                        if (touchCount === 2) {
                            event.preventDefault();
                            // Use JWPlayer fullscreen API
                            if (window.jwplayer) {
                                const player = window.jwplayer();
                                if (player.getFullscreen && player.setFullscreen) {
                                    player.setFullscreen(!player.getFullscreen());
                                }
                            }
                            touchCount = 0;
                            lastTouchEnd = 0;
                        }
                    } else {
                        // Reset touch count if too much time has passed
                        touchCount = 1;
                    }
                    
                    lastTouchEnd = now;
                    
                    // Reset touch count after a delay
                    if (touchTimer) clearTimeout(touchTimer);
                    touchTimer = setTimeout(() => {
                        touchCount = 0;
                    }, 500);
                }, false);
            }
            
            // Let JW Player handle video container completely
            // No custom styling - JW Player handles everything
            
            // Use default menu button positioning
            const menuToggleBtn = document.getElementById('menuToggleBtn');
            if (menuToggleBtn) {
                menuToggleBtn.style.position = 'absolute';
                menuToggleBtn.style.top = '20px';
                menuToggleBtn.style.left = '20px';
                menuToggleBtn.style.zIndex = '2000';
                menuToggleBtn.style.minWidth = '48px';
                menuToggleBtn.style.minHeight = '48px';
            }
            
            // Use default channel number display positioning
            const channelNumberDisplay = document.getElementById('channelNumberDisplay');
            if (channelNumberDisplay) {
                channelNumberDisplay.style.position = 'absolute';
                channelNumberDisplay.style.top = '20px';
                channelNumberDisplay.style.right = '20px';
                channelNumberDisplay.style.zIndex = '2000';
            }
            
            // Handle orientation changes
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    // Re-apply mobile optimizations after orientation change
                    this.setupMobileOptimizations();
                }, 100);
            });
            
            // Handle resize events for mobile
            window.addEventListener('resize', () => {
                if (window.innerWidth <= 768) {
                    this.setupMobileOptimizations();
                }
            });
            
            // Handle fullscreen changes
            document.addEventListener('fullscreenchange', () => {
                this.handleFullscreenChange();
            });
            
            document.addEventListener('webkitfullscreenchange', () => {
                this.handleFullscreenChange();
            });
            
            document.addEventListener('mozfullscreenchange', () => {
                this.handleFullscreenChange();
            });
        }
    }
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new JWPlayerDemo();
});

// Export for potential use in other modules
export default JWPlayerDemo; 
