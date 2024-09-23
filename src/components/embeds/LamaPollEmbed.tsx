interface LamaPollEmbedProps {
  url: string
  width: string | number
  height: string | number
}

export default function LamaPollEmbed({
  url,
  width,
  height,
  ...divProps
}: LamaPollEmbedProps) {
  return (
    <iframe
      height="100%"
      scrolling="yes"
      src={`${url}/?ref=iframe&mode=fixed`}
      width="100%"
    ></iframe>
  )
}
