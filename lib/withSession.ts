import {withIronSession} from "next-iron-session";
import {sessionConfig} from './sessionConfig'

export default function withSession(handler) {
    return withIronSession(handler,sessionConfig)
}