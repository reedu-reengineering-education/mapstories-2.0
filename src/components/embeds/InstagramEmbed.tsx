import classNames from 'classnames';
import * as React from 'react';
import { DivProps } from 'react-html-props';
import { Subs } from 'react-sub-unsub';
import { Frame, useFrame } from './useFrame';
import { EmbedStyle } from './EmbedStyle';

const embedJsScriptSrc = '//www.instagram.com/embed.js';
const borderRadius = 3;

// Embed Stages
const CHECK_SCRIPT_STAGE = 'check-script';
const LOAD_SCRIPT_STAGE = 'load-script';
const CONFIRM_SCRIPT_LOADED_STAGE = 'confirm-script-loaded';
const PROCESS_EMBED_STAGE = 'process-embed';
const CONFIRM_EMBED_SUCCESS_STAGE = 'confirm-embed-success';
const RETRYING_STAGE = 'retrying';
const EMBED_SUCCESS_STAGE = 'embed-success';

export interface InstagramEmbedProps extends DivProps {
  url: String;
  width?: string | number;
  height?: string | number;
  linkText?: string;
  /** Deprecated -- This has no effect. Captions are always visible due to https://github.com/justinmahar/react-social-media-embed/issues/26 */
  captioned?: boolean;
  scriptLoadDisabled?: boolean;
  retryDelay?: number;
  retryDisabled?: boolean;
  igVersion?: string;
  frame?: Frame;
  debug?: boolean;
}

export function InstagramEmbed ({
  url,
  width,
  height,
  linkText = 'View post on Instagram',
  scriptLoadDisabled = false,
  retryDelay = 5000,
  retryDisabled = false,
  igVersion = '14',
  frame = undefined,
  debug = false,
  ...divProps
}: InstagramEmbedProps) {
  const [stage, setStage] = React.useState(CHECK_SCRIPT_STAGE);
  const uuidRef = React.useRef(generateUUID());
  const [processTime, setProcessTime] = React.useState(Date.now());
  const embedContainerKey = React.useMemo(() => `${uuidRef.current}-${processTime}`, [processTime]);
  const frm = useFrame(frame);

  // Debug Output
  React.useEffect(() => {
    debug && console.log(`[${new Date().toISOString()}]: ${stage}`);
  }, [debug, stage]);

  // === === === === === === === === === === === === === === === === === === ===
  // Embed Stages
  // === === === === === === === === === === === === === === === === === === ===

  // Check Script Stage
  React.useEffect(() => {
    if (stage === CHECK_SCRIPT_STAGE) {
      if ((frm.window as any)?.instgrm?.Embeds?.process) {
        setStage(PROCESS_EMBED_STAGE);
      } else if (!scriptLoadDisabled) {
        setStage(LOAD_SCRIPT_STAGE);
      } else {
        console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
      }
    }
  }, [scriptLoadDisabled, stage, url, frm.window]);

  // Load Script Stage
  React.useEffect(() => {
    if (stage === LOAD_SCRIPT_STAGE) {
      if (frm.document) {
        const scriptElement = frm.document.createElement('script');
        scriptElement.setAttribute('src', embedJsScriptSrc);
        frm.document.head.appendChild(scriptElement);
        setStage(CONFIRM_SCRIPT_LOADED_STAGE);
      }
    }
  }, [stage, frm.document]);

  // Confirm Script Loaded Stage
  React.useEffect(() => {
    const subs = new Subs();
    if (stage === CONFIRM_SCRIPT_LOADED_STAGE) {
      subs.setInterval(() => {
        if ((frm.window as any)?.instgrm?.Embeds?.process) {
          setStage(PROCESS_EMBED_STAGE);
        }
      }, 1);
    }
    return subs.createCleanup();
  }, [stage, frm.window]);

  // Process Embed Stage
  React.useEffect(() => {
    if (stage === PROCESS_EMBED_STAGE) {
      const process = (frm.window as any)?.instgrm?.Embeds?.process;
      if (process) {
        process();
        setStage(CONFIRM_EMBED_SUCCESS_STAGE);
      } else {
        console.error('Instagram embed script not found. Unable to process Instagram embed:', url);
      }
    }
  }, [stage, frm.window, url]);

  // Confirm Embed Success Stage
  React.useEffect(() => {
    const subs = new Subs();
    if (stage === CONFIRM_EMBED_SUCCESS_STAGE) {
      subs.setInterval(() => {
        if (frm.document) {
          const preEmbedElement = frm.document.getElementById(uuidRef.current);
          if (!preEmbedElement) {
            setStage(EMBED_SUCCESS_STAGE);
          }
        }
      }, 1);
      if (!retryDisabled) {
        subs.setTimeout(() => {
          setStage(RETRYING_STAGE);
        }, retryDelay);
      }
    }
    return subs.createCleanup();
  }, [retryDelay, retryDisabled, stage, frm.document]);

  // Retrying Stage
  React.useEffect(() => {
    if (stage === RETRYING_STAGE) {
      // This forces the embed container to remount
      setProcessTime(Date.now());
      setStage(PROCESS_EMBED_STAGE);
    }
  }, [stage]);

  // END Embed Stages
  // === === === === === === === === === === === === === === === === === === ===

  const urlWithNoQuery = url.replace(/[?].*$/, '');
  const cleanUrlWithEndingSlash = `${urlWithNoQuery}${urlWithNoQuery.endsWith('/') ? '' : '/'}`;

  const isPercentageWidth = !!width?.toString().includes('%');

  if (typeof width !== 'undefined') {
    width = +width * 2
  }
  
  return (
    <div
      {...divProps}
      className={classNames('rsme-embed rsme-instagram-embed', uuidRef.current, divProps.className)}
      style={{
        overflow: 'hidden',
        width: width ?? undefined,
        height: height ?? undefined,
        borderRadius,
        ...divProps.style,
      }}
    >
      <EmbedStyle />
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={`${cleanUrlWithEndingSlash}?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version={igVersion}
        data-width={isPercentageWidth ? '100%' : width ?? undefined}
        key={embedContainerKey}
        style={{
          width: 'calc(100% - 2px)'
        }}
      >
        {/* {!ready && placeholder} */}
        <div className="instagram-media-pre-embed rsme-d-none" id={uuidRef.current}>
          &nbsp;
        </div>
      </blockquote>
    </div>
  );
};

function generateUUID() {
    // Public Domain/MIT
    let d = new Date().getTime(); //Timestamp
    let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16; //random number between 0 and 16
      if (d > 0) {
        //Use timestamp until depleted
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        //Use microseconds since page-load if supported
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  };
  
