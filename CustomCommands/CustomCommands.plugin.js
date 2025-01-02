/**
 * @name CustomCommands
 * @version 1.0.0
 * @description Create custom commands in chat with user-defined messages.
 * @author CRAWNiiK
 * @invite 9BHc5Wy7
 * @source https://github.com/CRAWNiiK/BetterDiscordPlugins/blob/main/CustomCommands/CustomCommands.plugin.js
 * @authorId 518240643156541470
 * @donate dogecoin:DC1sWvo3tZw9aLVjYweAqxQruKpMDC31go
 * @updateUrl https://raw.github.com/CRAWNiiK/BetterDiscordPlugins/blob/main/CustomCommands/CustomCommands.plugin.js
 */

const fs = require('fs');
const path = require('path');

module.exports = class CustomCommandReplacer {
    constructor() {
        // Default file path to save commands
        this.configFilePath = path.join(BdApi.Plugins.folder, 'CustomCommands.config.json');
        this.config = {
            prefix: "./",
            commands: {
                "hello": "Hello, world!",
                "rules": "**Server Rules:**\n1. **Be Respectful** - Treat everyone with respect. No harassment or hate speech.\n2. **No Spamming** - Avoid excessive messages or disruptive content.\n3. **Stay On Topic** - Keep discussions relevant to the channel.\n4. **Follow Discord TOS** - Ensure your actions align with Discord's Terms of Service.",
                "bye": "Goodbye, cruel world!",
				"triforce": "‌ ‌  ▲\n▲‌ ▲"
            }
        };
        this.loadConfig();
    }

    // Load the config file or create it if missing
    loadConfig() {
        if (fs.existsSync(this.configFilePath)) {
            try {
                const data = fs.readFileSync(this.configFilePath, 'utf-8');
                const parsedData = JSON.parse(data);
                this.config = { ...this.config, ...parsedData };
            } catch (error) {
                BdApi.alert("Error", "Failed to load commands from file.");
            }
        } else {
            this.createDefaultConfig();
        }
    }

    // Create default config file if it doesn't exist
    createDefaultConfig() {
        try {
            const defaultConfig = {
                prefix: "./",
                commands: {
                    "hello": "Hello, world!",
                    "rules": "**Server Rules:**\n1. **Be Respectful** - Treat everyone with respect. No harassment or hate speech.\n2. **No Spamming** - Avoid excessive messages or disruptive content.\n3. **Stay On Topic** - Keep discussions relevant to the channel.\n4. **Follow Discord TOS** - Ensure your actions align with Discord's Terms of Service.",
                    "bye": "Goodbye, cruel world!",
					"triforce": "‌ ‌  ▲\n▲‌ ▲"
                }
            };

            const data = JSON.stringify(defaultConfig, null, 2); // Pretty-print JSON
            fs.writeFileSync(this.configFilePath, data, 'utf-8');
            BdApi.alert("Custom Commands", "Default config file created. CustomCommands.config.json can be edited in a text editor as well. Have fun!");
        } catch (error) {
            BdApi.alert("Error", "Failed to create default config.");
        }
    }

    // Save the config to the file
    saveConfigPrefix() {
        try {
            const data = JSON.stringify(this.config, null, 2); // Pretty-print JSON
            fs.writeFileSync(this.configFilePath, data, 'utf-8');
            BdApi.alert("Success", "Prefix updated successfully!");
        } catch (error) {
            BdApi.alert("Error", "Failed to save commands.");
        }
    }
	
	// Save the config to the file
    saveConfigCommands() {
        try {
            const data = JSON.stringify(this.config, null, 2); // Pretty-print JSON
            fs.writeFileSync(this.configFilePath, data, 'utf-8');
            BdApi.alert("Success", "Commands saved successfully!");
        } catch (error) {
            BdApi.alert("Error", "Failed to save commands.");
        }
    }
	
		// Save the config to the file
    saveConfigDelete() {
        try {
            const data = JSON.stringify(this.config, null, 2); // Pretty-print JSON
            fs.writeFileSync(this.configFilePath, data, 'utf-8');
            BdApi.alert("Success", "Command deleted!");
        } catch (error) {
            BdApi.alert("Error", "Failed to save commands.");
        }
    }

    start() {
		BdApi.Patcher.before("CustomCommandReplacer", BdApi.findModuleByProps("sendMessage"), "sendMessage", (thisObject, [channelId, message]) => {
			// Check if the message starts with the command prefix
			if (!message.content.startsWith(this.config.prefix)) return;
	
			const command = message.content.split(" ")[0].slice(this.config.prefix.length); // Get the command without the prefix
			if (this.config.commands[command]) {
				const args = message.content.slice(command.length + this.config.prefix.length).trim(); // Get command arguments (if any)
				const replacement = this.config.commands[command];
	
				// Modify the message with the corresponding response
				const newMessage = typeof replacement === "function"
					? replacement(args)
					: replacement;
	
				// Change the original message content to the new message
				message.content = newMessage;
	
				// Allow the modified message to be sent instead of the original one
				return [channelId, message]; // Return the modified message to be sent
			}
		});
	}

    stop() {
        BdApi.Patcher.unpatchAll("CustomCommandReplacer");
        //BdApi.alert("Info", "CustomCommandReplacer stopped.");
    }

    getSettingsPanel() {
        const panel = document.createElement("div");
        panel.style.padding = "10px";
        panel.style.backgroundColor = "#2f3136"; // Dark background

        // Prefix input
        const prefixContainer = document.createElement("div");
        prefixContainer.style.marginBottom = "15px";

        const prefixLabel = document.createElement("label");
        prefixLabel.textContent = "Command Prefix:";
        prefixLabel.style.display = "block";
        prefixLabel.style.marginBottom = "5px";
        prefixLabel.style.color = "#b9bbbe"; // Subtle text color

        const prefixInput = document.createElement("input");
        prefixInput.type = "text";
        prefixInput.value = this.config.prefix || "./";
        prefixInput.style.width = "60px"; // Adjusted to fit about 5 characters
        prefixInput.style.padding = "10px";
        prefixInput.style.border = "1px solid #42454a";
        prefixInput.style.borderRadius = "4px";
        prefixInput.style.backgroundColor = "#202225";
        prefixInput.style.color = "#ffffff";

        // Save Prefix Button
        const savePrefixButton = document.createElement("button");
        savePrefixButton.textContent = "Save Prefix";
        savePrefixButton.style.marginLeft = "10px";
        savePrefixButton.style.padding = "10px";
        savePrefixButton.style.backgroundColor = "#7289da";
        savePrefixButton.style.color = "#ffffff";
        savePrefixButton.style.border = "none";
        savePrefixButton.style.borderRadius = "4px";
        savePrefixButton.onclick = () => {
            this.config.prefix = prefixInput.value;
            this.saveConfigPrefix();
        };

        prefixContainer.appendChild(prefixLabel);
        prefixContainer.appendChild(prefixInput);
        prefixContainer.appendChild(savePrefixButton);
        panel.appendChild(prefixContainer);

        // Command list
		const inputs = Object.keys(this.config.commands).map((command) => {
			const container = document.createElement("div");
			container.style.marginRight = "10px";
			container.style.marginLeft = "10px";
			container.style.marginBottom = "15px";
			container.style.position = "relative"; // For positioning the remove button
			container.style.display = "flex";
		
			const commandLabel = document.createElement("label");
			commandLabel.textContent = "Command:";
			commandLabel.style.display = "block";
			commandLabel.style.marginBottom = "5px";
			commandLabel.style.color = "#b9bbbe"; // Subtle text color
		
			const commandInput = document.createElement("input");
			commandInput.type = "text";
			commandInput.value = command.replace(this.config.prefix, ""); // Remove the prefix for input
			commandInput.style.height = "10px";
			commandInput.style.width = "100px";
			commandInput.style.marginRight = "10px"; // Space between input and remove button
			commandInput.style.padding = "10px";
			commandInput.style.border = "1px solid #42454a";
			commandInput.style.borderRadius = "4px";
			commandInput.style.backgroundColor = "#202225";
			commandInput.style.color = "#ffffff";
		
			const responseLabel = document.createElement("label");
			responseLabel.textContent = "Response:";
			responseLabel.style.display = "block";
			responseLabel.style.marginTop = "10px";
			responseLabel.style.marginBottom = "5px";
			responseLabel.style.color = "#b9bbbe"; // Subtle text color
		
			// Response input as a textarea for multiline text
			const responseInput = document.createElement("textarea");
			responseInput.value = this.config.commands[command] || "";
			responseInput.style.width = "250px";
			responseInput.style.height = "50px"; // Adjust the height for multiline input
			responseInput.style.padding = "10px";
			responseInput.style.border = "1px solid #42454a";
			responseInput.style.borderRadius = "4px";
			responseInput.style.backgroundColor = "#202225";
			responseInput.style.color = "#ffffff";
			responseInput.style.resize = "none"; // Disable resizing
		
			// Remove command button
			const removeButton = document.createElement("button");
			removeButton.textContent = "X";
			removeButton.style.position = "relative";  // Position it within the container
			removeButton.style.top = "10px";
			removeButton.style.right = "10px";
			removeButton.style.width = "20px";
			removeButton.style.height = "20px";
			removeButton.style.marginLeft = "20px";  // Space between input and button
			removeButton.style.padding = "0";
			removeButton.style.backgroundColor = "#e74c3c";
			removeButton.style.color = "#ffffff";
			removeButton.style.border = "none";
			removeButton.style.borderRadius = "4px";
			removeButton.style.cursor = "pointer";
			removeButton.style.fontSize = "14px";
			removeButton.style.textAlign = "center";
			removeButton.onclick = () => {
				delete this.config.commands[command];
				panel.removeChild(container); // Remove the command's section
				//BdApi.alert("Deleted!", "Command removed successfully!");
				this.saveConfigDelete(); // Save after removing command
			};
		
			container.appendChild(commandLabel);
			container.appendChild(commandInput);
			container.appendChild(responseLabel);
			container.appendChild(responseInput);
			container.appendChild(removeButton);
			panel.appendChild(container);
		
			return { commandInput, responseInput };
		});

        // Add Command button
        const addCommandButton = document.createElement("button");
        addCommandButton.textContent = "Add Command";
        addCommandButton.style.marginTop = "10px";
        addCommandButton.style.marginLeft = "10px";
        addCommandButton.style.marginRight = "10px";
        addCommandButton.style.padding = "10px";
        addCommandButton.style.backgroundColor = "#7289da";
        addCommandButton.style.color = "#ffffff";
        addCommandButton.style.border = "none";
        addCommandButton.style.borderRadius = "4px";
        addCommandButton.onclick = () => {
            const container = document.createElement("div");
            container.style.marginBottom = "15px";
            container.style.position = "relative"; // For positioning the remove button

            const commandLabel = document.createElement("label");
            commandLabel.textContent = "Command:";
            commandLabel.style.display = "block";
            commandLabel.style.marginBottom = "5px";
            commandLabel.style.color = "#b9bbbe"; // Subtle text color

            const commandInput = document.createElement("input");
            commandInput.type = "text";
            commandInput.value = "";
            commandInput.style.width = "100px";
            commandInput.style.padding = "10px";
            commandInput.style.border = "1px solid #42454a";
            commandInput.style.borderRadius = "4px";
            commandInput.style.backgroundColor = "#202225";
            commandInput.style.color = "#ffffff";

            const responseLabel = document.createElement("label");
            responseLabel.textContent = "Response:";
            responseLabel.style.display = "block";
            responseLabel.style.marginTop = "10px";
            responseLabel.style.marginBottom = "5px";
            responseLabel.style.color = "#b9bbbe"; // Subtle text color

            const responseInput = document.createElement("textarea");
            responseInput.value = "";
            responseInput.style.width = "250px";
            responseInput.style.height = "50px"; // Adjust the height for multiline input
            responseInput.style.padding = "10px";
            responseInput.style.border = "1px solid #42454a";
            responseInput.style.borderRadius = "4px";
            responseInput.style.backgroundColor = "#202225";
            responseInput.style.color = "#ffffff";
            responseInput.style.resize = "none"; // Disable resizing

            // Remove command button
            const removeButton = document.createElement("button");
            removeButton.textContent = "X";
            removeButton.style.position = "absolute";  // Position it within the container
            removeButton.style.top = "10px";
            removeButton.style.right = "10px";
            removeButton.style.width = "20px";
            removeButton.style.height = "20px";
            removeButton.style.padding = "0";
            removeButton.style.backgroundColor = "#e74c3c";
            removeButton.style.color = "#ffffff";
            removeButton.style.border = "none";
            removeButton.style.borderRadius = "4px";
            removeButton.style.cursor = "pointer";
            removeButton.style.fontSize = "14px";
            removeButton.style.textAlign = "center";
            removeButton.onclick = () => {
                panel.removeChild(container); // Remove the command's section
            };

            container.appendChild(commandLabel);
            container.appendChild(commandInput);
            container.appendChild(responseLabel);
            container.appendChild(responseInput);
            container.appendChild(removeButton);
            panel.appendChild(container);
        };

        panel.appendChild(addCommandButton);

        // Save Commands Button
		const saveCommandsButton = document.createElement("button");
		saveCommandsButton.textContent = "Save Commands";
		saveCommandsButton.style.marginTop = "10px";
		saveCommandsButton.style.padding = "10px";
		saveCommandsButton.style.backgroundColor = "#7289da";
		saveCommandsButton.style.color = "#ffffff";
		saveCommandsButton.style.border = "none";
		saveCommandsButton.style.borderRadius = "4px";
		saveCommandsButton.onclick = () => {
			// Save all commands from the input fields
			const newCommands = {};
		
			// Loop through each input field and collect the values
			panel.querySelectorAll('div').forEach((container) => {
				const commandInput = container.querySelector('input[type="text"]');
				const responseInput = container.querySelector('textarea');
		
				if (commandInput && responseInput) {
					const command = commandInput.value.trim();
					const response = responseInput.value.trim();
		
					if (command && response) {
						newCommands[command] = response;
					}
				}
			});
		
			// Update the config with the new commands
			this.config.commands = { ...newCommands };
			this.saveConfigCommands(); // Save after updating commands
		};

        panel.appendChild(saveCommandsButton);

        return panel;
    }
}
