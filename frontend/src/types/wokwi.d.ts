// TypeScript definitions for @wokwi/elements custom web components
declare namespace JSX {
  interface IntrinsicElements {
    'wokwi-esp32-devkit-v1': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      [key: string]: any;
    };
    'wokwi-dht22': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      temperature?: number;
      humidity?: number;
      [key: string]: any;
    };
    'wokwi-ds18b20': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      [key: string]: any;
    };
    'wokwi-ssd1306': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      [key: string]: any;
    };
    'wokwi-led': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      color?: string;
      value?: boolean | number;
      label?: string;
      [key: string]: any;
    };
    'wokwi-pushbutton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      color?: string;
      label?: string;
      pressed?: boolean;
      [key: string]: any;
    };
    'wokwi-resistor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      value?: string;
      label?: string;
      [key: string]: any;
    };
    'wokwi-buzzer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      hasSignal?: boolean;
      label?: string;
      [key: string]: any;
    };
  }
}
