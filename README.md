# Pywalify

A desktop application for generating color palettes from images using pywal, with template export capabilities.
<h3 align="center"><img src="https://i.imgur.com/5WgMACe.gif" width="200px"></h3>

## Overview

Pywalify provides a graphical interface for pywal's color extraction functionality. Upload an image, generate a 16-color palette, and export the colors in various template formats for use in terminal emulators, text editors, and other applications.

See the wiki for more information [Wiki](https://github.com/oscar370/pywalify/wiki).

<img alt="Screenshot of the pywalify interface" src="https://github.com/user-attachments/assets/2fcec512-3624-47ff-a826-43e0f87fbb5c" />

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

- Python 3.12+
- Node.js 22+
- Rust and Cargo
- Linux:

  ```bash
  libwebkit2gtk-4.1-0=2.44.0-2 \
  libwebkit2gtk-4.1-dev=2.44.0-2 \
  libjavascriptcoregtk-4.1-0=2.44.0-2 \
  libjavascriptcoregtk-4.1-dev=2.44.0-2 \
  gir1.2-javascriptcoregtk-4.1=2.44.0-2 \
  gir1.2-webkit2-4.1=2.44.0-2 \
  libappindicator3-dev \
  librsvg2-dev \
  patchelf \
  build-essential \
  curl \
  wget \
  file \
  libssl-dev \
  libgtk-3-dev \
  cmake \
  xdg-utils \
  imagemagick \
  ```

#### Build Steps

```bash
# Clone the repository
git clone https://github.com/oscar370/pywalify.git
cd pywalify

# Install Node dependencies
npm install

# Build the backend binary
npm run build:backend

# Build the backend binary and Tauri application
npm run tauri:build
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
# Clone the repository
git clone https://github.com/oscar370/pywalify.git
cd pywalify

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

## Template Export

Pywalify supports exporting to various template formats:

- Terminal emulators (xresources, alacritty, kitty, etc.)
- Text editors (vim, emacs, etc.)
- Custom templates using pywal's template syntax

See the [Wiki](https://github.com/oscar370/pywalify/wiki) for template documentation.

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

## License

This project is licensed under the GPL-3.0 License. See LICENSE file for details.

## Acknowledgments

- [pywal16](https://github.com/eylles/pywal16) - Color palette generation
- [Tauri](https://tauri.app/) - Cross-platform application framework
- [FastAPI](https://fastapi.tiangolo.com/) - Backend API framework

## Support

For issues, questions, or feature requests, please use the [GitHub Issues](https://github.com/oscar370/pywalify/issues) page.
