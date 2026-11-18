// Vector cover illustration for The Off-Ramp: a road that curves down and levels off
// into a calm valley at sunrise. viewBox 1600x1400; scale with preserveAspectRatio.

const tree = (x, y, s, c) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-6" width="8" height="40" rx="3" fill="${c}"/><ellipse cx="0" cy="-34" rx="26" ry="38" fill="${c}"/></g>`;

export function coverArt({ preserve = 'xMidYMax slice', id = 'a' } = {}) {
  return `<svg viewBox="0 0 1600 1400" preserveAspectRatio="${preserve}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f5efe6"/>
      <stop offset="0.55" stop-color="#f6e2d2"/>
      <stop offset="1" stop-color="#f1c9b2"/>
    </linearGradient>
    <radialGradient id="glow-${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#f4b393" stop-opacity=".75"/>
      <stop offset="1" stop-color="#f4b393" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="road-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#efe3d1"/>
      <stop offset="1" stop-color="#f8f1e7"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1400" fill="url(#sky-${id})"/>
  <circle cx="1130" cy="770" r="420" fill="url(#glow-${id})"/>
  <circle cx="1130" cy="790" r="165" fill="#e98c68"/>
  <path d="M960 330 l18 12 l18 -12 M1030 290 l14 9 l14 -9 M905 395 l12 8 l12 -8" fill="none" stroke="#1f4e5a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".55"/>
  <path d="M0 800 C 230 700, 470 770, 720 742 C 960 715, 1180 800, 1600 728 L1600 1400 L0 1400Z" fill="#bcd2d0"/>
  <path d="M0 930 C 300 836, 600 958, 900 900 C 1150 852, 1360 930, 1600 878 L1600 1400 L0 1400Z" fill="#86acaf"/>
  <path d="M0 1064 C 350 986, 700 1084, 1000 1034 C 1250 994, 1450 1052, 1600 1022 L1600 1400 L0 1400Z" fill="#3f7f8a"/>
  ${tree(1260, 1010, 1.05, '#2c6a75')}${tree(1320, 1018, 0.8, '#2c6a75')}${tree(260, 1012, 0.95, '#2c6a75')}${tree(205, 1024, 0.7, '#2c6a75')}
  <path d="M0 1214 C 420 1166, 900 1236, 1600 1176 L1600 1400 L0 1400Z" fill="#1f4e5a"/>
  <path d="M-60 600 C 330 600, 470 760, 600 905 C 730 1050, 880 1150, 1130 1158 L1700 1158" fill="none" stroke="#1f4e5a" stroke-opacity=".18" stroke-width="86" stroke-linecap="round"/>
  <path d="M-60 588 C 330 588, 470 748, 600 893 C 730 1038, 880 1138, 1130 1146 L1700 1146" fill="none" stroke="url(#road-${id})" stroke-width="70" stroke-linecap="round"/>
  <path d="M-60 588 C 330 588, 470 748, 600 893 C 730 1038, 880 1138, 1130 1146 L1700 1146" fill="none" stroke="#c8593c" stroke-width="7" stroke-dasharray="34 28" stroke-linecap="round"/>
  ${tree(1460, 1200, 1.2, '#173d46')}${tree(90, 1240, 1.1, '#173d46')}
</svg>`;
}
