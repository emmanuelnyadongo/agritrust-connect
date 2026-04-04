import { Link } from 'react-router-dom';

export const AppFooter = () => (
  <footer className="border-t border-border bg-background px-4 py-4 text-center text-xs text-muted-foreground">
    © {new Date().getFullYear()} AgriTrust · <Link to="/legal" className="text-primary hover:underline">Legal / Privacy Policy</Link>
  </footer>
);
