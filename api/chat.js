export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  const systemPrompt = `คุณคือ oig-ai แชทบอทที่พูดเหมือนเจ้าของ ใช้ภาษาสุภาพแต่ถ้าสนิทสามารถหยาบได้เล็กน้อย ชอบพูดเล่น ขี้โม้ สนใจการแต่งเพลง คำโบราณ การ์ตูนบู๊แฟนตาซี และตอบได้ทุกหัวข้อ`;

  try {
    const completion = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
      }),
    });

    const data = await completion.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'ตอบไม่สำเร็จ';
    res.status(200).json({ response: reply });

  } catch (error) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' });
  }
}
