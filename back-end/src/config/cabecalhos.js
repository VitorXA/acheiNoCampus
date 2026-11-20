export function cabecalhosSeguranca(producao) {
  return {
    'Content-Security-Policy': [
      "default-src 'none'",
      "script-src 'self'",
      "style-src 'self' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      "img-src 'self' blob: https://*.supabase.co",
      "connect-src 'self'" + (producao ? '' : ' http://127.0.0.1:3000'),
      "form-action 'self'",
      "base-uri 'none'",
      "frame-ancestors 'none'"
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    ...(producao ? { 'Strict-Transport-Security': 'max-age=31536000' } : {})
  };
}
