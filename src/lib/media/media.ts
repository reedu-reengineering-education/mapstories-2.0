import { MediaType } from '@prisma/client'

export interface media_type {
  type: MediaType
  match_str: RegExp
  content: String
}
// better like this: https://stackoverflow.com/questions/33913737/inserting-the-iframe-into-react-component

export var media_types: media_type[] = [
  {
    type: 'YOUTUBE',
    match_str: /(www.)?youtube|youtu\.be/,
    content: '',
  },
  {
    type: 'TIKTOK',
    match_str: /(www.)?tiktok\.com/,
    content: '',
  },
  {
    type: 'FACEBOOK',
    match_str: /(www.)?facebook\.com/,
    content: '',
  },
  // {
  //     type: 'vimeo',
  //     match_str: /(player.)?vimeo\.com/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'dailymotion',
  //     match_str: /(www.)?dailymotion\.com/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'vine',
  //     match_str: /(www.)?vine\.co/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'soundcloud',
  //     match_str: /(player.)?soundcloud\.com/,
  //     content: '',
  //     options: {}
  // },
  {
    type: 'SPOTIFY',
    match_str: /(player.)?spotify\.com/,
    content: '',
  },
  {
    type: 'TWITTER',
    match_str: /(www.)?twitter\.com/,
    content: '',
  },
  // {
  //     type: 'googlemaps',
  //     match_str: /maps.google/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'googleplus',
  //     match_str: /plus.google/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'flickr',
  //     match_str: /flickr.com\/photos/,
  //     content: '',
  //     options: {}
  // },
  {
    type: 'INSTAGRAM',
    match_str: /(instagr.am|instagram.com)\/p\//,
    content: '',
  },
  // {
  //     type: 'profile',
  //     match_str: /((instagr.am|instagram.com)(\/profiles\/|[-a-zA-Z0-9@:%_\+.~#?&//=]+instagramprofile))|[-a-zA-Z0-9@:%_\+.~#?&//=]+\?profile/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'image',
  //     match_str: /jpg|jpeg|png|gif/i,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'mp3',
  //     match_str: /mp3|MP3/i,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'googledocs',
  //     match_str: /\b.(doc|docx|xls|xlsx|ppt|pptx|pdf|pages|ai|psd|tiff|dxf|svg|eps|ps|ttf|xps|zip|tif)\b/,
  //     content: '',
  //     options: {}
  // },
  {
    type: 'WIKIPEDIA',
    match_str: /(www.)?wikipedia\.org/,
    content: '',
  },
  // {
  //     type: 'iframe',
  //     match_str: /iframe/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'storify',
  //     match_str: /storify/,
  //     content: '',
  //     options: {}
  // },
  {
    type: 'PADLET',
    match_str: /padlet.com/,
    content: '',
  },
  // {
  //     type: 'blockquote',
  //     match_str: /blockquote/,
  //     content: '',
  //     options: {}
  // },
  // {
  //     type: 'website',
  //     match_str: /http:\/\//,
  //     content: '',
  //     options: {}
  // }
]
