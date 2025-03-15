# TWITCH PARTY CARD GENERATOR!
This page will allow you to make special card invites for things like events on streams!
Counting with VIP access (Twitch Sub) as you link your twitch account with the page.

## Installation
- Git clone this repo
- Execute `npm install`
- Rename `.env.example` file to `.env` and adjust it following the next steps.

## Environment
### STREAMER ID
```
NEXT_PUBLIC_STREAMER_ID=twitch_streamer_id
```
The Id of the streamer that is hosting the party or event.

You can use [this page](https://www.streamweasels.com/tools/convert-twitch-username-to-user-id/) to find the id of an user or streamer.
### REDIRECT URI
```
NEXT_PUBLIC_REDIRECT_URI="http://localhost:3000"
```
The redirect Uri that twitch api is going to use when executing the OAuth2 link.

⚠ Make sure the Redirect Uri matches the link you put in your Twitch Developer console App.
![image](https://github.com/user-attachments/assets/20c2bfc6-8b39-4749-bdc9-c2c8411ef820)

### EVENT NAME
```
NEXT_PUBLIC_EVENT_NAME="Event name"
```
Simply the name of the event

### DEFAULT OWNER NAME
```
NEXT_PUBLIC_DEFAULT_OWNER_NAME="John Doe"
```
The default name that appears in the `Name on ticket` label.
![image](https://github.com/user-attachments/assets/e9636724-6722-46e8-89c2-b962f48bf424)

### DEFAULT THEME
```
NEXT_PUBLIC_DEFAULT_THEME="smythOs"
```
The default theme the card will appear with when opening the page.
Default is "smythOS"

### TWITCH API CLIENT ID
```
NEXT_PUBLIC_CLIENT_ID=your_twitch_api_client_id
```
The Twitch API Client ID on your Twitch developer console App.

## Logos & Badges
There are two types of images as of rn.
- The Main Logo ([icon.png](https://github.com/user-attachments/assets/df991703-08f9-4a40-968f-821c4156cbd9)) <img src="https://github.com/user-attachments/assets/df991703-08f9-4a40-968f-821c4156cbd9" alt="icon" style="width: 37px; height: auto;">

- The Sub badge ([sub_badge.png](https://github.com/user-attachments/assets/50227021-b10b-4f7c-8565-6a20c54e6d8f)) <img src="https://github.com/user-attachments/assets/50227021-b10b-4f7c-8565-6a20c54e6d8f" alt="sub badge" style="width: 60px; height: auto;">

The sub badge will appear only if the user is suscribed to the streamer you specified in your `.env` file.

To change the card's images simply replace the images with the new ones and make sure the name of the files match the current ones.

## Theming
There are way lots of themes you can use for the cards, some of them are set up so you can only use them if you're subscribed to the streamer.
Simply change the themes by going to `config/settings.ts` and changing the `colorPalettes` section.

![image](https://github.com/user-attachments/assets/6fe12137-2df0-45ca-96a3-539a09a01d57)
As you see, every color palette has 2 values inside each one.
- **colors:** Array of colors that go from left to right that are displayed smoothly as a background in the card.
- **isPremium:** A boolean that states if said style is only for subs or free for all.

The color palette name formats automatically in the client side using regex, so lets say you want the style to be named "Orange Yellow", so then name the new style inside the Object's key "orangeYellow".

#### Example:
```js
orangeYellow: { colors: [], isPremium: boolean }
```

## Finishing
That's pretty much everything you have to know, enjoy your building!

You're free to contribute to this project with newer & cooler features!

Report your bugs filling an issue in this repo!

- **xhyabunny 2025**
