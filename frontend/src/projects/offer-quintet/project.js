import OfferQuintetFlier from '../../fliers/offer-quintet/OfferQuintetFlier'
import { offerQuintet } from '../../fliers/offer-quintet/tokens'
import { createProject } from '../layout'

const { width, height } = offerQuintet.size

/** Offer Quintet — cream/orange Learn & Earn from pintrest/earn.png */
export default createProject({
  id: 'offer-quintet',
  name: 'Offer Quintet',
  brand: 'Offer Quintet',
  description: 'Cream + orange Learn & Earn — 3+2 speakers, access-fee blob, contact footer.',
  color: '#e85a28',
  fliers: [
    {
      id: 'offer-quintet-main',
      name: 'Offer Quintet',
      group: 'Offer Quintet',
      description: 'Reference: pintrest/earn.png',
      width,
      height,
      filename: 'offer-quintet',
      Component: OfferQuintetFlier,
      props: {
        width,
        height,
        present: 'JOYCE WRITERS ACADEMY PRESENT',
        titleLead: 'Learn &',
        titleMega: 'earn',
        versionBadge: '1.0',
        titleYear: '2026',
        ctaLabel: 'JOIN NOW',
        tagline: 'Turn your words into income.',
        speakersLabel: 'SPEAKERS',
        hostLabel: 'Host',
        telegramLabel: 'TELEGRAM',
        date: '1ST - 29TH FEB. 2026',
        feeLabel: 'ACCESS FEE',
        priceWas: 'N9999',
        priceNow: 'N4999',
        footerWhatsapp: '09067872844',
        footerSocial: 'Mbata Rejoice',
        speakers: [
          {
            name: 'Mbata Rejoice',
            title: 'Personal growth coach / Founder, Joyce Writers Academy',
            photoSrc: '',
          },
          { name: 'Harrison Prince', title: 'Founder / CEO Height', photoSrc: '' },
          {
            name: 'Grace Harrison',
            title: 'Personal development and identity coach / Content writer',
            photoSrc: '',
          },
          {
            name: 'Iheanacho Victor',
            title: 'Creative Brand designer / Brand Strategist',
            photoSrc: '',
          },
          {
            name: 'Toria Dickson',
            title: 'Founder, ToriaX Marketing Agency / COO, Tokicard',
            photoSrc: '',
          },
        ],
      },
    },
  ],
})
