import type { Metadata } from 'next'
import { PoliciesClient } from './PoliciesClient'

export const metadata: Metadata = {
  title: 'Policies | ROEX Audio Systems',
  description:
    'Shipping Policy, Return Policy, Warranty, Privacy Policy, Terms of Sale, and Terms of Use for ROEX Audio Systems.',
  robots: { index: true, follow: true },
}

export default function PoliciesPage() {
  return <PoliciesClient />
}
