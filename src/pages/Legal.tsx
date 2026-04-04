import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const Legal = () => (
  <div className="min-h-screen bg-background px-4 py-8 sm:px-6">
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="text-sm text-primary hover:underline">
        ← Back to AgriTrust
      </Link>

      <h1 className="mt-6 font-heading text-2xl font-semibold text-foreground sm:text-3xl">
        Legal
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        End-User Licence Agreement and Privacy Policy for the AgriTrust platform.
      </p>

      <Tabs defaultValue="eula" className="mt-6">
        <TabsList className="sticky top-0 z-10 w-full justify-start bg-muted">
          <TabsTrigger value="eula">EULA</TabsTrigger>
          <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
        </TabsList>

        {/* ── EULA ── */}
        <TabsContent value="eula" className="space-y-6 pb-16 pt-4">
          <p className="text-xs text-muted-foreground">Last updated: March 2026</p>

          <Section title="1. User Eligibility">
            Users must be 18 years of age or older. Users must be operating as legitimate
            agricultural producers or buyers in Zimbabwe. The platform is not open to
            anonymous or unverified parties.
          </Section>

          <Section title="2. Scope of Licence">
            AgriTrust grants users a limited, non-exclusive licence to use the platform
            for genuine agricultural trade. Users may not collect data about other users
            for any purpose outside their direct transaction. Users may not scrape, copy,
            or redistribute any platform content.
          </Section>

          <Section title="3. Data Collection and Use">
            AgriTrust collects authentication data, produce listing data, negotiation
            records including offer values and agreed prices, post-deal messages, and
            trust ratings. This data is used solely to operate the platform and support
            the negotiation and transaction process. Data is not sold to third parties.
          </Section>

          <Section title="4. Data Security">
            AgriTrust uses Row Level Security enforced through the database layer to
            ensure that negotiation records and messages are only accessible to the two
            parties directly involved in a transaction. All data is transmitted over
            encrypted connections. Users are responsible for maintaining the security of
            their own login credentials.
          </Section>

          <Section title="5. Limitation of Liability">
            AgriTrust provides price guidance as approximate reference ranges based on
            available market context. This guidance is not a guarantee of market price
            accuracy. AgriTrust acknowledges its responsibility to provide guidance that
            is as accurate and up-to-date as reasonably possible. The platform does not
            disclaim all responsibility for guidance quality. Users retain full
            decision-making authority over all pricing decisions.
          </Section>

          <Section title="6. User Rights">
            Users have the right to access the personal data AgriTrust holds about them.
            Users have the right to correct inaccurate data. Users have the right to
            request deletion of their data at the end of the retention period. To
            exercise any of these rights, users can contact AgriTrust through the support
            channel listed on the platform.
          </Section>

          <Section title="7. Dispute Resolution">
            Users who believe the platform has caused them harm may raise a complaint
            through the AgriTrust support channel. AgriTrust commits to acknowledging
            complaints within 5 business days and responding with a resolution within
            30 days.
          </Section>

          <Section title="8. Termination">
            AgriTrust reserves the right to suspend or terminate accounts that violate
            these terms. Users may delete their accounts at any time through their
            profile settings.
          </Section>
        </TabsContent>

        {/* ── Privacy Policy ── */}
        <TabsContent value="privacy" className="space-y-6 pb-16 pt-4">
          <p className="text-xs text-muted-foreground">Last updated: March 2026</p>

          <Section title="1. What We Collect">
            We collect your name and email address at registration. We collect produce
            listing details including crop type, quantity, location, and price. We
            collect negotiation records including offers made and agreed prices. We
            collect post-deal messages between transaction parties. We collect trust
            ratings submitted after completed transactions.
          </Section>

          <Section title="2. Why We Collect It">
            Authentication data is required to operate the platform and verify user
            identity. Listing and transaction data is required to facilitate trade.
            Negotiation records are retained to support dispute resolution and trust
            score calculation. Messages are stored to support post-deal coordination
            between parties.
          </Section>

          <Section title="3. Who Can Access Your Data">
            Negotiation messages and offer records are only accessible to the two
            parties in that specific transaction, enforced through Row Level Security.
            Trust scores and completed transaction counts are visible to all platform
            users as part of the public profile. No data is shared with third parties
            outside the transaction.
          </Section>

          <Section title="4. How Long We Keep It">
            Transaction and negotiation records are retained for a minimum of 3 years
            to support dispute resolution. Account data is retained for as long as the
            account is active. Users may request deletion of their data after the
            retention period ends.
          </Section>

          <Section title="5. Your Rights">
            You have the right to request a copy of all data AgriTrust holds about you.
            You have the right to correct any inaccurate data. You have the right to
            request deletion of your data subject to the retention requirements above.
            These rights are protected under Zimbabwe's Cyber and Data Protection Act
            (Chapter 12:07, 2021).
          </Section>

          <Section title="6. Cookies and Tracking">
            AgriTrust does not use advertising cookies or third-party tracking. Session
            data is used solely to maintain your login state.
          </Section>

          <Section title="7. Changes to This Policy">
            AgriTrust will notify users of material changes to this Privacy Policy via
            email and an in-app notification at least 14 days before changes take
            effect.
          </Section>

          <Section title="8. Contact">
            For any privacy-related queries, contact us through the support channel
            available on the platform.
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{children}</p>
  </div>
);

export default Legal;
