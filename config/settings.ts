// TO EDIT THE ICONS INSIDE THE CARD JUST REPLACE THE IMAGES INSIDE 'public' FOLDER (keep the file names as they are)

export const default_settings = {
    streamer_id: '536413842',
    owner_name: 'John Doe',
    default_theme: 'smythOs',
    github_link: 'https://github.com/xhyabunny/party-card',
    error_message: `PLEASE FILL AN ISSUE TO https://github.com/xhyabunny/party-card WITH THE FOLLOWING ERROR MESSAGE: `
}

export const settings = {
    event_name: process.env.NEXT_PUBLIC_EVENT_NAME || 'No event name set on env',
    twitch_client_id: process.env.NEXT_PUBLIC_CLIENT_ID === 'twitch_api_client_id' 
    || process.env.NEXT_PUBLIC_CLIENT_ID === null 
    || process.env.NEXT_PUBLIC_CLIENT_ID === ''
    || !process.env.NEXT_PUBLIC_CLIENT_ID ? 'NO_CLIENT_SET_ON_ENV' : process.env.NEXT_PUBLIC_CLIENT_ID,
    default_theme: process.env.NEXT_PUBLIC_DEFAULT_THEME || default_settings.default_theme,
    streamer_id: process.env.NEXT_PUBLIC_STREAMER_ID || default_settings.streamer_id,
    redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
    colorPalettes: {
        greenViolet: { colors: ['#00FF00', '#8B00FF', '#32CD32', '#9400D3'], isPremium: false },
        bluePink: { colors: ['#00FFFF', '#FF1493', '#1E90FF', '#FF69B4'], isPremium: false },
        redOrange: { colors: ['#FF0000', '#FFA500', '#FF4500', '#FFD700'], isPremium: false },
        cyanMagenta: { colors: ['#00FFFF', '#FF00FF', '#40E0D0', '#FF1493'], isPremium: false },
        purpleBlue: { colors: ['#6A5ACD', '#8A2BE2', '#483D8B', '#7B68EE'], isPremium: false },
        tealOrange: { colors: ['#008080', '#FFA07A', '#20B2AA', '#FF6347'], isPremium: false },
        gold: { colors: ['#FFD700', '#FFEA00', '#FFC700', '#FFA500'], isPremium: true },
        coralPeach: { colors: ['#FF7F50', '#FFDAB9', '#FF6347', '#FFE4E1'], isPremium: true },
        mintChocolate: { colors: ['#F5FFFA', '#D2691E', '#98FF98', '#8B4513'], isPremium: true },
        navyGold: { colors: ['#000080', '#FFD700', '#1E90FF', '#FFFACD'], isPremium: true },
        magentaLime: { colors: ['#FF00FF', '#32CD32', '#FF1493', '#00FA9A'], isPremium: true },
        deepSea: { colors: ['#20B2AA', '#4682B4', '#5F9EA0', '#2E8B57'], isPremium: true },
        sunset: { colors: ['#FF4500', '#FF6347', '#FF8C00', '#FFD700'], isPremium: true },
        pastelRainbow: { colors: ['#FFB6C1', '#FFD700', '#98FB98', '#ADD8E6', '#FF69B4'], isPremium: true },
        smythOs: { colors: ['#45c9a9', '#13947d', '#45c9a9', '#45c9a9'], isPremium: false }
    }
}