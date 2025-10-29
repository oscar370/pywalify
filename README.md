# Pywalify

A desktop application for generating color palettes from images using pywal, with template export capabilities.

## Overview

Pywalify provides a graphical interface for pywal's color extraction functionality. Upload an image, generate a 16-color palette, and export the colors in various template formats for use in terminal emulators, text editors, and other applications.

## Features

- **Image-based color generation**: Extract color palettes from any image
- **Multiple pywal backends**: Support for all available pywal color extraction backends
- **Customizable generation**: Options for light mode, saturation adjustment, and contrast ratios
- **Template export**: Export palettes to predefined formats or custom templates

## Architecture

Pywalify uses a two-component architecture:

- **Frontend**: Web-based UI built with modern web technologies
- **Backend**: Python FastAPI server providing pywal integration
  - Generates color palettes using pywal's color extraction algorithms
  - Handles template rendering and export
  - Communicates with frontend via REST API

The backend is compiled into a standalone binary using PyInstaller and bundled with the Tauri application.

## Installation

### From Release

Download the appropriate package for your platform from the [Releases](https://github.com/oscar370/pywalify/releases) page:

### From Source

#### Prerequisites

The repository has a dev container. It will be ready with the dependencies for development. Otherwise, the dependencies are:

- Python 3.13+
- Node.js 22+ (LTS)
- Rust and Cargo
- Linux: `libwebkit2gtk-4.1-dev build-essential curl wget file libxdo-dev libssl-dev libayatana-appindicator3-dev librsvg2-dev imagemagick cmake xdg-utils`

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/yourusername/pywalify.git
cd pywalify

# Install Node dependencies
npm install

# Build the backend binary
npm run build:backend

# Build the Tauri application
npm run tauri build
```

The built application will be available in `src-tauri/target/release/bundle/`.

> Python dependencies should be installed after the container is created, otherwise use:
>
> ```bash
> # Install Python dependencies
> pip install -r backend/requirements.txt
> ```

## Development

### Setup Development Environment

```bash
# Install dependencies
npm install

# Build backend
npm run build:backend

# Start the application
npm run tauri dev
```

> Python dependencies should be installed after the container is created, otherwise use:
>
> ```bash
> # Install Python dependencies
> pip install -r backend/requirements.txt
> ```

## Configuration

The application uses pywal's standard configuration options:

- **Backend**: Choose from available pywal backends (wal, colorz, colorthief, etc.)
- **Light mode**: Generate palettes optimized for light backgrounds
- **Saturation**: Adjust color saturation (0.0 - 1.0)
- **16-color generation**: Generate full 16-color terminal palette
- **Contrast**: Apply contrast ratio adjustments

## Template Export

Pywalify supports exporting to various template formats:

- Terminal emulators (xresources, alacritty, kitty, etc.)
- Text editors (vim, emacs, etc.)
- Custom templates using pywal's template syntax

See the [Wiki](https://github.com/oscar370/pywalify/wiki) for template documentation.

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Acknowledgments

- [pywal16](https://github.com/eylles/pywal16) - Color palette generation
- [Tauri](https://tauri.app/) - Cross-platform application framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend API framework

## Support

For issues, questions, or feature requests, please use the [GitHub Issues](https://github.com/oscar370/pywalify/issues) page.
