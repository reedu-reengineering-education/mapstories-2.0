export interface media_type {
    type: String,
    name: String,
    match_str: RegExp,
    url: String,
    html: HTMLElement
}
// better like this: https://stackoverflow.com/questions/33913737/inserting-the-iframe-into-react-component

export var media_types: media_type[] = [
    {
        type: 'youtube',
        name: 'YouTube',
        match_str: /(www.)?youtube|youtu\.be/,
        url: '',
        html: document.createElement('YouTubeEmbed')
        // html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')

    },
    // {
    //     type: 'vimeo',
    //     name: 'Vimeo',
    //     match_str: /(player.)?vimeo\.com/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'dailymotion',
    //     name: 'DailyMotion',
    //     match_str: /(www.)?dailymotion\.com/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'vine',
    //     name: 'Vine',
    //     match_str: /(www.)?vine\.co/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'soundcloud',
    //     name: 'SoundCloud',
    //     match_str: /(player.)?soundcloud\.com/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'twitter',
    //     name: 'Twitter',
    //     match_str: /(www.)?twitter\.com/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'googlemaps',
    //     name: 'Google Map',
    //     match_str: /maps.google/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'googleplus',
    //     name: 'Google+',
    //     match_str: /plus.google/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'flickr',
    //     name: 'Flickr',
    //     match_str: /flickr.com\/photos/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'instagram',
    //     name: 'Instagram',
    //     match_str: /(instagr.am|instagram.com)\/p\//,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'profile',
    //     name: 'Profile',
    //     match_str: /((instagr.am|instagram.com)(\/profiles\/|[-a-zA-Z0-9@:%_\+.~#?&//=]+instagramprofile))|[-a-zA-Z0-9@:%_\+.~#?&//=]+\?profile/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'image',
    //     name: 'Image',
    //     match_str: /jpg|jpeg|png|gif/i,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'mp3',
    //     name: 'MP3',
    //     match_str: /mp3|MP3/i,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'googledocs',
    //     name: 'Google Doc',
    //     match_str: /\b.(doc|docx|xls|xlsx|ppt|pptx|pdf|pages|ai|psd|tiff|dxf|svg|eps|ps|ttf|xps|zip|tif)\b/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'wikipedia',
    //     name: 'Wikipedia',
    //     match_str: /(www.)?wikipedia\.org/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'iframe',
    //     name: 'iFrame',
    //     match_str: /iframe/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'storify',
    //     name: 'Storify',
    //     match_str: /storify/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'padlet',
    //     name: 'Padlet',
    //     match_str: /padlet.com/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'blockquote',
    //     name: 'Quote',
    //     match_str: /blockquote/,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // },
    // {
    //     type: 'website',
    //     name: 'Website',
    //     match_str: /http:\/\//,
    //     url: '',
    //     html: document.createElement('<iframe width="560" height="315" src="https://www.youtube.com/embed/BLAH?showinfo=0" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>')
    // }
];