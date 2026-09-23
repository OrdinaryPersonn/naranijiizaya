import type { Locale } from '../i18n/types'

/** Based on the supplied NGO and Shagdar Ariunaa website profiles.
 * Mongolian is the source; other locales are translations of that material.
 */
type OrganizationCopy = {
  name: string; tagline: string; shortDescription: string; mission: string; vision: string; values: string[]
  activitiesLabel: string; activities: string[]
  initiative: { title: string; body: string; principles: string[] }
  regional: { title: string; body: string }
  international: { title: string; body: string }
  profile: { label: string; name: string; role: string; paragraphs: string[]; quote: string; goalLabel: string; goal: string; futureLabel: string; future: string }
}

export const ORGANIZATION_COPY: Record<Locale, OrganizationCopy> = {
  mn: {
    name: 'Наран Ижий Заяа НҮТББ',
    tagline: 'Хүн төвтэй эрүүл мэнд • Дэмжлэг • Боломж • Хамтын шийдэл',
    shortDescription: '“Наран Ижий Заяа” НҮТББ нь хавдраас урьдчилан сэргийлэх, эрт илрүүлэлтийг дэмжих, хавдрыг даван туулагчид болон тэдний гэр бүлд нийгэм, сэтгэлзүй, нөхөн сэргээх дэмжлэг үзүүлэх, эрүүл мэндийн тусламж үйлчилгээний хүртээмжийг нэмэгдүүлэх чиглэлээр ажилладаг иргэний нийгмийн байгууллага юм.',
    mission: 'Хавдрын асуудлыг хүн бүхэлдээ — гэр бүл, нийгэм, амьдралын чанартай нь хамт авч үзэж, бодит хэрэгцээнд тулгуурласан хамтын шийдлийг дэмжих.',
    vision: 'Орон нутгийн боломж, хүний нөөц, сургалт, байгууллагуудын хамтын ажиллагаанд тулгуурлан хавдрын тусламж үйлчилгээний хүртээмжийг нэмэгдүүлэх.',
    values: ['Хүн төвтэй эрүүл мэнд', 'Дэмжлэг', 'Боломж', 'Хамтын шийдэл'],
    activitiesLabel: 'Бид юу хийдэг вэ?',
    activities: [
      'Хавдраас урьдчилан сэргийлэх, эрүүл мэндийн боловсрол, мэдээлэл түгээх',
      'Эрт илрүүлэлт, оношилгооны ач холбогдлыг олон нийтэд таниулах',
      'Хавдрыг даван туулагчид болон ар гэрийнхэнд дэмжлэг үзүүлэх',
      'Нөхөн сэргээх тусламж, сэтгэлзүй, хоолзүй, амьдралын чанарын асуудлыг дэмжих',
      'Орон нутагт хавдрын тусламж үйлчилгээний хүртээмж, хүний нөөц, сургалтын хэрэгцээг тодорхойлоход оролцох',
      'Өвчтөн, эмч мэргэжилтэн, эрүүл мэндийн байгууллага, орон нутгийн удирдлага болон иргэний нийгмийн байгууллагуудын хамтын ажиллагааг дэмжих',
      'Бодит асуудлыг судалж, бодит шийдэлд хүрэх санал, санаачилга гаргах',
      'Олон улсын сайн туршлага, мэдлэгийг Монголын нөхцөлд нутагшуулах хамтын ажиллагааг хөгжүүлэх',
    ],
    initiative: {
      title: 'БОЛОМЖ ҮРГЭЛЖ БАЙДАГ',
      body: '“БОЛОМЖ ҮРГЭЛЖ БАЙДАГ” нь Наран Ижий Заяа НҮТББ-ын гол санаачилгын нэг бөгөөд хавдартай хүн, хавдрыг даван туулагч, ар гэр, эмч мэргэжилтэн болон олон нийтийг холбосон уулзалт, сургалт, мэдээлэл, дэмжлэгийн цуврал үйл ажиллагаа юм.',
      principles: ['Асуудлыг нуух бус — ойлгох.', 'Шүүмжлэх бус — ойлголцох.', 'Ойлголцохоос — шийдэлд хүрэх.'],
    },
    regional: {
      title: 'Орон нутгаас — Монгол Улс даяар',
      body: 'НҮТББ нь хавдрын тусламж үйлчилгээний хүртээмжийг орон нутагт нэмэгдүүлэх чиглэлээр аймаг, сумын эрүүл мэндийн байгууллага, эмч мэргэжилтэн, иргэд, хавдрыг даван туулагчидтай хамтран ажиллаж байна. Тухайн орон нутгийн боломж, хүний нөөц, төсөв, сургалт, тоног төхөөрөмж, байгууллагуудын хамтын ажиллагаанд тулгуурлан хэрэгжихүйц шийдлийг хамтран боловсруулахыг зорьдог.',
    },
    international: {
      title: 'Олон улсын хамтын ажиллагаа',
      body: 'Наран Ижий Заяа НҮТББ нь Монгол Улсын мэргэжлийн байгууллага, эмнэлэг, их сургууль, орон нутгийн байгууллага болон олон улсын, гадаадын түнш байгууллагуудтай хамтран ажиллахыг зорьдог. Мэдлэг, технологи, хүний нөөц, сургалт, судалгаа, сайн туршлагыг Монголын нөхцөлд нутагшуулах, Монголын сайн туршлагыг олон улсад хуваалцахыг эрмэлздэг.',
    },
    profile: {
      label: 'Шагдар Ариунаа / Танилцуулга', name: 'Шагдар Ариунаа',
      role: 'Нийгмийн санаачлагч • Хавдрын тусламж, дэмжлэгийн чиглэлээр ажиллагч • Иргэний нийгмийн төлөөлөл',
      paragraphs: [
        'Шагдар Ариунаа нь хавдрыг даван туулагч, иргэний нийгмийн идэвхтэй оролцогчийн хувьд хавдрын асуудлыг хүн, гэр бүл, нийгэм, эрүүл мэндийн тогтолцооны хамтын шийдэл шаардсан асуудал хэмээн үзэж, олон жилийн турш бодит хэрэгцээнд тулгуурласан санаачилга, үйл ажиллагаа хэрэгжүүлж ирсэн.',
        'Тэрээр хавдраас урьдчилан сэргийлэх, эрт илрүүлэх, эмчилгээний хүртээмжийг нэмэгдүүлэх, хавдрыг даван туулагчид болон тэдний гэр бүлд дэмжлэг үзүүлэх, нөхөн сэргээх тусламж, сэтгэлзүй, хоолзүй, амьдралын чанарыг дэмжих чиглэлээр ажилладаг.',
        'Түүний санаачилгаар “БОЛОМЖ ҮРГЭЛЖ БАЙДАГ” цуврал уулзалт, сургалт, нийгмийн үйл ажиллагаа хэрэгжиж, өвчтөн, хавдрыг даван туулагч, ар гэр, эмч мэргэжилтэн, эрүүл мэндийн байгууллага, орон нутгийн удирдлага болон иргэний нийгмийн байгууллагуудыг холбон, бодит асуудлыг сонсож, боломжит шийдлийг хамтран тодорхойлох зорилготой ажиллаж байна.',
        'Тэрээр хавдрын тусламж үйлчилгээг орон нутагт хүртээмжтэй болгох, хүний нөөц, сургалт, оношилгоо, эмчилгээний боломжийг сайжруулах, өвчтөнд хугацаа алдалгүй тусламж хүргэх бодлогын болон практик шийдлийг эрэлхийлдэг. Төр, эрүүл мэндийн болон мэргэжлийн байгууллага, хувийн хэвшил, олон улсын болон гадаадын түнш, иргэний нийгмийн байгууллагуудтай хамтран тогтвортой шийдэл бий болгохыг зорьдог.',
      ],
      quote: 'Шүүмжлэх бус — ойлголцох. Ойлголцохоос — шийдэлд хүрэх.',
      goalLabel: 'Гол зорилго',
      goal: 'Хүн бүр хаана амьдарч байгаагаас үл хамааран хавдраас урьдчилан сэргийлэх мэдлэг, эрт илрүүлэлт, чанартай тусламж үйлчилгээ, нөхөн сэргээх дэмжлэгт тэгш хүртээмжтэй хүрэх боломжийг нэмэгдүүлэх.',
      futureLabel: 'Ирээдүйн зорилт',
      future: 'Монгол Улсад хавдрын тусламж үйлчилгээг хүн төвтэй, хүртээмжтэй, тасралтгүй тогтолцоонд хөгжүүлэхийн зэрэгцээ олон улсын сайн туршлагыг Монголын нөхцөлд нутагшуулж, Монгол Улсын туршлага, санаачилгыг олон улсад таниулахад хувь нэмрээ оруулах.',
    },
  },
  en: {
    name: 'Naran Ijii Zayaa NGO',
    tagline: 'People-centered health • Support • Possibility • Shared solutions',
    shortDescription: 'Naran Ijii Zayaa is a civil society organization working on cancer prevention, early detection, social, psychological and rehabilitation support for cancer survivors and their families, and better access to healthcare.',
    mission: 'To consider the whole person, their family, community and quality of life, and support shared solutions grounded in real needs.',
    vision: 'To improve access to cancer care through local resources, people, training and cooperation between organizations.',
    values: ['People-centered health', 'Support', 'Possibility', 'Shared solutions'],
    activitiesLabel: 'What we do',
    activities: ['Share cancer prevention information and health education', 'Raise awareness of the importance of early detection and diagnosis', 'Support cancer survivors and their families', 'Advocate for rehabilitation, psychological and nutritional support, and quality of life', 'Help identify local needs in access to cancer care, staffing and training', 'Encourage cooperation among patients, health professionals, healthcare organizations, local authorities and civil society', 'Study real challenges and develop proposals and initiatives for practical solutions', 'Develop cooperation to adapt international knowledge and good practices to Mongolia'],
    initiative: {
      title: 'There is always a possibility',
      body: '“БОЛОМЖ ҮРГЭЛЖ БАЙДАГ” (“There is always a possibility”) is one of Naran Ijii Zayaa’s main initiatives: a series of meetings, training, information and support activities connecting people with cancer, survivors, families, health professionals and the public.',
      principles: ['Understand problems instead of hiding them.', 'Seek mutual understanding instead of criticism.', 'Turn understanding into solutions.'],
    },
    regional: { title: 'From local communities to all of Mongolia', body: 'The NGO works with health organizations in aimags and soums, health professionals, residents and cancer survivors to improve local access to cancer care. It aims to develop practical solutions together, based on local resources, staffing, budgets, training, equipment and cooperation between organizations.' },
    international: { title: 'International cooperation', body: 'Naran Ijii Zayaa seeks to work with professional organizations, hospitals, universities and local institutions in Mongolia, as well as international and overseas partners. It aims to adapt knowledge, technology, workforce development, training, research and good practices to Mongolia, and share Mongolian experience internationally.' },
    profile: {
      label: 'Shagdar Ariunaa / Profile', name: 'Shagdar Ariunaa',
      role: 'Social initiator • Cancer care and support advocate • Civil society representative',
      paragraphs: [
        'As a cancer survivor and active participant in civil society, Shagdar Ariunaa sees cancer as an issue requiring shared solutions across individuals, families, communities and the health system. For many years, she has developed initiatives and activities grounded in real needs.',
        'Her work covers cancer prevention, early detection, access to treatment, support for survivors and families, rehabilitation, psychological and nutritional support, and quality of life.',
        'She initiated the “БОЛОМЖ ҮРГЭЛЖ БАЙДАГ” series of meetings, training and community activities. It brings together patients, survivors, families, health professionals, healthcare organizations, local authorities and civil society to listen to real concerns and identify possible solutions together.',
        'She seeks policy and practical solutions that make cancer care more accessible outside the capital, improve staffing, training, diagnosis and treatment, and help people receive timely care. She aims to build sustainable solutions with government, healthcare and professional organizations, businesses, international and overseas partners, and civil society.',
      ],
      quote: 'Seek mutual understanding instead of criticism. Turn understanding into solutions.',
      goalLabel: 'Main goal', goal: 'To increase equitable access to cancer prevention knowledge, early detection, quality care and rehabilitation support, wherever people live.',
      futureLabel: 'Looking ahead', future: 'To contribute to a people-centered, accessible and continuous cancer care system in Mongolia, adapt international good practices to local conditions, and share Mongolia’s experience and initiatives with the world.',
    },
  },
  zh: {
    name: 'Naran Ijii Zayaa 非政府组织',
    tagline: '以人为本的健康 • 支持 • 可能性 • 共同解决',
    shortDescription: 'Naran Ijii Zayaa 是一个公民社会组织，致力于癌症预防、支持早期发现、为癌症幸存者及其家人提供社会、心理和康复支持，并改善医疗服务的可及性。',
    mission: '从人的整体出发，关注家庭、社会和生活质量，支持以实际需求为基础的共同解决方案。',
    vision: '通过地方资源、人员、培训和机构合作，改善癌症照护的可及性。',
    values: ['以人为本的健康', '支持', '可能性', '共同解决'],
    activitiesLabel: '我们的工作',
    activities: ['传播癌症预防知识、健康教育和信息', '提高公众对早期发现和诊断重要性的认识', '支持癌症幸存者及其家人', '推动康复、心理、营养支持及生活质量相关工作', '参与了解地方癌症服务的可及性、人员和培训需求', '促进患者、医疗专业人员、医疗机构、地方政府和公民社会组织之间的合作', '研究实际问题，提出切实可行的建议与倡议', '开展合作，将国际经验和知识应用于蒙古国的实际情况'],
    initiative: { title: '机会始终存在', body: '“БОЛОМЖ ҮРГЭЛЖ БАЙДАГ”（机会始终存在）是 Naran Ijii Zayaa 的主要倡议之一，通过系列交流会、培训、信息分享和支持活动，连接癌症患者、幸存者、家属、医疗专业人员和公众。', principles: ['理解问题，而非掩盖问题。', '寻求理解，而非批评。', '从相互理解走向解决方案。'] },
    regional: { title: '从地方社区走向蒙古国各地', body: '本组织与省、苏木的医疗机构、医疗专业人员、居民及癌症幸存者合作，改善地方癌症照护的可及性。目标是结合当地资源、人员、预算、培训、设备及机构合作，共同制定可行的解决方案。' },
    international: { title: '国际合作', body: 'Naran Ijii Zayaa 希望与蒙古国的专业机构、医院、大学、地方机构以及国际和海外伙伴开展合作。我们致力于将知识、技术、人才培养、培训、研究和良好实践应用于蒙古国的实际情况，并向国际社会分享蒙古国的经验。' },
    profile: {
      label: 'Shagdar Ariunaa / 人物介绍', name: 'Shagdar Ariunaa', role: '社会倡议发起人 • 癌症照护与支持倡导者 • 公民社会代表',
      paragraphs: [
        '作为癌症幸存者和公民社会的积极参与者，Shagdar Ariunaa 认为癌症问题需要个人、家庭、社会和医疗体系共同寻求解决方案。多年来，她持续开展以实际需求为基础的倡议和活动。',
        '她的工作涉及癌症预防、早期发现、改善治疗可及性、支持幸存者及其家人，以及康复、心理、营养支持和生活质量。',
        '她发起了“БОЛОМЖ ҮРГЭЛЖ БАЙДАГ”系列交流会、培训和社会活动，连接患者、幸存者、家属、医疗专业人员、医疗机构、地方政府和公民社会组织，倾听实际问题，共同寻找可行方案。',
        '她探索政策与实践方案，改善首都以外地区的癌症照护、人员、培训、诊断及治疗条件，让患者及时获得帮助。她希望与政府、医疗和专业机构、企业、国际和海外伙伴及公民社会合作，形成可持续的解决方案。',
      ],
      quote: '寻求理解，而非批评。从相互理解走向解决方案。',
      goalLabel: '主要目标', goal: '无论居住在哪里，每个人都能更公平地获得癌症预防知识、早期发现、优质照护和康复支持。',
      futureLabel: '未来方向', future: '为蒙古国发展以人为本、可及且连续的癌症照护体系作出贡献，结合当地情况借鉴国际良好实践，并向世界分享蒙古国的经验和倡议。',
    },
  },
  ru: {
    name: 'НПО «Наран Ижий Заяа»',
    tagline: 'Здоровье с заботой о человеке • Поддержка • Возможности • Совместные решения',
    shortDescription: '«Наран Ижий Заяа» — организация гражданского общества, работающая в сфере профилактики и раннего выявления рака, социальной, психологической и реабилитационной поддержки людей, переживших рак, и их семей, а также повышения доступности медицинской помощи.',
    mission: 'Рассматривать человека в целом — вместе с его семьёй, обществом и качеством жизни — и поддерживать совместные решения, основанные на реальных потребностях.',
    vision: 'Повышать доступность онкологической помощи на основе местных ресурсов, кадров, обучения и сотрудничества организаций.',
    values: ['Забота о человеке', 'Поддержка', 'Возможности', 'Совместные решения'],
    activitiesLabel: 'Чем мы занимаемся',
    activities: ['Распространяем информацию о профилактике рака и знания о здоровье', 'Повышаем осведомлённость о значении раннего выявления и диагностики', 'Поддерживаем людей, переживших рак, и их семьи', 'Содействуем реабилитации, психологической поддержке, вопросам питания и качества жизни', 'Участвуем в определении местных потребностей в онкологической помощи, кадрах и обучении', 'Содействуем сотрудничеству пациентов, специалистов, медицинских организаций, местных властей и гражданского общества', 'Изучаем реальные проблемы и предлагаем практические решения и инициативы', 'Развиваем сотрудничество для адаптации международных знаний и практик к условиям Монголии'],
    initiative: { title: 'Возможность есть всегда', body: '«БОЛОМЖ ҮРГЭЛЖ БАЙДАГ» («Возможность есть всегда») — одна из главных инициатив НПО: серия встреч, обучения, информационных и поддерживающих мероприятий, объединяющих людей с раком, переживших заболевание, их семьи, медицинских специалистов и общественность.', principles: ['Понимать проблемы, а не скрывать их.', 'Искать взаимопонимание вместо критики.', 'От взаимопонимания — к решению.'] },
    regional: { title: 'От местных сообществ — ко всей Монголии', body: 'НПО сотрудничает с медицинскими организациями аймаков и сомонов, специалистами, жителями и людьми, пережившими рак, чтобы улучшить доступ к онкологической помощи на местах. Цель — совместно разрабатывать выполнимые решения с учётом местных ресурсов, кадров, бюджетов, обучения, оборудования и сотрудничества организаций.' },
    international: { title: 'Международное сотрудничество', body: '«Наран Ижий Заяа» стремится сотрудничать с профессиональными организациями, больницами, университетами и местными учреждениями Монголии, а также с международными и зарубежными партнёрами. Организация нацелена на адаптацию знаний, технологий, подготовки кадров, обучения, исследований и успешных практик к условиям Монголии и обмен монгольским опытом с миром.' },
    profile: {
      label: 'Шагдар Ариунаа / Биография', name: 'Шагдар Ариунаа', role: 'Общественный инициатор • Сторонник развития онкологической помощи и поддержки • Представитель гражданского общества',
      paragraphs: [
        'Шагдар Ариунаа, пережившая рак и активно участвующая в гражданском обществе, рассматривает онкологические заболевания как проблему, требующую совместных решений человека, семьи, общества и системы здравоохранения. Многие годы она реализует инициативы и мероприятия, основанные на реальных потребностях.',
        'Её работа охватывает профилактику рака, раннее выявление, доступность лечения, поддержку переживших рак и их семей, реабилитацию, психологическую поддержку, вопросы питания и качества жизни.',
        'По её инициативе проводится серия встреч, обучения и общественных мероприятий «БОЛОМЖ ҮРГЭЛЖ БАЙДАГ». Она объединяет пациентов, переживших рак, семьи, специалистов, медицинские организации, местные власти и гражданское общество, чтобы выслушивать реальные проблемы и вместе определять возможные решения.',
        'Она ищет решения на уровне политики и практики для повышения доступности помощи вне столицы, развития кадров, обучения, диагностики и лечения и своевременной помощи пациентам. Её цель — устойчивые решения в сотрудничестве с государством, медицинскими и профессиональными организациями, бизнесом, международными и зарубежными партнёрами и гражданским обществом.',
      ],
      quote: 'Искать взаимопонимание вместо критики. От взаимопонимания — к решению.',
      goalLabel: 'Главная цель', goal: 'Повышать равный доступ к знаниям о профилактике рака, раннему выявлению, качественной помощи и реабилитационной поддержке независимо от места проживания.',
      futureLabel: 'Взгляд в будущее', future: 'Вносить вклад в развитие ориентированной на человека, доступной и непрерывной системы онкологической помощи в Монголии, адаптировать международные практики к местным условиям и знакомить мир с опытом и инициативами Монголии.',
    },
  },
}
