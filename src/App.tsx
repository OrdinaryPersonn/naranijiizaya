import { useEffect, useRef, useState, type ReactNode } from 'react'
import { SITE_CONFIG } from './config/site'
import { ThemeToggle } from './components/ThemeToggle'
import { ActivityGallery } from './components/ActivityGallery'
import { ORGANIZATION_COPY } from './data/organizationCopy'
import { PRODUCTS } from './data/merch'
import { MEDICAL_REFERENCES } from './data/references'
import { TRANSLATIONS } from './i18n/translations'
import type { Locale, Translation } from './i18n/types'
import { Icon, type IconName } from './components/Icon'
import { SectionHeading } from './components/SectionHeading'
import './styles.css'

const locales: Locale[] = ['mn', 'en', 'zh', 'ru']
const publishedProducts = PRODUCTS.filter((product) => product.status === 'published')
const getInitialLocale = (): Locale => {
  const fromUrl = new URLSearchParams(window.location.search).get('lang') as Locale | null
  if (fromUrl && locales.includes(fromUrl)) return fromUrl
  try {
    const stored = window.localStorage.getItem('preferred-locale') as Locale | null
    return stored && locales.includes(stored) ? stored : 'mn'
  } catch {
    return 'mn'
  }
}

function Button({ children, href, onClick, variant = 'primary', icon = 'arrow', className = '', type = 'button' }: { children: ReactNode; href?: string; onClick?: () => void; variant?: 'primary' | 'quiet' | 'outline'; icon?: IconName | null; className?: string; type?: 'button' | 'submit' }) {
  const classes = `button button--${variant} ${className}`
  if (href) return <a className={classes} href={href} onClick={onClick} target={icon === 'external' ? '_blank' : undefined} rel={icon === 'external' ? 'noreferrer' : undefined}>{children}{icon && <Icon name={icon} size={17} />}</a>
  return <button type={type} className={classes} onClick={onClick}>{children}{icon && <Icon name={icon} size={17} />}</button>
}

function BrandMark() {
  return SITE_CONFIG.logoPath
    ? <img className="brand-logo" src={SITE_CONFIG.logoPath} alt="" />
    : <><span className="sun-mark sun-mark--small" aria-hidden="true"><Icon name="sun" size={23}/></span><span className="brand-wordmark">{SITE_CONFIG.shortName}<small>НҮТББ</small></span></>
}

function Header({ t, locale, setLocale, menuOpen, setMenuOpen }: { t: Translation; locale: Locale; setLocale: (locale: Locale) => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const navItems = [['diagnosis', t.nav.diagnosis], ['guide', t.nav.guide], ['profile', ORGANIZATION_COPY[locale].profile.name], ['about', t.nav.about], ['join', t.nav.join], ...(publishedProducts.length ? [['shop', t.nav.shop]] : [])]
  const go = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
  return <header className="site-header">
    <div className="shell header-inner">
      <a className="brand" href="#top" aria-label={`${SITE_CONFIG.organizationName} — ${t.footer.support}`} onClick={() => setMenuOpen(false)}>
        <BrandMark/>
      </a>
      <nav className={`desktop-nav ${menuOpen ? 'desktop-nav--open' : ''}`} aria-label="Main navigation">
        {navItems.map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}
      </nav>
      <div className="header-actions">
        <ThemeToggle t={t}/>
        <label className="language-select"><span className="sr-only">Language</span><select value={locale} onChange={(e) => setLocale(e.target.value as Locale)} aria-label="Language"><option value="mn">MN</option><option value="en">EN</option><option value="zh">中文</option><option value="ru">RU</option></select><Icon name="chevron" size={13} /></label>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t.common.menuClose : t.common.menu} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} size={24} /></button>
      </div>
    </div>
    <nav id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`} aria-label={t.common.menu}>
      <div className="shell mobile-nav-inner">{navItems.map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}<Icon name="arrow" size={18} /></button>)}</div>
    </nav>
  </header>
}

function Hero({ t, locale }: { t: Translation; locale: Locale }) {
  const content = ORGANIZATION_COPY[locale]
  return <section className="hero" id="top">
    <div className="hero-orbit hero-orbit--one" aria-hidden="true"/><div className="hero-orbit hero-orbit--two" aria-hidden="true"/>
    <div className="shell hero-grid">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" aria-hidden="true"/><span>{t.hero.eyebrow}</span></div>
        <h1>{t.hero.title}</h1>
        <p className="hero-body">{t.hero.body}</p>
        <div className="hero-buttons"><Button href="#diagnosis" onClick={() => document.getElementById('diagnosis')?.scrollIntoView({ behavior: 'smooth' })}>{t.hero.primary}</Button><Button href="#join" variant="quiet" icon="arrow">{t.hero.secondary}</Button></div>
        <p className="hero-note"><Icon name="shield" size={16}/>{t.hero.note}</p>
      </div>
      <div className="hero-visual" aria-label={t.common.sunMark} role="img">
        <div className="sun-disc"><Icon name="sun" size={96} strokeWidth={1.15}/></div>
        <div className="hero-card hero-card--top"><span className="hero-card-icon"><Icon name="heart" size={18}/></span><span><strong>01</strong><small>{t.diagnosis.stepLabel}</small></span></div>
        <div className="hero-card hero-card--bottom"><span className="hero-card-icon"><Icon name="users" size={18}/></span><span><strong>{content.name}</strong><small>{content.values[3]}</small></span></div>
        <div className="orbit orbit--large"/><div className="orbit orbit--small"/>
      </div>
    </div>
    <div className="hero-edge" aria-hidden="true"/>
  </section>
}

const journeyIcons: IconName[] = ['book', 'note', 'users', 'clipboard', 'sparkle', 'link', 'heart', 'shield']
function DiagnosisSection({ t }: { t: Translation }) {
  const steps = t.diagnosis.journeyTitles.map((title, index) => [title, t.diagnosis.journeyBodies[index]])
  return <section className="section diagnosis-section" id="diagnosis"><div className="shell">
    <SectionHeading eyebrow={t.diagnosis.eyebrow} title={t.diagnosis.title} body={t.diagnosis.body}/>
    <div className="journey-grid">{steps.map(([title, body], index) => <article className="journey-card" key={title}>
      <div className="journey-number"><span>{String(index + 1).padStart(2, '0')}</span><Icon name={journeyIcons[index]} size={21}/></div><h3>{title}</h3><p>{body}</p>
    </article>)}</div>
    <div className="checklist-card" id="checklist">
      <div className="checklist-copy"><div className="eyebrow"><span className="eyebrow-dot" aria-hidden="true"/><span>{t.diagnosis.print}</span></div><h3>{t.diagnosis.checklistTitle}</h3><p>{t.diagnosis.checklistBody}</p><Button onClick={() => window.print()} variant="outline" icon="print">{t.diagnosis.checklistButton}</Button></div>
      <div className="checklist-items">{t.diagnosis.checklistItems.map((item) => <label key={item} className="check-item"><input type="checkbox"/><span className="check-box"><Icon name="check" size={14}/></span><span>{item}</span></label>)}</div>
    </div>
  </div></section>
}

function GuideSection({ t }: { t: Translation }) {
  const [open, setOpen] = useState(0)
  return <section className="section guide-section" id="guide"><div className="shell"><SectionHeading eyebrow={t.guide.eyebrow} title={t.guide.title} body={t.guide.body}/>
    <div className="disclaimer"><Icon name="shield" size={22}/><p>{t.guide.disclaimer}</p></div>
    <div className="guide-list">{t.guide.categories.map((category, index) => <article className={`guide-item ${open === index ? 'guide-item--open' : ''}`} key={category.title}>
      <button className="guide-trigger" aria-expanded={open === index} aria-controls={`guide-panel-${index}`} onClick={() => setOpen(open === index ? -1 : index)}><span className="guide-index">{String(index + 1).padStart(2, '0')}</span><span>{category.title}</span><span className="guide-plus" aria-hidden="true">{open === index ? '−' : '+'}</span></button>
      <div id={`guide-panel-${index}`} className="guide-panel" hidden={open !== index}><p>{category.body}</p></div>
    </article>)}</div>
  </div></section>
}

function ProfileSection({ locale }: { locale: Locale }) {
  const profile = ORGANIZATION_COPY[locale].profile
  return <section className="section stories-section" id="profile"><div className="shell">
    <SectionHeading eyebrow={profile.label} title={profile.name} body={profile.role} light/>
    <div className="profile-grid">
      <div className="profile-body">{profile.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <aside className="profile-aside">
        <Icon name="heart" size={28}/>
        <blockquote>{profile.quote}</blockquote>
        <h3>{profile.goalLabel}</h3><p>{profile.goal}</p>
        <h3>{profile.futureLabel}</h3><p>{profile.future}</p>
      </aside>
    </div>
  </div></section>
}

function AboutSection({ t, locale }: { t: Translation; locale: Locale }) {
  const content = ORGANIZATION_COPY[locale]
  return <section className="section about-section" id="about"><div className="shell">
    <div className="about-grid">
      <article className="initiative-card" id="initiative">
        <Icon name="sun" size={42}/><h3>{content.initiative.title}</h3><p>{content.initiative.body}</p>
        <ul>{content.initiative.principles.map((principle) => <li key={principle}>{principle}</li>)}</ul>
      </article>
      <div className="about-copy">
        <SectionHeading eyebrow={t.about.eyebrow} title={content.name}/><p className="about-intro">{content.shortDescription}</p>
        <div className="mission-grid"><div><span className="small-label">{t.about.missionLabel}</span><p>{content.mission}</p></div><div><span className="small-label">{t.about.visionLabel}</span><p>{content.vision}</p></div></div>
        <div className="values"><span className="small-label">{t.about.valuesLabel}</span><div className="value-pills">{content.values.map((value) => <span key={value}><Icon name="sun" size={15}/>{value}</span>)}</div></div>
      </div>
    </div>
    <div className="organization-activities"><h3>{content.activitiesLabel}</h3><ul>{content.activities.map((activity) => <li key={activity}><Icon name="check" size={18}/><span>{activity}</span></li>)}</ul></div>
    <ActivityGallery t={t}/>
    <div className="cooperation-grid">{[content.regional, content.international].map((item) => <article key={item.title}><h3>{item.title}</h3><p>{item.body}</p></article>)}</div>
  </div></section>
}

function JoinSection({ t, onDonate }: { t: Translation; onDonate: () => void }) {
  const hasVolunteer = Boolean(SITE_CONFIG.volunteerFormUrl)
  return <section className="section join-section" id="join"><div className="shell"><SectionHeading eyebrow={t.join.eyebrow} title={t.join.title} body={t.join.body}/><div className="join-grid">
    <article className="join-card join-card--volunteer"><div className="join-icon"><Icon name="users" size={25}/></div><span className="card-kicker">01</span><h3>{t.join.volunteerTitle}</h3><p>{t.join.volunteerBody}</p>{hasVolunteer ? <Button href={SITE_CONFIG.volunteerFormUrl} icon="external" variant="outline">{t.join.volunteerButton}</Button> : <span className="disabled-action"><Icon name="link" size={17}/>{t.join.volunteerSoon}</span>}</article>
    <article className="join-card join-card--donate"><div className="join-icon"><Icon name="heart" size={25}/></div><span className="card-kicker">02</span><h3>{t.join.donationTitle}</h3><p>{t.join.donationBody}</p><Button onClick={onDonate}>{t.join.donationButton}</Button>{!SITE_CONFIG.donation.bankName && <span className="card-footnote">{t.join.donationSoon}</span>}</article>
  </div></div></section>
}

function ShopSection({ t }: { t: Translation }) {
  if (!publishedProducts.length) return null
  return <section className="section shop-section" id="shop"><div className="shell"><SectionHeading eyebrow={t.shop.eyebrow} title={t.shop.title} body={t.shop.body}/><div className="shop-grid">{publishedProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img src={product.images[0]} alt="" loading="lazy"/><span>{t.shop.soon}</span></div><div className="product-body"><div className="product-title-row"><h3>{product.name}</h3><Icon name="bag" size={18}/></div><p>{product.description}</p><div className="product-meta"><span>{t.shop.noPrice}</span><span className="product-status">{t.shop.soon}</span></div></div></article>)}</div></div></section>
}

function DonationModal({ t, onClose }: { t: Translation; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null); const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
        if (!focusable.length) return
        const first = focusable[0]; const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKeyDown); document.body.classList.add('modal-open')
    return () => { document.removeEventListener('keydown', onKeyDown); document.body.classList.remove('modal-open'); previous?.focus() }
  }, [onClose])
  const configured = Boolean(SITE_CONFIG.donation.bankName && SITE_CONFIG.donation.accountName && SITE_CONFIG.donation.accountNumber)
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><div className="donation-modal" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="donation-title"><button ref={closeRef} className="modal-close" onClick={onClose} aria-label={t.modal.close}><Icon name="close" size={21}/></button><div className="modal-icon"><Icon name="heart" size={25}/></div><h2 id="donation-title">{t.modal.title}</h2>{configured ? <div className="payment-details">{SITE_CONFIG.donation.qrImage && <img src={SITE_CONFIG.donation.qrImage} alt={t.modal.qrAlt}/>}<dl><dt>{t.modal.bank}</dt><dd>{SITE_CONFIG.donation.bankName}</dd><dt>{t.modal.accountName}</dt><dd>{SITE_CONFIG.donation.accountName}</dd><dt>{t.modal.accountNumber}</dt><dd>{SITE_CONFIG.donation.accountNumber}</dd>{SITE_CONFIG.donation.instructions && <><dt>{t.modal.instructions}</dt><dd>{SITE_CONFIG.donation.instructions}</dd></>}</dl></div> : <div className="donation-placeholder"><p>{t.modal.missing}</p></div>}</div></div>
}

function Footer({ t }: { t: Translation }) {
  const socials = Object.entries(SITE_CONFIG.socials).filter(([, value]) => value)
  return <footer className="site-footer"><div className="shell"><div className="footer-top"><div className="footer-brand"><a className="brand brand--footer" href="#top" aria-label={SITE_CONFIG.organizationName}><BrandMark/></a><p>{t.footer.support}</p><div className="footer-sun-line"><span/><Icon name="sun" size={16}/><span/></div></div><div className="footer-links"><a href="#guide">{t.footer.references}</a>{SITE_CONFIG.privacyUrl && <a href={SITE_CONFIG.privacyUrl}>{t.footer.privacy}</a>}<a href="#guide">{t.footer.disclaimer}</a></div><div className="footer-contact">{SITE_CONFIG.email && <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>}{SITE_CONFIG.phone && <a href={`tel:${SITE_CONFIG.phone}`}>{SITE_CONFIG.phone}</a>}{SITE_CONFIG.address && <span>{SITE_CONFIG.address}</span>}{socials.length > 0 && <div className="socials">{socials.map(([name, url]) => <a key={name} href={url} target="_blank" rel="noreferrer">{name}<Icon name="external" size={14}/></a>)}</div>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {SITE_CONFIG.organizationName}. {t.footer.rights}</span><span>{t.footer.disclaimer}</span></div></div></footer>
}

function ReferenceStrip({ t }: { t: Translation }) {
  return <section className="reference-strip"><div className="shell reference-inner"><div><span className="small-label">{t.footer.references}</span><p>{t.footer.sourceIntro}</p></div><div className="reference-links">{MEDICAL_REFERENCES.slice(0, 4).map((reference) => <a key={reference.id} href={reference.url} target="_blank" rel="noreferrer">{reference.organization}<Icon name="external" size={14}/></a>)}</div></div></section>
}

export default function App() {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)
  const [menuOpen, setMenuOpen] = useState(false)
  const [donationOpen, setDonationOpen] = useState(false)
  const t = TRANSLATIONS[locale]
  const setLocale = (next: Locale) => { setLocaleState(next); try { window.localStorage.setItem('preferred-locale', next) } catch { /* Language still works without storage. */ } const url = new URL(window.location.href); url.searchParams.set('lang', next); window.history.replaceState({}, '', url); document.documentElement.lang = TRANSLATIONS[next].htmlLang; setMenuOpen(false) }
  useEffect(() => { document.documentElement.lang = t.htmlLang; document.title = t.seo.title; const description = document.querySelector('meta[name="description"]'); description?.setAttribute('content', t.seo.description); document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.seo.title); document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.seo.description); document.querySelector('meta[property="og:locale"]')?.setAttribute('content', ({ mn: 'mn_MN', en: 'en_US', zh: 'zh_CN', ru: 'ru_RU' } as const)[locale]); let canonical = document.querySelector('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement('link'); canonical.setAttribute('rel', 'canonical'); document.head.appendChild(canonical) } canonical.setAttribute('href', SITE_CONFIG.siteUrl || window.location.origin); locales.forEach((lang) => { let alternate = document.querySelector(`link[hreflang="${lang}"]`); if (!alternate) { alternate = document.createElement('link'); alternate.setAttribute('rel', 'alternate'); alternate.setAttribute('hreflang', lang); document.head.appendChild(alternate) } alternate.setAttribute('href', `${window.location.origin}/?lang=${lang}`) }); let fallback = document.querySelector('link[hreflang="x-default"]'); if (!fallback) { fallback = document.createElement('link'); fallback.setAttribute('rel', 'alternate'); fallback.setAttribute('hreflang', 'x-default'); document.head.appendChild(fallback) } fallback.setAttribute('href', `${window.location.origin}/?lang=mn`) }, [locale, t.htmlLang, t.seo.description, t.seo.title])
  return <><Header t={t} locale={locale} setLocale={setLocale} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/><main id="main-content"><Hero t={t} locale={locale}/><DiagnosisSection t={t}/><GuideSection t={t}/><ProfileSection locale={locale}/><AboutSection t={t} locale={locale}/><JoinSection t={t} onDonate={() => setDonationOpen(true)}/><ShopSection t={t}/><ReferenceStrip t={t}/></main><Footer t={t}/>{donationOpen && <DonationModal t={t} onClose={() => setDonationOpen(false)}/>}<a className="back-to-top" href="#top" aria-label="Back to top"><Icon name="arrowUp" size={18}/></a></>
}
