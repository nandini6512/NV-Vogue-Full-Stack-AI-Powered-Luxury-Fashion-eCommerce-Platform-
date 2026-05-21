import Product from '../models/Product.js';
import https from 'https';

// Sophisticated local NLP parser as standard backup
const parseLocalRecommendation = async (message) => {
  const msg = message.toLowerCase();
  let query = {};
  let categoryMatch = null;
  let customResponse = "";

  // 1. Parse Category Tags
  if (msg.includes('shoe') || msg.includes('sneaker') || msg.includes('heel') || msg.includes('boot')) {
    categoryMatch = 'Shoes';
  } else if (msg.includes('jean') || msg.includes('denim') || msg.includes('pant')) {
    categoryMatch = 'Jeans';
  } else if (msg.includes('top') || msg.includes('blouse') || msg.includes('shirt') || msg.includes('tee') || msg.includes('t-shirt')) {
    categoryMatch = 'Tops';
  } else if (msg.includes('dress') || msg.includes('gown') || msg.includes('skirt') || msg.includes('women')) {
    categoryMatch = 'Women';
  } else if (msg.includes('jacket') || msg.includes('coat') || msg.includes('men') || msg.includes('suit')) {
    categoryMatch = 'Men';
  } else if (msg.includes('kid') || msg.includes('child') || msg.includes('baby') || msg.includes('boy') || msg.includes('girl')) {
    categoryMatch = 'Kids';
  } else if (msg.includes('perfume') || msg.includes('serum') || msg.includes('makeup') || msg.includes('beauty') || msg.includes('skincare')) {
    categoryMatch = 'Beauty';
  } else if (msg.includes('bag') || msg.includes('glass') || msg.includes('watch') || msg.includes('accessory') || msg.includes('belt') || msg.includes('hat')) {
    categoryMatch = 'Accessories';
  }

  if (categoryMatch) {
    query.category = categoryMatch;
  }

  // 2. Parse Color Tags
  const colors = ['black', 'white', 'blue', 'red', 'crimson', 'pink', 'gold', 'beige', 'grey', 'yellow', 'green', 'brown'];
  const matchedColor = colors.find(c => msg.includes(c));
  if (matchedColor) {
    query.colors = { $regex: new RegExp(matchedColor, 'i') };
  }

  // 3. Parse Occasion Tags & Build Tailored Fashion Responses
  if (msg.includes('wedding') || msg.includes('formal') || msg.includes('party') || msg.includes('cocktail')) {
    customResponse = "For formal occasions and elegant parties, styling classic rich-toned fabrics or golden accents offers a striking impact. Here are premium choices from our catalog that fit this aesthetic perfectly: ";
  } else if (msg.includes('casual') || msg.includes('daily') || msg.includes('summer') || msg.includes('spring')) {
    customResponse = "Embracing relaxed silhouettes, breathable cotton fibers, and lively tones makes for a refreshing daily summer wardrobe. Have a look at these trending selections from NV Vogue: ";
  } else if (msg.includes('trend') || msg.includes('popular') || msg.includes('best')) {
    customResponse = "Our customers are absolutely loving these high-rated, top-selling trends right now! Check out these pieces: ";
    query.trending = true;
  } else {
    customResponse = "Welcome to NV Vogue! I'm NV Stylist, your AI fashion consultant. I've curated a premium selection of wardrobe ideas based on your styling interest: ";
  }

  // Query database for matched parameters
  let products = [];
  if (Object.keys(query).length > 0) {
    products = await Product.find(query).limit(4);
  }

  // If no specific criteria matched, offer highly trending options
  if (products.length === 0) {
    products = await Product.find({ trending: true }).limit(4);
    if (products.length === 0) {
      products = await Product.find({}).limit(4);
    }
  }

  const productTitles = products.map(p => p.name).join(', ');
  const fullText = `${customResponse} I recommend checking out **${productTitles}**. They are crafted from premium fabrics, feature exquisite details, and are in high demand right now! Let me know if you would like me to add any of these to your shopping cart.`;

  return {
    reply: fullText,
    products: products
  };
};

// Generative API Call via standard Node https request (no external package dependency for simple portability)
const callGeminiAPI = (apiKey, prompt, dbProductsContext) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      contents: [{
        parts: [{
          text: `You are "NV Stylist", an ultra-premium, witty, and highly knowledgeable AI Fashion Consultant for the boutique fashion brand "NV Vogue". 
          Your style advice is elegant, modern, and inspiring. Keep your answers brief, engaging, and professional (under 3 paragraphs).
          
          Here is the active product database context of products we currently sell:
          ${JSON.stringify(dbProductsContext)}
          
          User is asking: "${prompt}"
          
          Provide a sophisticated styling recommendation. Suggest specific real products from the context above that directly match or complement their query. Always mention the product names exactly as listed in the database. Finish with a warm invitation to check them out in the interactive product cards.`
        }]
      }]
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (d) => { body += d; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content && parsed.candidates[0].content.parts[0]) {
            resolve(parsed.candidates[0].content.parts[0].text);
          } else {
            reject(new Error("Invalid API response format"));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => { reject(e); });
    req.write(data);
    req.end();
  });
};

// @desc    Analyze styling text input & return smart dress recommendations
// @route   POST /api/ai/chat
// @access  Public
export const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Please provide a chat message prompt" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const localResult = await parseLocalRecommendation(message);

    if (apiKey && apiKey.trim() !== "") {
      try {
        // Fetch matching products context from database to feed into Gemini prompt
        const searchContext = await Product.find({}).limit(15);
        const geminiReply = await callGeminiAPI(apiKey, message, searchContext);

        return res.json({
          reply: geminiReply,
          products: localResult.products // Send down the query-matched products for interactive frontend card rendering
        });
      } catch (apiError) {
        console.warn(`[Gemini API Warning] fallback to high-fidelity NLP backup: ${apiError.message}`);
        return res.json(localResult);
      }
    }

    // Default to the highly accurate local pattern-matching intelligence
    return res.json(localResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
