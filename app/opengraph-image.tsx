import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'AirBook — The frictionless booking platform for independent pros';
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
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          fontFamily: 'sans-serif',
          overflow: 'hidden',
        }}
      >
        {/* Ambient Top-Left Coral Diffuse Glow */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            left: -80,
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 99, 71, 0.45) 0%, rgba(255, 99, 71, 0) 70%)',
          }}
        />

        {/* Ambient Bottom-Right Rose Diffuse Glow */}
        <div
          style={{
            position: 'absolute',
            bottom: -100,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 114, 182, 0.38) 0%, rgba(244, 114, 182, 0) 70%)',
          }}
        />

        {/* Ambient Top-Right Sky Blue Glow */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: 120,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(43, 181, 255, 0.25) 0%, rgba(43, 181, 255, 0) 70%)',
          }}
        />

        {/* Main Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            textAlign: 'center',
            padding: '0 40px',
          }}
        >
          {/* Main Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 44,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 62,
                fontWeight: 900,
                color: '#09090B',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              <span>The </span>
              <span
                style={{
                  color: '#FF6347',
                  marginLeft: 14,
                  marginRight: 14,
                }}
              >
                frictionless workspace
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 62,
                fontWeight: 900,
                color: '#09090B',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginTop: 4,
              }}
            >
              <span>for independent pros.</span>
            </div>
          </div>

          {/* Master Tool Dock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 22,
              backgroundColor: '#18181B',
              padding: '20px 26px',
              borderRadius: 38,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* 1. CALENDAR (SCHEDULING) — UNIFORM SQUIRCLE TILE */}
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: 28,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: '0 12px 28px rgba(0,0,0,0.25), inset 0 2px 2px rgba(255,255,255,0.9)',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Top Sky-Blue Header Band with Twin Binding Rings */}
              <div
                style={{
                  width: '100%',
                  height: 32,
                  backgroundColor: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    left: 24,
                    width: 6,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 24,
                    width: 6,
                    height: 10,
                    borderRadius: 3,
                    backgroundColor: '#FFFFFF',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
              </div>

              {/* Calendar Body Number */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                  paddingBottom: 4,
                }}
              >
                <span
                  style={{
                    color: '#0F172A',
                    fontSize: 48,
                    fontWeight: 900,
                    lineHeight: 1,
                    letterSpacing: '-0.04em',
                  }}
                >
                  01
                </span>
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#0284C7',
                    marginTop: 2,
                  }}
                />
              </div>
            </div>

            {/* 2. BOOKING PAGE (STOREFRONT) — UNIFORM SQUIRCLE TILE */}
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: 28,
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '12px 14px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 12px 28px rgba(0,0,0,0.22), inset 0 2px 2px rgba(255,255,255,0.9)',
                flexShrink: 0,
              }}
            >
              {/* Top-Right Dog-Ear Fold in Vibrant Coral */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 40,
                  height: 40,
                  backgroundColor: '#FF6347',
                  borderBottomLeftRadius: 20,
                  boxShadow: '-2px 2px 5px rgba(0,0,0,0.15)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                  borderWidth: '0 40px 40px 0',
                  borderColor: 'transparent #FFFFFF transparent transparent',
                }}
              />

              {/* Top Browser Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#EF4444' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#10B981' }} />
              </div>

              {/* Abstract Website Layout Blocks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', marginTop: 8 }}>
                <div
                  style={{
                    width: 44,
                    height: 7,
                    borderRadius: 3.5,
                    backgroundColor: '#FF6347',
                  }}
                />
                <div
                  style={{
                    width: '80%',
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: '#CBD5E1',
                  }}
                />
                <div
                  style={{
                    width: '60%',
                    height: 5,
                    borderRadius: 2.5,
                    backgroundColor: '#E2E8F0',
                  }}
                />
                <div
                  style={{
                    width: 36,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#0284C7',
                    marginTop: 2,
                  }}
                />
              </div>
            </div>

            {/* 3. POS (TAP TO PAY) — UNIFORM SQUIRCLE TILE */}
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: 28,
                background: 'linear-gradient(135deg, #064E3B 0%, #059669 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 12px 28px rgba(5, 150, 105, 0.38), inset 0 2px 2px rgba(255,255,255,0.4)',
                border: '1.5px solid rgba(52, 211, 153, 0.3)',
                flexShrink: 0,
              }}
            >
              {/* Smartphone / Terminal Top Speaker Slit */}
              <div
                style={{
                  width: 26,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: '#022C22',
                  marginTop: 2,
                }}
              />

              {/* Screen Enclosure with Deeply Arched Tap to Pay SVG Waves */}
              <div
                style={{
                  width: '100%',
                  height: 64,
                  borderRadius: 14,
                  backgroundColor: '#065F46',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
                }}
              >
                {/* Vector Deeply Arched Tap to Pay Signal Arcs */}
                <svg
                  width="60"
                  height="44"
                  viewBox="0 0 60 44"
                  fill="none"
                  style={{ display: 'flex' }}
                >
                  <path
                    d="M 16,34 A 12,12 0 0,1 16,10"
                    stroke="#34D399"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 24,38 A 18,18 0 0,1 24,6"
                    stroke="#34D399"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 32,41 A 24,24 0 0,1 32,3"
                    stroke="#A7F3D0"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 40,43 A 30,30 0 0,1 40,1"
                    stroke="#FFFFFF"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* Status LED Confirmation Dot */}
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 8,
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    backgroundColor: '#6EE7B7',
                    boxShadow: '0 0 6px #34D399',
                  }}
                />
              </div>

              {/* Bottom Swipe Channel */}
              <div
                style={{
                  width: 44,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: '#022C22',
                  marginBottom: 2,
                }}
              />
            </div>

            {/* 4. CONTACT LIST (CRM) — EXACT UNIFORM SQUIRCLE TILE (CONTAINED SEAMLESSLY INSIDE) */}
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: 28,
                backgroundColor: '#0F172A',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                boxShadow: '0 12px 28px rgba(180, 83, 9, 0.35), inset 0 2px 2px rgba(255,255,255,0.4)',
                border: '1px solid rgba(180, 83, 9, 0.3)',
                flexShrink: 0,
              }}
            >
              {/* Left Leather Book Body */}
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  background: 'linear-gradient(135deg, #E28C2B 0%, #C26E17 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.4), inset 0 -3px 4px rgba(0,0,0,0.2)',
                  borderRight: '1px solid rgba(0,0,0,0.25)',
                }}
              >
                {/* Left Spine Fold / Crease Shadow */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 10,
                    background: 'linear-gradient(to right, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.05) 70%, transparent 100%)',
                    borderRight: '1px solid rgba(0,0,0,0.15)',
                  }}
                />

                {/* Embossed / Debossed Circular Contact Profile Glyph */}
                <svg
                  width="54"
                  height="54"
                  viewBox="0 0 60 60"
                  fill="none"
                  style={{ display: 'flex', marginLeft: 4 }}
                >
                  <circle
                    cx="30"
                    cy="30"
                    r="25"
                    stroke="#8A4605"
                    strokeWidth="3"
                    strokeOpacity="0.65"
                  />
                  <circle
                    cx="30"
                    cy="31"
                    r="25"
                    stroke="#FED7AA"
                    strokeWidth="1.5"
                    strokeOpacity="0.45"
                  />
                  <circle
                    cx="30"
                    cy="23"
                    r="8.5"
                    fill="#9A4E06"
                    fillOpacity="0.6"
                  />
                  <path
                    d="M 16,43 C 16,34 22,33 30,33 C 38,33 44,34 44,43"
                    fill="#9A4E06"
                    fillOpacity="0.6"
                  />
                </svg>
              </div>

              {/* Right Vertical Column of 4 Protruding Index Tabs (Inside Squircle) */}
              <div
                style={{
                  width: 14,
                  height: '100%',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '8px 0',
                  boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.15)',
                }}
              >
                {/* Tab 1: Silver/Grey */}
                <div
                  style={{
                    width: '100%',
                    height: 18,
                    borderRadius: '0 6px 6px 0',
                    backgroundColor: '#CBD5E1',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                {/* Tab 2: Sky Blue */}
                <div
                  style={{
                    width: '100%',
                    height: 18,
                    borderRadius: '0 6px 6px 0',
                    backgroundColor: '#38BDF8',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                {/* Tab 3: Amber / Orange */}
                <div
                  style={{
                    width: '100%',
                    height: 18,
                    borderRadius: '0 6px 6px 0',
                    backgroundColor: '#F59E0B',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
                {/* Tab 4: Mint / Green */}
                <div
                  style={{
                    width: '100%',
                    height: 18,
                    borderRadius: '0 6px 6px 0',
                    backgroundColor: '#34D399',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom AirBook Brand Subtitle */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 800,
            color: '#94A3B8',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          <span>AirBook</span>
          <span>•</span>
          <span>getairbook.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
