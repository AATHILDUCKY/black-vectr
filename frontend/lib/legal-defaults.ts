// Default Markdown for the legal pages, shown when the admin hasn't written
// custom content yet. Mirrors the copy these pages previously had. The admin can
// override either page from Admin → Settings → Legal pages.

export function defaultPrivacyPolicy(brandName: string, contactEmail: string): string {
  return `${brandName} ("we", "us") respects your privacy. This policy explains what information we collect and how we use it.

## Information we collect

We collect information you provide directly — such as your name, email, company, and message when you submit a contact or newsletter form — and basic analytics data about how you use our site.

## How we use it

We use your information to respond to enquiries, deliver our services, send updates you've opted into, and improve our website. We never sell your data.

## Your rights

You may request access to, correction of, or deletion of your personal data at any time by contacting us at [${contactEmail}](mailto:${contactEmail}).

## Cookies

We use cookies to analyze traffic and improve your experience. You can control cookies through your browser settings.`;
}

export function defaultTermsOfService(brandName: string): string {
  return `By accessing or using the ${brandName} website, you agree to these terms. Please read them carefully.

## Use of our site

You may use our site for lawful purposes only. You agree not to misuse the site or attempt to disrupt its operation.

## Intellectual property

All content on this site, including text, graphics, and logos, is the property of ${brandName} unless otherwise stated, and may not be reproduced without permission.

## Services

Any services we provide are governed by a separate agreement. These terms cover your use of the website only.

## Limitation of liability

The site is provided "as is." We are not liable for any damages arising from your use of the site to the fullest extent permitted by law.`;
}
