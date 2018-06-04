import {getWechat} from '../wechat'

const client = getWechat()

// 获取signature
export async function getSignatureAsync (url) {
    const data = await client.getAccessToken()
    const token = data.access_token
    const ticketData = await client.fetchTicket(token)
    const ticket = ticketData.ticket

    let params = client.sign(ticket, url)
    params.appId = client.appID

    return params
}