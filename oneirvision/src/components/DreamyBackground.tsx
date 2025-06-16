import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';

const DreamyBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: ['#a78bfa', '#c084fc', '#e879f9', '#f472b6']
            },
            shape: {
              type: 'circle',
              stroke: {
                width: 0,
                color: '#000000'
              },
            },
            opacity: {
              value: 0.5,
              random: true,
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false
              }
            },
            size: {
              value: 3,
              random: true,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5,
                sync: false
              }
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: '#a78bfa',
              opacity: 0.2,
              width: 1
            },
            move: {
              enable: true,
              speed: 1,
              direction: 'none',
              random: true,
              straight: false,
              out_mode: 'out',
              bounce: false,
            }
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'grab'
              },
              onclick: {
                enable: true,
                mode: 'push'
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                line_linked: {
                  opacity: 1
                }
              },
              push: {
                particles_nb: 4
              }
            }
          },
          retina_detect: true
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-950/70 to-pink-950/80" />
    </div>
  );
};

export default DreamyBackground;
