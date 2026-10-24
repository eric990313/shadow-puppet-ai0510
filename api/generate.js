export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    const { prompt } = req.body;

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Authorization":
          `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type":
          "application/json"
        },
        body: JSON.stringify({
          model: "gpt-image-2",
          prompt: prompt,
          size: "1024x1024"
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json(data);
    }

    if (
      data.data &&
      data.data[0] &&
      data.data[0].b64_json
    ) {

      return res.status(200).json({

        image:
        "data:image/png;base64," +
        data.data[0].b64_json

      });

    }

    return res.status(200).json(data);

  }

  catch(error){

    return res.status(500).json({
      error: error.message
    });

  }

}
