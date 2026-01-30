export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle booking creation logic
    res.status(200).json({ message: 'Create booking endpoint' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
