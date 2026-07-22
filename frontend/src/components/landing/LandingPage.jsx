import { useEffect } from 'react'
import LandingNav from './sections/LandingNav'
import Hero from './sections/Hero'
import BrandMarquee from './sections/BrandMarquee'
import FeatureBoards from './sections/FeatureBoards'
import FeatureEdit from './sections/FeatureEdit'
import FeatureTemplates from './sections/FeatureTemplates'
import FeatureExport from './sections/FeatureExport'
import Workflow from './sections/Workflow'
import CtaFooter from './sections/CtaFooter'
import './LandingPage.css'

export default function LandingPage() {
  useEffect(() => {
    const prevTitle = document.title
    document.title = 'Flier Studio — Start with a template. Make it yours.'
    return () => {
      document.title = prevTitle
    }
  }, [])

  return (
    <div className="landing">
      <div className="landing__scroll">
        <LandingNav />
        <main>
          <Hero />
          <BrandMarquee />
          <FeatureBoards />
          <FeatureEdit />
          <FeatureTemplates />
          <FeatureExport />
          <Workflow />
        </main>
        <CtaFooter />
      </div>
    </div>
  )
}
