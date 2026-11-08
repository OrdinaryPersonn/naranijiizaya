import { useState } from 'react'
import { ACTIVITY_PHOTOS } from '../data/activityPhotos'
import type { Translation } from '../i18n/types'
import { Icon } from './Icon'

export function ActivityGallery({ t }: { t: Translation }) {
  const [expanded, setExpanded] = useState(false)
  const photos = expanded ? ACTIVITY_PHOTOS : ACTIVITY_PHOTOS.slice(0, 6)

  return <div className="activity-gallery" role="group" aria-label={t.common.activityPhotos}>
    <div className="activity-photos" id="activity-photos">
      {photos.map((photo, index) => <a className="activity-photo" key={photo.id} href={photo.src} target="_blank" rel="noreferrer" aria-label={`${t.common.viewPhoto} ${index + 1} — ${t.common.externalLink}`}>
        <img src={photo.src} alt={`${t.common.activityPhoto} ${index + 1}`} width={photo.width} height={photo.height} loading="lazy" decoding="async"/>
        <span className="activity-photo-expand" aria-hidden="true"><Icon name="external" size={17}/></span>
      </a>)}
    </div>
    <button type="button" className="button button--outline activity-gallery-toggle" aria-expanded={expanded} aria-controls="activity-photos" onClick={() => setExpanded(!expanded)}>
      {expanded ? t.common.fewerPhotos : `${t.common.morePhotos} (${ACTIVITY_PHOTOS.length})`}
      <Icon name="chevron" size={17}/>
    </button>
  </div>
}
