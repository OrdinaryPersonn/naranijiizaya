import type { Locale } from '../i18n/types'

export const SHOP_COPY: Record<Locale, { title: string; body: string; contents: string[]; impact: string; bulk: string; contact: string; item: string; choose: string; payment: string; phone: string; quantity: string; total: string; reference: string; copy: string; copied: string; failed: string; instructions: string; note: string; open: string }> = {
  mn: {
    title: 'Халамж шингэсэн бэлэг', body: 'Сайн үйлсийн төлөөх сонголт. Хамт олон, байгууллагаараа хайр халамж, талархал, сайн сайхныг түгээх өдөр тутмын хэрэгцээтэй, утга учиртай бэлэг.',
    contents: ['Хэвлэлтэй, олон дахин ашиглах эко тор', 'Эм, өдөр тутмын витамин авч явах гоёмсог сав', '900 мл халуун, хүйтнээ баригч аяны аяга'],
    impact: 'Борлуулалтын бүх орлогыг “Наран ижий заяа” НҮТББ-ын үйл ажиллагаанд зориулна.',
    bulk: 'Байгууллагын ой, тэмдэглэлт өдөр, ажилтнууддаа талархал илэрхийлэх болон хамт олны арга хэмжээнд зориулж өөрийн байгууллагын логотой, тоо хэмжээнд тохирсон багц захиалга авна.',
    contact: 'Messenger-ээр захиалгын мэдээлэл авах', item: 'Бараа', choose: 'Сонгох', payment: 'QR-ээр төлөх', phone: 'Утасны дугаар', quantity: 'Тоо ширхэг', total: 'Нийт дүн', reference: 'Гүйлгээний утга', copy: 'Гүйлгээний утга хуулах', copied: 'Хууллаа', failed: 'Доорх гүйлгээний утгыг сонгож гараар хуулна уу.',
    instructions: 'Бараа, тоо ширхэгээ сонгоод утасны дугаараа оруулна уу. QPay эсвэл Alipay QR-ийг уншуулж, төлбөрийн аппын гүйлгээний утга / тайлбар хэсэгт доорх утгыг оруулна уу.',
    note: 'Утасны дугаар болон барааны дугаарыг төлбөрийн тайлбарт заавал оруулна уу. Бид төлбөрийг гараар шалгаж, захиалгыг баталгаажуулна. Хүргэлт, бэлэн байгаа эсэхийг Messenger-ээр тохиролцоно. Alipay-аар өөр валютаар төлөх бол дүнг урьдчилан тохиролцоно.', open: 'QR зургийг нээх / хадгалах',
  },
  en: {
    title: 'A gift filled with care', body: 'A meaningful choice for a good cause. Share care and gratitude with practical everyday gifts for your team or organization.',
    contents: ['Printed, reusable eco tote', 'Compact case for medicines and daily vitamins', '900 ml insulated travel cup for hot and cold drinks'],
    impact: 'All sales proceeds support the activities of Naran Ijii Zaya NGO.',
    bulk: 'Group and corporate orders are welcome, with your own organization’s logo and quantities tailored to anniversaries, staff appreciation, team events and social responsibility initiatives.',
    contact: 'Order details on Messenger', item: 'Item', choose: 'Select item', payment: 'Pay by QR', phone: 'Phone number', quantity: 'Quantity', total: 'Total', reference: 'Payment reference', copy: 'Copy payment reference', copied: 'Copied', failed: 'Select and copy the reference below manually.',
    instructions: 'Choose an item and quantity, then enter your phone number. Scan either QPay or Alipay and paste the reference below into the payment app’s transaction description / note.',
    note: 'Include your phone and item number in the payment note. We check payments manually before confirming orders. Contact us on Messenger for availability and delivery. Agree the converted amount with us before paying in another currency through Alipay.', open: 'Open / save QR image',
  },
  zh: {
    title: '充满关爱的礼物', body: '为公益选择一份有意义的礼物。为团队和机构准备实用的日常礼品，传递关爱与感谢。',
    contents: ['可重复使用的印花环保袋', '便携药品及维生素收纳盒', '900 毫升冷热保温旅行杯'],
    impact: '全部销售收入用于支持 Naran Ijii Zaya 非政府组织的活动。', bulk: '接受团体和企业批量订单，可按数量定制企业标志，适合周年庆、员工感谢及团队活动。',
    contact: '通过 Messenger 咨询订单', item: '商品', choose: '选择商品', payment: '扫码付款', phone: '电话号码', quantity: '数量', total: '总计', reference: '付款备注', copy: '复制付款备注', copied: '已复制', failed: '请手动选择并复制下方备注。',
    instructions: '选择商品和数量，输入电话号码。扫描 QPay 或支付宝二维码，将下方备注粘贴到付款应用的交易备注中。',
    note: '付款备注必须包含电话号码和商品编号。我们会人工核实付款并确认订单。库存和配送请通过 Messenger 确认。支付宝使用其他货币付款前，请先确认换算金额。', open: '打开 / 保存二维码',
  },
  ru: {
    title: 'Подарок с заботой', body: 'Осмысленный выбор ради доброго дела. Полезные повседневные подарки для вашей команды или организации.',
    contents: ['Многоразовая экосумка с принтом', 'Компактный футляр для лекарств и витаминов', 'Термокружка 900 мл для горячих и холодных напитков'],
    impact: 'Вся выручка от продаж направляется на деятельность НКО «Наран Ижий Заяа».', bulk: 'Принимаем групповые и корпоративные заказы с вашим логотипом и нужным количеством для юбилеев, благодарности сотрудникам и мероприятий.',
    contact: 'Подробности заказа в Messenger', item: 'Товар', choose: 'Выбрать', payment: 'Оплата по QR', phone: 'Номер телефона', quantity: 'Количество', total: 'Итого', reference: 'Назначение платежа', copy: 'Скопировать назначение', copied: 'Скопировано', failed: 'Выделите и скопируйте назначение ниже вручную.',
    instructions: 'Выберите товар и количество, введите телефон. Отсканируйте QPay или Alipay и вставьте назначение ниже в комментарий к платежу.',
    note: 'Обязательно укажите телефон и номер товара в комментарии. Мы проверяем платежи и подтверждаем заказы вручную. Наличие и доставку уточняйте в Messenger. До оплаты через Alipay в другой валюте согласуйте сумму.', open: 'Открыть / сохранить QR',
  },
}
