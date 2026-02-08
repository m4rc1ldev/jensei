/**
 * Generate a colored sphere avatar SVG based on user's name/email.
 * Returns a data URL for the SVG.
 */
export const generateAvatarSphere = (name = 'User') => {
  // Generate a hash from the name for consistent colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate colors based on hash
  const hue1 = Math.abs(hash % 360);
  const hue2 = (hue1 + 60) % 360;
  const hue3 = (hue1 + 120) % 360;
  
  // Get initials
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Create gradient colors
  const colors = [
    `hsl(${hue1}, 70%, 60%)`,
    `hsl(${hue2}, 70%, 60%)`,
    `hsl(${hue3}, 70%, 60%)`,
  ];
  
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="avatarGradient-${Math.abs(hash)}" cx="30%" cy="30%">
          <stop offset="0%" stop-color="${colors[0]}" />
          <stop offset="50%" stop-color="${colors[1]}" />
          <stop offset="100%" stop-color="${colors[2]}" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="20" fill="url(#avatarGradient-${Math.abs(hash)})" />
      <text x="20" y="20" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
    </svg>
  `.trim();
  
  // Use encodeURIComponent for proper SVG encoding
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
