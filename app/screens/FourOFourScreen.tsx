import React from 'react'
import FindReplaceIcon from '@mui/icons-material/FindReplace'
import { Link, useHistory } from "@remix-run/react"

import HeaderTitle from '../components/HeaderTitle'
import FourOrFour from '../components/FourOrFour'
import SEO from '../components/SEO'

export default function FourOrFourScreen() {
  const history = useHistory()

  const goBack = () => history.goBack()

  return (
    <>
      <HeaderTitle icon={<FindReplaceIcon />} text="OOPS! Are You Lost?" />
      <SEO title={`OOPS! NOT FOUND`} />

      <h3>Go to the <Link prefetch="intent" style={{ color: 'white' }} to={Routes.pages.home}>home page</Link>{' '}
        or <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={goBack}>go back</span>.</h3>
      <FourOrFour />
    </>
  )
}