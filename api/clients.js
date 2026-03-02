import { supabase } from './utils/supabaseClient.js';
import { requireAdmin } from './utils/requireAdmin.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (!requireAdmin(req, res)) return;

  if (!supabase) {
    console.error('Supabase is not configured for clients handler');
    return res.status(500).json({
      success: false,
      error: 'Database not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    });
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        return res.status(500).json({ success: false, error: 'Failed to load clients' });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    }

    if (req.method === 'POST') {
      const payload = {
        ...req.body,
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(payload)
        .select('*')
        .single();

      if (error) {
        console.error('Error creating client:', error);
        return res.status(500).json({ success: false, error: 'Failed to create client' });
      }

      return res.status(201).json({
        success: true,
        data,
      });
    }

    if (req.method === 'PUT') {
      const clientId = req.query.id;
      if (!clientId) {
        return res.status(400).json({ success: false, error: 'Missing client id' });
      }

      const { data, error } = await supabase
        .from('clients')
        .update(req.body)
        .eq('id', clientId)
        .select('*')
        .single();

      if (error) {
        console.error('Error updating client:', error);
        return res.status(500).json({ success: false, error: 'Failed to update client' });
      }

      return res.status(200).json({
        success: true,
        data,
      });
    }

    if (req.method === 'DELETE') {
      const clientId = req.query.id;
      if (!clientId) {
        return res.status(400).json({ success: false, error: 'Missing client id' });
      }

      const { error } = await supabase.from('clients').delete().eq('id', clientId);

      if (error) {
        console.error('Error deleting client:', error);
        return res.status(500).json({ success: false, error: 'Failed to delete client' });
      }

      return res.status(200).json({
        success: true,
        message: 'Client deleted successfully',
      });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error('Unexpected error in clients handler:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
