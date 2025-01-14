/**
 * @name SearchBar
 * @author CRAWNiiK
 * @description Adds a hidden search bar to Discord's title bar that can be toggled with a button.
 * @version 1.0.0
 * @source https://github.com/CRAWNiiK/BetterDiscordPlugins/blob/main/SearchBar.plugin.js
 */

module.exports = class SearchBar {
  constructor() {
    this.initialized = false;
    this.isVisible = false; // Track visibility of the Search Bar
    this.observer = null; // MutationObserver instance
    this.selectedEngine = "Google"; // Default search engine
  }

  getName() {
    return "Search Bar";
  }

  getDescription() {
    return "Adds a hidden search bar to Discord that expands out of a button on the title bar. Supports Google, DuckDuckGo, and Bing.";
  }

  getVersion() {
    return "1.0.0";
  }

  getAuthor() {
    return "CRAWNiiK";
  }

  start() {
    this.injectSearchBar();
  }

  stop() {
    this.removeSearchBar();
  }

  injectSearchBar() {
    if (this.initialized) return;
    this.initialized = true;

    // Start observing the DOM for changes
    this.observer = new MutationObserver(() => {
      const titleBar = this.findTitleBar();
      if (titleBar && !titleBar.querySelector(".search-bar-toggle")) {
        this.createSearchBar(titleBar);
      }
    });

    // Observe the entire document for changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Initial injection
    const titleBar = this.findTitleBar();
    if (titleBar) {
      this.createSearchBar(titleBar);
    }
  }

  findTitleBar() {
    // Look for the title bar in servers (where the "Threads" button exists)
    let titleBar = document.querySelector('[aria-label="Threads"]')?.parentElement?.parentElement;

    // If not found, look for the title bar in DMs
    if (!titleBar) {
      // Look for the container that holds the call buttons in DMs
      titleBar = document.querySelector('[aria-label="Call"], [aria-label="Start Voice Call"], [aria-label="Start Video Call"]')?.parentElement?.parentElement;
    }

    return titleBar;
  }

  createSearchBar(titleBar) {
    // Check if the toggle button already exists
    if (titleBar.querySelector(".search-bar-toggle")) return;

    // Create the toggle button
    const toggleButton = document.createElement("div");
    toggleButton.innerText = "🔍"; // Magnifying glass emoji
    toggleButton.classList.add("search-bar-toggle"); // Add a class for easy identification
    toggleButton.style.cursor = "pointer";
    toggleButton.style.marginRight = "10px"; // Space between the toggle button and the next button
    toggleButton.style.display = "flex";
    toggleButton.style.alignItems = "center";
    toggleButton.style.justifyContent = "center";
    toggleButton.style.width = "32px";
    toggleButton.style.height = "32px";
    toggleButton.style.borderRadius = "4px";
    toggleButton.style.backgroundColor = "transparent";
    toggleButton.style.color = "#fff";
    toggleButton.style.transition = "background-color 0.2s ease";
    toggleButton.style.position = "relative"; // Needed for absolute positioning of the search bar

    // Hover effect for the toggle button
    toggleButton.addEventListener("mouseenter", () => {
      toggleButton.style.backgroundColor = "#4f545c";
    });
    toggleButton.addEventListener("mouseleave", () => {
      toggleButton.style.backgroundColor = "transparent";
    });

    // Create the Search Bar container
    const searchBar = document.createElement("div");
    searchBar.style.position = "absolute";
    searchBar.style.top = "40px"; // Position below the toggle button
    searchBar.style.left = "0";
    searchBar.style.zIndex = 10000;
    searchBar.style.backgroundColor = "#36393f";
    searchBar.style.padding = "10px";
    searchBar.style.borderRadius = "5px";
    searchBar.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    searchBar.style.display = "none"; // Hidden by default
    searchBar.style.width = "0";
    searchBar.style.overflow = "hidden";
    searchBar.style.transition = "width 0.3s ease, opacity 0.3s ease";
    searchBar.style.opacity = "0";
    searchBar.style.whiteSpace = "nowrap"; // Prevent wrapping of elements
    searchBar.style.display = "flex"; // Use flexbox for inline layout
    searchBar.style.alignItems = "center"; // Align items vertically in the center
    searchBar.style.gap = "5px"; // Add spacing between elements

    // Create the search engine dropdown
    const dropdown = document.createElement("select");
    dropdown.style.padding = "5px";
    dropdown.style.borderRadius = "3px";
    dropdown.style.border = "none";
    dropdown.style.backgroundColor = "#2f3136";
    dropdown.style.color = "#fff";
    dropdown.style.opacity = "0"; // Start hidden
    dropdown.style.transition = "opacity 0.3s ease";

    // Add search engine options
    const engines = [
      { name: "Google", url: "https://www.google.com/search?q=" },
      { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
      { name: "Bing", url: "https://www.bing.com/search?q=" },
    ];

    engines.forEach((engine) => {
      const option = document.createElement("option");
      option.value = engine.url;
      option.text = engine.name;
      dropdown.appendChild(option);
    });

    // Handle dropdown change
    dropdown.addEventListener("change", () => {
      this.selectedEngine = dropdown.options[dropdown.selectedIndex].text;
    });

    // Create the search input
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Search...";
    input.style.width = "150px"; // Adjust width to fit inline
    input.style.padding = "5px";
    input.style.borderRadius = "3px";
    input.style.border = "none";
    input.style.backgroundColor = "#2f3136";
    input.style.color = "#fff";
    input.style.opacity = "0"; // Start hidden
    input.style.transition = "opacity 0.3s ease";

    // Create the "Go" button
    const goButton = document.createElement("button");
    goButton.innerText = "Go";
    goButton.style.padding = "5px 10px";
    goButton.style.borderRadius = "3px";
    goButton.style.border = "none";
    goButton.style.backgroundColor = "#7289da";
    goButton.style.color = "#fff";
    goButton.style.cursor = "pointer";
    goButton.style.opacity = "0"; // Start hidden
    goButton.style.transition = "opacity 0.3s ease";

    // Handle the "Go" button click and Enter key press
    const performSearch = () => {
      const query = input.value.trim();
      if (query) {
        const searchUrl = `${dropdown.value}${encodeURIComponent(query)}`;
        // Open the search URL in the default browser
        const { shell } = require("electron");
        shell.openExternal(searchUrl);

        // Clear the search bar after performing the search
        input.value = "";
      }
    };

    goButton.addEventListener("click", performSearch);

    // Handle the Enter key press in the input field
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        performSearch();
      }
    });

    // Handle the toggle button click
    toggleButton.addEventListener("click", (event) => {
      // Prevent the click event from bubbling up to the document
      event.stopPropagation();
      this.toggleSearchBar(searchBar, dropdown, input, goButton);
    });

    // Prevent clicks inside the Search Bar from closing it
    searchBar.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    // Append elements to the Search Bar
    searchBar.appendChild(dropdown);
    searchBar.appendChild(input);
    searchBar.appendChild(goButton);

    // Append the Search Bar to the toggle button
    toggleButton.appendChild(searchBar);

    // Find the first button in the group (e.g., the "Threads" or call buttons)
    const firstButton = titleBar.querySelector('[aria-label="Threads"], [aria-label="Call"], [aria-label="Start Voice Call"], [aria-label="Start Video Call"]')?.parentElement;
    if (firstButton) {
      // Insert the toggle button before the first button in the group
      titleBar.insertBefore(toggleButton, firstButton);
    } else {
      // Fallback: Append to the title bar if the first button isn't found
      titleBar.appendChild(toggleButton);
    }

    // Close the Search Bar when clicking outside of it
    document.addEventListener("click", () => {
      if (this.isVisible) {
        this.toggleSearchBar(searchBar, dropdown, input, goButton);
      }
    });
  }

  toggleSearchBar(searchBar, dropdown, input, goButton) {
    this.isVisible = !this.isVisible;
    if (this.isVisible) {
      searchBar.style.display = "flex"; // Use flexbox for inline layout
      setTimeout(() => {
        searchBar.style.width = "325px"; // Adjust width to fit all elements
        searchBar.style.opacity = "1";
        dropdown.style.opacity = "1";
        input.style.opacity = "1";
        goButton.style.opacity = "1";
        input.focus(); // Focus the input field when the bar expands
      }, 10);
    } else {
      searchBar.style.width = "0";
      searchBar.style.opacity = "0";
      dropdown.style.opacity = "0";
      input.style.opacity = "0";
      goButton.style.opacity = "0";
      setTimeout(() => {
        searchBar.style.display = "none";
      }, 300); // Wait for the transition to complete
    }
  }

  removeSearchBar() {
    if (this.observer) {
      this.observer.disconnect(); // Stop observing the DOM
    }

    const toggleButton = document.querySelector(".search-bar-toggle");
    const searchBar = document.querySelector("div[style*='position: absolute; top: 40px; left: 0;']");

    if (toggleButton) toggleButton.remove();
    if (searchBar) searchBar.remove();

    this.initialized = false;
  }
};
