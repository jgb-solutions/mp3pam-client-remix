import React from 'react'

import GoogleAdsense from './GoogleAdsense'
import { GOOGLE_ADS_CLIENT } from '../utils/constants.server'

export default () => {
  return !!window.ENV.REACT_APP_SHOW_ADS ? (
    <GoogleAdsense
      client={GOOGLE_ADS_CLIENT}
      slot="8031420496"
    />
  ) : null
}