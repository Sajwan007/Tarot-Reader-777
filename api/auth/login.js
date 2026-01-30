export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle login logic
    res.status(200).json({ message: 'Login endpoint' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
