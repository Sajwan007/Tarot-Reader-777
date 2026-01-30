export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle registration logic
    res.status(200).json({ message: 'Register endpoint' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
