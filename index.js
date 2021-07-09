const SlackREST = require('@sagi.io/workers-slack')
const SlackAPI = new SlackREST({ botAccessToken: SLACK_BOT_TOKEN })

addEventListener('fetch', event => {
  event.respondWith(sendMessage(event.request))
})

async function sendMessage(request) {
  const body = await request.formData()
  const { name, email, subject, message } = Object.fromEntries(body)

  if (subject) {
    return Response.redirect(REDIRECT_SUCCESS, 301)
  }

  const result = await SlackAPI.chat.postMessage({
    channel: SLACK_CHANNEL,
    text: `*New Website Contact Message:*\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
  })

  if (result.ok) {
    return Response.redirect(REDIRECT_SUCCESS, 301)
  }

  return new Response(JSON.stringify({ success: result.ok }), {
    headers: { 'content-type': 'application/json' },
  })
}
