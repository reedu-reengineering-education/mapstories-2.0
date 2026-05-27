interface LamaPollEmbedProps {
  url: string
  width: string | number
  height: string | number
}

function buildLamaPollEmbedUrl(url: string): string {
  // Remove trailing slash if present
  const cleanUrl = url.replace(/\/+$/, '')
  
  // Check if URL already has query parameters
  const hasQueryParams = cleanUrl.includes('?')
  
  // Build the embed URL with required params
  if (hasQueryParams) {
    // URL already has query params - check if our params are already there
    if (cleanUrl.includes('ref=iframe') && cleanUrl.includes('mode=fixed')) {
      return cleanUrl
    }
    // Append our params with &
    return `${cleanUrl}&ref=iframe&mode=fixed`
  }
  
  // No query params - add them with ?
  return `${cleanUrl}/?ref=iframe&mode=fixed`
}

export default function LamaPollEmbed({
  url,
  width,
  height,
  ...divProps
}: LamaPollEmbedProps) {
  const embedUrl = buildLamaPollEmbedUrl(url)
  
  return (
    <iframe
      allow="clipboard-write; encrypted-media"
      frameBorder="0"
      height="100%"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      scrolling="yes"
      src={embedUrl}
      style={{ border: 'none' }}
      width="100%"
    ></iframe>
  )
}
