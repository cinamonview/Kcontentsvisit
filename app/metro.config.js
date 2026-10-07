// Learn more https://docs.expo.dev/guides/customizing-metro
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Phase-1 seed data lives in ../data so the server can reuse it later.
config.watchFolders = [path.resolve(__dirname, '../data')];

module.exports = config;
