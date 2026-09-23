import { Icon } from './Icon'

export function SectionHeading({ eyebrow, title, body, light = false }: { eyebrow: string; title: string; body?: string; light?: boolean; }) {
  return <div className={`section-heading ${light ? 'section-heading--light' : ''}`}>
    <div className="eyebrow"><span className="eyebrow-dot" aria-hidden="true"/><span>{eyebrow}</span></div>
    <h2>{title}</h2>
    {body && <p>{body}</p>}
    <Icon className="heading-sun" name="sun" size={28} aria-hidden="true" />
  </div>
}
