# simple_twitch_app

A very quick and very dirty Electron browser for Twitch with BetterTTV support.

## Features

- Automatic Channel Point Drop Collections
- BetterTTV Icons (BTTV)
- Control for Hardware Acceleration

## Installation

Download the latest [release](https://github.com/mikepruett3/simple_twitch_app/releases) for Windows, Linux and MacOS.

For Windows... a standard Executable is provided, as well as a NuGet package. RPM, DEB and AppImage packages are available for Linux Distributions.

## Launching

To run, just launch the executable via the Desktop Shortcut, or the Executable directly.

## Building

To build locally, clone the repository and install the dependencies.

```powershell
git clone https://github.com/mikepruett3/simple_twitch_app.git
cd simple_twitch_app
npm install
```

To run the application locally.

```powershell
npm run test
```

To build the application installer.

```powershell
npm run make
```

## Dependencies

- electron
- electron-forge
- electron-store
- publisher-github

## Errata

Logo borrowed from [Wikipedia](https://commons.wikimedia.org/wiki/File:Twitch_Glitch_Logo_Purple.svg)