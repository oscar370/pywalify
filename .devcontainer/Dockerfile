FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

RUN apt-get update && apt-get install -y \
  python3 \
  python3-pip \
  python3-venv \
  python3-dev \
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
  && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python