export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle Stripe payment logic
    res.status(200).json({ message: 'Stripe payment endpoint' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
