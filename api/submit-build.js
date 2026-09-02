export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { submitter, youtubeLink, plannerLink } = req.body;

  // Ensure both fields contain something
  if (!youtubeLink || !plannerLink) {
    return res.status(400).json({ error: 'Both links are required.' });
  }

  // Basic sanity check to ensure inputs are web links
  const isWebUrl = (url) => url.startsWith('http://') || url.startsWith('https://');
  if (!isWebUrl(youtubeLink) || !isWebUrl(plannerLink)) {
    return res.status(400).json({ error: 'Please submit valid web URLs starting with http:// or https://' });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).json({ error: 'Server misconfiguration: Webhook URL missing.' });
  }

  // Discord Embed Payload
  const payload = {
    username: 'Build Submission Bot',
    embeds: [
      {
        title: '📥 New Build Submission',
        color: 2302755, // Matches your dark theme
        fields: [
          {
            name: 'Submitter',
            value: submitter ? submitter.trim() : 'Anonymous',
            inline: true,
          },
          {
            name: 'Video / Showcase Link',
            value: youtubeLink.trim(),
            inline: false,
          },
          {
            name: 'Build Planner Link',
            value: plannerLink.trim(),
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const discordRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (discordRes.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Failed to post to Discord.' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Server error while sending submission.' });
  }
}