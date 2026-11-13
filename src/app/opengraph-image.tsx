import { ImageResponse } from 'next/og';

export const alt = 'GreenCampus – Sustainable Computing for Colleges';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#061A13',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            🌿
          </div>
          <span style={{ fontSize: '36px', fontWeight: 900 }}>
            Green<span style={{ color: '#34D399' }}>Campus</span>
          </span>
          <span
            style={{
              fontSize: '18px',
              backgroundColor: 'rgba(16, 185, 129, 0.2)',
              color: '#34D399',
              padding: '6px 16px',
              borderRadius: '9999px',
              marginLeft: '12px',
            }}
          >
            UN SDG 12 &amp; 13 Aligned
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
            }}
          >
            Computing with a Zero-Carbon Heart.
          </div>
          <div style={{ fontSize: '24px', color: '#A7F3D0', maxWidth: '900px' }}>
            Empowering higher education to monitor lab electricity, personal device emissions, and circular e-waste.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            fontSize: '20px',
            color: '#6EE7B7',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            width: '100%',
            paddingTop: '24px',
          }}
        >
          <span>⚡ Lab Energy Tracker</span>
          <span>•</span>
          <span>💻 Device Footprint Calculator</span>
          <span>•</span>
          <span>♻️ 98.4% Circular E-Waste</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
