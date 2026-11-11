module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }
  const gasUrl = process.env.KTR_GAS_WEBAPP_URL;
  const secret = process.env.KTR_API_SECRET;
  if (!gasUrl || !secret) return res.status(500).json({ success: false, message: "Konfigurasi API Vercel belum lengkap." });
  try {
    const upstream = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "submit", secret, formData: req.body })
    });
    const data = await upstream.json();
    if (!upstream.ok || !data.success) return res.status(400).json({ success: false, message: data.message || "Pengajuan gagal disimpan." });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ success: false, message: "Server Google Apps Script tidak dapat dihubungi." });
  }
}
