import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        cyber: {
          "black": "#1A1F2C",
          "gray": "#8E9196",
          "blue": "#1EAEDB",
          "dark-blue": "#0FA0CE",
          "purple": {
            DEFAULT: "#8B5CF6",
            50: "#F5F3FF",
            100: "#EDE9FE",
            200: "#DDD6FE",
            300: "#C4B5FD",
            400: "#A78BFA",
            500: "#8B5CF6",
            600: "#7C3AED",
            700: "#6D28D9",
            800: "#5B21B6",
            900: "#4C1D95"
          },
          "pink": "#D946EF",
          "neon-purple": "#BB86FC",
          "cyber-purple": "#8B5CF6"
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px 0px rgba(139, 92, 246, 0.7)'
          },
          '50%': {
            boxShadow: '0 0 20px 5px rgba(139, 92, 246, 0.9)'
          },
        },
        'matrix-effect': {
          '0%': {
            transform: 'translateY(-100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(1000%)',
            opacity: '0.5'
          }
        },
        "pulse-color": {
          "0%, 100%": { 
            color: "hsl(var(--cyber-purple-500))",
            transform: "scale(1)"
          },
          "50%": { 
            color: "hsl(var(--cyber-purple-600))", 
            transform: "scale(1.05)"
          }
        },
        "gradient-shift": {
          "0%": { 
            "background-position": "0% 50%" 
          },
          "50%": { 
            "background-position": "100% 50%" 
          },
          "100%": { 
            "background-position": "0% 50%" 
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'matrix-effect': 'matrix-effect 20s linear infinite',
        "pulse-color": "pulse-color 3s ease-in-out infinite",
        "gradient-shift": "gradient-shift 10s ease infinite"
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
