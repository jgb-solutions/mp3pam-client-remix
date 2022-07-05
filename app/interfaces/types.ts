import type { BoxProps, GridProps } from "@mui/material"

import type { LogUserInQuery } from "~/graphql/generated-types"

export type BoxStyles = { [key: string]: BoxProps['sx'] }

export type GridStyles = { [key: string]: GridProps['sx'] }

export type LoggedInUserData = LogUserInQuery['login']

export type UserData = LogUserInQuery['login']['data']