module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: false,
        whitelist: ['SUPABASE_URL','SUPABASE_ANON_KEY','OPENAI_API_KEY'],
      }],
      'react-native-reanimated/plugin',
    ],
  };
};

