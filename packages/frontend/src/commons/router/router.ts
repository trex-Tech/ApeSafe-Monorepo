// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client"

export type Path = `/` | `/create-token/:create` | `/dashboard` | `/login` | `/select-chain` | `/tokens/:ticker`

export type Params = {
	"/create-token/:create": { create: string }
	"/tokens/:ticker": { ticker: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
