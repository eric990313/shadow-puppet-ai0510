export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { prompt } = req.body;

const response = await fetch(
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt
        })
      }
    );

    if (!response.ok) {

      const errorText =
      await response.text();

      return res.status(500).json({
        error: errorText
      });
    }

    const imageBuffer =
    Buffer.from(
      await response.arrayBuffer()
    );

    const base64 =
    imageBuffer.toString("base64");

    return res.status(200).json({
      image:
      `data:image/png;base64,${base64}`
    });

  } catch (error) {

    return res.status(500).json({
      error: error.message
    });
  }
}
