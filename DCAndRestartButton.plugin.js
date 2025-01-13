/**
 * @name DCAndRestartButton.plugin
 * @author CRAWNiiK
 * @description Disconnects from a voice call before restarting Discord (manual trigger). Button only appears while in a voice call.
 * @version 1.0.0
 * @source https://github.com/CRAWNiiK/BetterDiscordPlugins/blob/main/DCAndRestartButton.plugin.js
 */

module.exports = class AutoDisconnectOnRestart {
    constructor() {
        this.initialized = false;
        this.button = null;
        this.voiceModule = null;
        this.interval = null;
    }

    getName() {
        return "AutoDisconnectOnRestart";
    }

    getDescription() {
        return "Disconnects from a voice call before restarting Discord (manual trigger). Button only appears while in a voice call.";
    }

    getVersion() {
        return "1.0.0";
    }

    getAuthor() {
        return "CRAWNiiK";
    }

    start() {
        this.initialize();
    }

    stop() {
        this.cleanup();
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;

        // Find the voice module
        this.voiceModule = BdApi.findModuleByProps("getVoiceChannelId");

        // Add a button to the UI
        this.addButton();

        // Check voice call status periodically
        this.interval = setInterval(() => this.updateButtonVisibility(), 1000); // Check every second
    }

    cleanup() {
        if (!this.initialized) return;
        this.initialized = false;

        // Remove the button from the UI
        this.removeButton();

        // Clear the interval
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    addButton() {
        // Create a button in the Discord UI
        this.button = document.createElement("div");
        this.button.textContent = "DC & Restart";
        this.button.style.position = "fixed";
        this.button.style.bottom = "20px";
        this.button.style.right = "20px";
        this.button.style.padding = "10px";
        this.button.style.backgroundColor = "#7289DA";
        this.button.style.color = "#FFFFFF";
        this.button.style.borderRadius = "5px";
        this.button.style.cursor = "pointer";
        this.button.style.zIndex = "1000";
        this.button.style.display = "none"; // Hidden by default
        this.button.addEventListener("click", () => this.handleRestart());

        // Append the button to the body
        document.body.appendChild(this.button);
    }

    removeButton() {
        if (this.button) {
            this.button.remove();
            this.button = null;
        }
    }

    updateButtonVisibility() {
        if (!this.voiceModule || !this.button) return;

        // Check if the user is in a voice call
        const voiceChannelId = this.voiceModule.getVoiceChannelId();

        // Show or hide the button based on voice call status
        if (voiceChannelId) {
            this.button.style.display = "block"; // Show the button
        } else {
            this.button.style.display = "none"; // Hide the button
        }
    }

    handleRestart() {
        const voiceChannelId = this.voiceModule?.getVoiceChannelId();

        if (voiceChannelId) {
            // Disconnect from the call and restart
            this.disconnectFromVoice();
        } else {
            // If not in a call, restart immediately
            this.restartDiscord();
        }
    }

    disconnectFromVoice() {
        // Find the RTCManager module
        const rtcManager = BdApi.findModuleByProps("getRTCConnection");
        if (rtcManager) {
            const connection = rtcManager.getRTCConnection();
            if (connection) {
                // Destroy the RTC connection
                connection.destroy();

                // Wait for the disconnect to complete
                setTimeout(() => {
                    // Restart Discord after disconnection
                    this.restartDiscord();
                }, 1000); // 1 second delay
                return;
            }
        }

        // If the RTCManager method fails, try the alternative method
        this.alternativeDisconnect();
    }

    alternativeDisconnect() {
        // Try an alternative method to disconnect from the voice call
        const voiceDispatcher = BdApi.findModuleByProps("dispatch").dispatch;
        if (voiceDispatcher) {
            voiceDispatcher({
                type: "VOICE_DISCONNECT",
                context: "BetterDiscord"
            });

            // Wait for the disconnect to complete
            setTimeout(() => {
                // Restart Discord after disconnection
                this.restartDiscord();
            }, 1000); // 1 second delay
        } else {
            // If something goes wrong, restart anyway
            this.restartDiscord();
        }
    }

    restartDiscord() {
        // Use DiscordNative.app.relaunch to restart Discord
        if (typeof DiscordNative !== "undefined" && DiscordNative.app.relaunch) {
            DiscordNative.app.relaunch();
        }
    }
};
