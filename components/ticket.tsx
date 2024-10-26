'use client'

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Crown, Download } from 'lucide-react';
import { Tilt } from 'react-tilt';
import html2canvas from 'html2canvas';

import { settings, default_settings } from '@/config/settings'

//@ts-ignore
import { writeMetadata, RESOLUTION_UNITS } from 'png-metadata-writer';

const generateUniqueId = () => {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
}

type PaletteType = keyof typeof settings.colorPalettes;

export default function TicketGenerator() {
    const [ownerName, setOwnerName] = useState<string>(process.env.NEXT_PUBLIC_DEFAULT_OWNER_NAME || default_settings.owner_name);
    const [uniqueId, setUniqueId] = useState<string>('');
    const [selectedPalette, setSelectedPalette] = useState<PaletteType>((process.env.NEXT_PUBLIC_DEFAULT_THEME as PaletteType) || default_settings.default_theme);
    const [loggedIn, setLoggedIn] = useState(false);
    const [following, setFollowing] = useState(false);
    const [username, setUsername] = useState<string | undefined>('')
    const [loading, setLoading] = useState(true)
    const [streamer, setStreamer] = useState<string | undefined>('')
    const [isSubscriber, setIsSubscriber] = useState(false);
    const [errorStreamer, setErrorStreamer] = useState(false);

    const eventName = settings.event_name;
    const clientId = settings.twitch_client_id;
    const streamerId = settings.streamer_id;
    const redirectUri = encodeURIComponent(settings.redirect_uri!);

    const scope = 'user:read:follows user:read:subscriptions';
    const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;

    const handleFollow = () => {
        window.location.assign(authUrl)
    }

    const checkFollowingStatus = async (accessToken: any, userLogin: any, streamerLogin: any) => {
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID as string,
        };

        const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${userLogin}`, { headers });
        const userData = await userResponse.json();
        const userId = userData.data[0]?.id;

        const streamerResponse = await fetch(`https://api.twitch.tv/helix/users?login=${streamerLogin}`, { headers });
        const streamerData = await streamerResponse.json();
        const streamerId = streamerData.data[0]?.id;

        if (userId && streamerId) {

            const followResponse = await fetch(`https://api.twitch.tv/helix/channels/followed?broadcaster_id=${streamerId}&user_id=${userId}`, { headers });
            const followData = await followResponse.json();

            if (followData.data.length > 0) {
                setFollowing(true);
                localStorage.setItem('following', 'true');
            } else {
                setFollowing(false);
                localStorage.setItem('following', 'false');
            }

            setStreamer(streamerData.data[0]?.display_name.toLowerCase());
        } else {
            console.error('Error: No se encontraron IDs de usuario o streamer.');
        }
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const params = new URLSearchParams(window.location.hash.slice(1));
                let accessToken = params.get('access_token') || localStorage.getItem('access_token');

                if (accessToken) {
                    localStorage.setItem('access_token', accessToken);

                    const headers: HeadersInit = {
                        'Authorization': `Bearer ${accessToken}`,
                        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID as string,
                    };

                    const userResponse = await fetch(`https://api.twitch.tv/helix/users`, { headers });
                    const userData = await userResponse.json();

                    if (!userData.data || !userData.data[0]?.id) {
                        console.error('[ERROR] No se pudo obtener el ID del usuario.');
                        setLoading(false);
                        return;
                    }

                    const userId = userData.data[0].id;
                    const userLogin = userData.data[0].login;
                    setLoggedIn(true);
                    setUsername(userLogin);
                    localStorage.setItem('username', userLogin);

                    const streamerResponse = await fetch(`https://api.twitch.tv/helix/users?id=${streamerId}`, { headers });
                    const streamerData = await streamerResponse.json();

                    if (streamerData.data && streamerData.data[0]) {
                        const streamerName = streamerData.data[0].display_name;
                        setStreamer(streamerName);
                        localStorage.setItem('streamer_name', streamerName);
                        setErrorStreamer(false)
                    } else {
                        setErrorStreamer(true)
                    }

                    const subscriptionResponse = await fetch(
                        `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=${streamerId}&user_id=${userId}`,
                        { headers }
                    );
                    const subscriptionData = await subscriptionResponse.json();
                    setIsSubscriber(subscriptionData.data.length > 0);

                    await checkFollowingStatus(accessToken, userLogin, streamerData.data[0]?.login);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        setUniqueId(generateUniqueId())
        initialize();
    }, []);

    const downloadTicket = () => {
        const ticketElement = document.getElementById('ticket-card');
        const user = document.getElementById('u')

        if (user) {
            user.style.marginTop = "-0.6em";
        }

        if (!ticketElement) return;

        html2canvas(ticketElement, {
            backgroundColor: null,
            useCORS: true,
        }).then((canvas) => {
            canvas.toBlob((blob) => {
                if (!blob) return;

                const reader = new FileReader();
                reader.onload = () => {
                    const pngBuffer = new Uint8Array(reader.result as ArrayBuffer);

                    const metadata = {
                        tEXt: {
                            ownerName: ownerName || 'Unknown',
                            uniqueId: uniqueId,
                            eventName: eventName || 'Unknown',
                            createdDate: new Date().toISOString(),
                            twitchFollower: username || 'Unknown',
                            streamer: streamer || 'Unknown',
                            isSubscriber: isSubscriber ? 'Yes' : 'No',
                        },
                        pHYs: {
                            x: 3000,
                            y: 3000,
                            units: RESOLUTION_UNITS.UNDEFINED,
                        },
                    };

                    const updatedPngBuffer = writeMetadata(pngBuffer, metadata);

                    const updatedBlob = new Blob([updatedPngBuffer], { type: 'image/png' });

                    const url = URL.createObjectURL(updatedBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ticket_${uniqueId}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                };

                reader.readAsArrayBuffer(blob);

                if (user) {
                    user.style.marginTop = "";
                }
            });
        }).catch((error) => {
            console.error('AN ERROR HAS OCCURED WHILE GENERATING THE CARD, PLEASE FILL AN ISSUE ON https://github.com/xhyabunny/party-card WITH THE FOLLOWING ERROR MESSAGE:\n\n', error);
        });

    };

    const TicketCard = () => {
        const colors = settings.colorPalettes[selectedPalette].colors;
        const gradientStyle = {
            background: `linear-gradient(45deg, ${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`,
        };

        return (
            <div id="ticket-card" className="w-full px-2 h-48 rounded-lg shadow-lg overflow-hidden" style={gradientStyle}>
                <div className="p-4 h-full flex flex-col justify-between text-white">
                    <div className='flex flex-row justify-between'>
                        <div>
                            <img className='w-12 h-12 object-contain rounded-lg' src='/icon.png' alt="Event Icon" />
                            <h2 className="text-2xl font-bold mt-1 font-orbitron">{eventName}</h2>
                            <p className="text-lg font-exo">{ownerName}</p>
                        </div>
                        {isSubscriber && <span className="badge"><img className='w-12 h-12 p-0.5 object-contain' src={'/sub_badge.png'}></img></span>}
                    </div>
                    <div className="flex justify-between items-end">
                        <div className='flex flex-row gap-1'>
                            <svg role="img" className='w-5 h-5 p-0 my-auto' viewBox="0 0 24 24" scale={1.2} strokeWidth={1.3} stroke='white' fill='transparent' xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                            </svg>
                            <span id='u' className="text-sm font-mono p-0 my-auto">
                                <p className='p-0 m-0'>{username ? username : '...'}</p>
                            </span>
                        </div>
                        {loggedIn && (<span className="text-sm">{uniqueId}</span>)}
                    </div>
                </div>
            </div>
        )
    }

    const formatName = (name: string) => name.replace(/([A-Z])/g, ' $1').replace(/^./, (str: string) => str.toUpperCase());

    return (
        <div className='flex flex-col gap-3'>
            <Card className="w-[30em] max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{process.env.NEXT_PUBLIC_EVENT_NAME}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name on Ticket</Label>
                        <Input id="name" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Nombre" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="palette">Theme</Label>
                        <Select onValueChange={(value: any) => setSelectedPalette(value)} defaultValue={selectedPalette}>
                            <SelectTrigger>
                                <SelectValue placeholder="Paleta" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(settings.colorPalettes).map(([key, palette]) => (
                                    palette.isPremium ? (
                                        isSubscriber && (
                                            <SelectItem value={key} key={key}>
                                                <div className='flex flex-row gap-1'>
                                                    <Crown className='w-4 h-4 p-0 m-0' color='gold' scale={0.5} />
                                                    <p>{formatName(key)}</p>
                                                </div>
                                            </SelectItem>
                                        )
                                    ) : (
                                        <SelectItem value={key} key={key}>
                                            {formatName(key)}
                                        </SelectItem>
                                    )
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Tilt options={{ max: 35 }}>
                        <TicketCard />
                    </Tilt>
                </CardContent>
                <CardFooter className='justify-center gap-2'>
                    {
                        !loggedIn && (
                            <Button disabled={loading} className='w-max bg-white text-black border-solid border border-black' onClick={handleFollow}>
                                <svg role="img" viewBox="0 0 24 24" scale={1.2} strokeWidth={1.3} stroke='white' xmlns="http://www.w3.org/2000/svg">
                                    <title>Twitch</title>
                                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                                </svg>
                                Connect your account
                            </Button>
                        )
                    }
                    {
                        loggedIn && !following && (
                            <Button disabled={loading} className='w-max bg-white text-black border-solid border border-black' onClick={() => window.location.assign('https://twitch.tv/yosywozzy')}>
                                <svg role="img" viewBox="0 0 24 24" scale={1.2} strokeWidth={1.3} stroke='white' xmlns="http://www.w3.org/2000/svg">
                                    <title>Twitch</title>
                                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                                </svg>
                                Follow {streamer}
                            </Button>
                        )
                    }
                    <Button disabled={!loggedIn} onClick={downloadTicket} className='w-max'>
                        <Download className="mr-2 h-4 w-4" /> Download Ticket
                    </Button>
                </CardFooter>
            </Card>
            {
                errorStreamer && (
                    <p className='bg-slate-600 text-white p-2 px-4 w-max rounded-md m-auto'>No streamer found.</p>
                )
            }
        </div>
    )
}
