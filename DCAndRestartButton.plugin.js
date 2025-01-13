/**
 * @name RelaunchAndReconnect
 * @author CRAWNiiK
 * @description Relaunches Discord with a button that only appears while in a voice call. Automatically clicks the "Reconnect" button if present after relaunching.
 * @version 1.0.0
 * @source https://github.com/CRAWNiiK/BetterDiscordPlugins
 */

module.exports = class RelaunchAndReconnect {
    constructor() {
        this.initialized = false;
        this.button = null;
        this.voiceModule = null;
        this.interval = null;
    }

    getName() {
        return "RelaunchAndReconnect";
    }

    getDescription() {
        return "Relaunches Discord with a button that only appears while in a voice call. Automatically clicks the 'Reconnect' button if present after relaunching.";
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

        // Automatically click the "Reconnect" button if present after Discord starts up
        this.autoReconnect();
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
        this.button.textContent = "Relaunch";
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
        this.button.addEventListener("click", () => this.handleRelaunch());

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

    handleRelaunch() {
        // Relaunch Discord
        this.relaunchDiscord();
    }

    relaunchDiscord() {
        // Use DiscordNative.app.relaunch to relaunch Discord
        if (typeof DiscordNative !== "undefined" && DiscordNative.app.relaunch) {
            DiscordNative.app.relaunch();
        }
    }

    autoReconnect() {
        // Wait for Discord to finish loading
        const observer = new MutationObserver(() => {
            // Check for the presence of the reconnect notice
            const reconnectNotice = document.querySelector('.notice_be03aa.colorDefault_be03aa');
            if (reconnectNotice) {
                // Find the "Reconnect" button
                const reconnectButton = reconnectNotice.querySelector('button.button_be03aa');
                if (reconnectButton) {
                    // Click the "Reconnect" button
                    reconnectButton.click();
                    console.log("Automatically clicked the 'Reconnect' button.");
                }
            }
        });

        // Start observing the document for changes
        observer.observe(document.body, { childList: true, subtree: true });
    }
};
