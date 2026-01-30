export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle contact form submission
    res.status(200).json({ message: 'Contact form endpoint' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
