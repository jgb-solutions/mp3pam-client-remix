import { useEffect } from 'react'

export default function GoogleAdsense({
  client,
  slot,
  format = true,
  responsive = true,
}) {
  useEffect(() => {
    ;(window.adsbygoogle = window.adsbygoogle || []).push({})
  }, [])

  return (
    <ins
      sx="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive}
    ></ins>
  )
}
