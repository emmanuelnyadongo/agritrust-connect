import { Link } from 'react-router-dom';

const Terms = () => (
  <div className="min-h-screen bg-background px-4 py-8 sm:px-6">
    <div className="mx-auto max-w-2xl">
      <Link to="/" className="text-sm text-primary hover:underline">
        Back to AgriTrust
      </Link>
      <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground">
        Terms of Use and Privacy
      </h1>
      <p className="mt-2 text-xs text-muted-foreground">
        Last updated: 2025. This is a pilot platform. Formal terms and privacy policy will be updated for production use.
      </p>
      <div className="mt-6 space-y-4 text-sm text-muted-foreground">
        <p>
          AgriTrust is a negotiation-support platform for smallholder farmers and produce buyers. By signing in you agree to use the platform in good faith and to provide accurate information. The platform does not process payments; all payments are arranged directly between users.
        </p>
        <p>
          We store your account data, listings, negotiations, and transaction records to operate the service and, in anonymised form, for research and evaluation. We do not sell your data. Contact support for data access or deletion requests.
        </p>
        <p>
          For full terms and a detailed privacy policy, contact the platform operator or see updates on this page.
        </p>
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        <Link to="/" className="text-primary hover:underline">Return to sign in</Link>
      </p>
    </div>
  </div>
);

export default Terms;
