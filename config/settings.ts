import colorPalettes from './styles.ts'

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
    colorPalettes: colorPalettes
}