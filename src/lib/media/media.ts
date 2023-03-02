export interface media_type {
  type: String
  name: String
  match_str: RegExp
  url: String
}
// better like this: https://stackoverflow.com/questions/33913737/inserting-the-iframe-into-react-component

export var media_types: media_type[] = [
  {
    type: 'youtube',
    name: 'YouTube',
    match_str: /(www.)?youtube|youtu\.be/,
    url: '',
  },
  {
    type: 'tiktok',
    name: 'TikTok',
    match_str: /(www.)?tiktok\.com/,
    url: '',
  },
  // {
  //     type: 'vimeo',
  //     name: 'Vimeo',
  //     match_str: /(player.)?vimeo\.com/,
  //     url: ''
  // },
  // {
  //     type: 'dailymotion',
  //     name: 'DailyMotion',
  //     match_str: /(www.)?dailymotion\.com/,
  //     url: ''
  // },
  // {
  //     type: 'vine',
  //     name: 'Vine',
  //     match_str: /(www.)?vine\.co/,
  //     url: ''
  // },
  // {
  //     type: 'soundcloud',
  //     name: 'SoundCloud',
  //     match_str: /(player.)?soundcloud\.com/,
  //     url: ''
  // },
  {
    type: 'twitter',
    name: 'Twitter',
    match_str: /(www.)?twitter\.com/,
    url: '',
  },
  // {
  //     type: 'googlemaps',
  //     name: 'Google Map',
  //     match_str: /maps.google/,
  //     url: ''
  // },
  // {
  //     type: 'googleplus',
  //     name: 'Google+',
  //     match_str: /plus.google/,
  //     url: ''
  // },
  // {
  //     type: 'flickr',
  //     name: 'Flickr',
  //     match_str: /flickr.com\/photos/,
  //     url: ''
  // },
  {
    type: 'instagram',
    name: 'Instagram',
    match_str: /(instagr.am|instagram.com)\/p\//,
    url: '',
  },
  // {
  //     type: 'profile',
  //     name: 'Profile',
  //     match_str: /((instagr.am|instagram.com)(\/profiles\/|[-a-zA-Z0-9@:%_\+.~#?&//=]+instagramprofile))|[-a-zA-Z0-9@:%_\+.~#?&//=]+\?profile/,
  //     url: ''
  // },
  // {
  //     type: 'image',
  //     name: 'Image',
  //     match_str: /jpg|jpeg|png|gif/i,
  //     url: ''
  // },
  // {
  //     type: 'mp3',
  //     name: 'MP3',
  //     match_str: /mp3|MP3/i,
  //     url: ''
  // },
  // {
  //     type: 'googledocs',
  //     name: 'Google Doc',
  //     match_str: /\b.(doc|docx|xls|xlsx|ppt|pptx|pdf|pages|ai|psd|tiff|dxf|svg|eps|ps|ttf|xps|zip|tif)\b/,
  //     url: ''
  // },
  // {
  //     type: 'wikipedia',
  //     name: 'Wikipedia',
  //     match_str: /(www.)?wikipedia\.org/,
  //     url: ''
  // },
  // {
  //     type: 'iframe',
  //     name: 'iFrame',
  //     match_str: /iframe/,
  //     url: ''
  // },
  // {
  //     type: 'storify',
  //     name: 'Storify',
  //     match_str: /storify/,
  //     url: ''
  // },
  {
    type: 'padlet',
    name: 'Padlet',
    match_str: /padlet.com/,
    url: '',
  },
  // {
  //     type: 'blockquote',
  //     name: 'Quote',
  //     match_str: /blockquote/,
  //     url: ''
  // },
  // {
  //     type: 'website',
  //     name: 'Website',
  //     match_str: /http:\/\//,
  //     url: ''
  // }
]
