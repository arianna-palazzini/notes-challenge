declare namespace JSX {
  interface IntrinsicElements {
    "note-card": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      title?: string;
      description?: string;
      date?: string;
    };
  }
}
