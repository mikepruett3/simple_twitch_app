module.exports = {
  packagerConfig: {
    asar: true,
    extraResource: [
      "./extensions/"
    ],
    executableName: 'simple_twitch_app',
    icon: __dirname + '/images/Twitch'
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        iconUrl: 'https://raw.githubusercontent.com/mikepruett3/simple_twitch_app/main/images/Twitch.ico',
        setupIcon: __dirname + './images/Twitch.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
      config: {
        icon: "./images/Twitch.png"
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        icon: "./images/Twitch.png"
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        icon: "./images/Twitch.png"
      },
    },
    {
      name: 'electron-forge-maker-appimage',
      platforms: ['linux'],
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'mikepruett3',
          name: 'simple_twitch_app'
        }
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
  ],
};
