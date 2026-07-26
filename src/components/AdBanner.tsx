interface AdBannerProps {
  position: 'left' | 'right' | 'top' | 'bottom'
}

export function AdBanner({ position }: AdBannerProps) {
  // Десктоп: левая/правая колонки (hidden xl:flex)
  // Мобильные: верх/низ (flex xl:hidden)
  const isDesktopSide = position === 'left' || position === 'right'

  return (
    <div
      className={`
        ${isDesktopSide ? 'hidden xl:flex' : 'flex xl:hidden'}
        flex-col items-center justify-start shrink-0
        ${position === 'left' || position === 'right' ? 'pt-24' : ''}
        ${position === 'top' ? 'mb-3 md:mb-6' : ''}
        ${position === 'bottom' ? 'mt-3 md:mt-6' : ''}
      `}
    >
      {/*
        Адаптивный рекламный блок Яндекс.РСЯ / Google AdSense
        Размер подбирается рекламной сетью автоматически.
        Вставьте сюда код рекламного блока из кабинета.
      */}
      <div
        id={`yandex-ad-${position}`}
        className="flex items-center justify-center text-slate-500 text-xs text-center p-4 w-full"
      >
        {/* Замените этот блок на рекламный код */}
        {/* <span>!--Рекламный блок--<br />{positionLabel}</span> */}
      </div>
    </div>
  )
}
