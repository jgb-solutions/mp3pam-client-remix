
import { useParams } from "@remix-run/react"
import { get } from "lodash-es"

import Logo from "../components/Logo"
import Download from "../components/Download"
import GoogleAdsense from "../components/GoogleAdsense"
import { GOOGLE_ADS_CLIENT } from "../utils/constants.server"
import SEO from "../components/SEO"


export interface Credentials {
  email: string
  password: string
}


export default function DownloadScreen() {
  const params = useParams()
  const hash = get(params, 'hash')
  const type = get(params, 'type')

  return (
    <div style={{ maxWidth: 450, margin: '0 auto', textAlign: 'center' }}>
      <SEO title={`Download ${type}`} />
      <Logo size={300} />

      {!!window.ENV.REACT_APP_SHOW_ADS && (
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