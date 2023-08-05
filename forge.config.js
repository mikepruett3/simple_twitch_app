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
        setupIcon: './images/Twitch.ico'
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
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
