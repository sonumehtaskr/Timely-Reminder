module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons|react-native-tts|react-native-push-notification|@react-native-async-storage|react-native-screens|react-native-gesture-handler|react-native-modal|react-native-sound|@react-native-community)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
