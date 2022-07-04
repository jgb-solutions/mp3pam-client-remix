import { useParams } from "@remix-run/react"


import Logo from "~/components/Logo"
import Download from "~/components/Download"
import GoogleAdsense from "~/components/GoogleAdsense"
import { GOOGLE_ADS_CLIENT } from "../utils/constants.server"

export default function DownloadPage() {
  const { hash, type } = useParams() as { hash: string, type: string }

  return (
    <div style={{ maxWidth: 450, margin: '0 auto', textAlign: 'center' }}>
      <SEO title={`Download ${type}`} />
      <Logo size={300} />

      {!!process.env.REACT_APP_SHOW_ADS && (
        <GoogleAdsense
          client={GOOGLE_ADS_CLIENT}
          slot="1295262381"
        />
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Download type={type} hash={hash} />
      </div>
    </div>
  )
}