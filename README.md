# Currency Converter — Конвертер валют

Бесплатный онлайн конвертер валют с реальными курсами, погодой и часами в столицах мира.

## Быстрый старт

```bash
npm install
npm run dev
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Сборка для продакшена |
| `npm run preview` | Предпросмотр сборки |
| `npm run lint` | Проверка кода (oxlint) |

## Производительность

| Метрика | Результат |
|---------|-----------|
| Lighthouse Performance | 96/100 |
| Accessibility | 95/100 |
| SEO | 100/100 |

### Оптимизации

- **React.memo / useMemo / useCallback** — предотвращение лишних re-render компонентов
- **Code splitting** — React вынесен в отдельный чанк (53KB vs 243KB之前)
- **Lazy loading** — изображения флагов загружаются по требованию
- **Async fonts** — Google Fonts не блокируют рендер
- **Deferred analytics** — Yandex Metrika загружается после полной загрузки
- **Content visibility** — браузер пропускает рендер невидимого контента
- **GPU ускорение** — `will-change` для тяжёлых элементов
- **CSS оптимизации** — убран backdrop-filter, упрощены анимации

## История изменений

### v1.0 — MVP

- Базовый конвертер валют с API open.er-api.com
- Поддержка 150+ фиатных валют
- Двуязычный интерфейс (русский/английский)
- Адаптивный дизайн для мобильных устройств

### v1.1 — Криптовалюты

- Добавлена поддержка 15 криптовалют (BTC, ETH, USDT, BNB, XRP, SOL, ADA, DOGE, TRX, DOT, LINK, MATIC, LTC, UNI)
- CoinGecko API для получения курсов криптовалют
- Переключатель "Традиционные / Криптовалюты"
- Конвертация через USD (fiat ↔ crypto)

### v1.2 — Погода и время

- Отображение текущей погоды в столицах стран
- Часы с текущим время в часовом поясе столицы
- Open-Meteo API для погодных данных
- Карточки информации о городах

### v1.3 — Оптимизация

- **Производительность:** Lighthouse 53 → 96
- Persistent кэш курсов в localStorage (24 часа)
- Debounce 300ms для конвертации
- Fallback API при недоступности основного
- Обработка ошибок CoinGecko (rate limit 429)

### v1.4 — SEO и аналитика

- JSON-LD структурированные данные
- Open Graph и Twitter Card мета-теги
- Yandex.Metrika (вебвизор, кликкарта, ecommerce)
- robots.txt и sitemap.xml

### v1.5 — UX улучшения

- Фикс: смена языка больше не сбрасывает выбранные валюты
- Fallback-состояния при ошибках загрузки
- Валидация API-ответов (runtime type checking)
- Удалён мёртвый код (App.css, useStats)

## Настройка перед деплоем

### 1. Замена домена

Отредактируй файлы, заменив `your-domain.com` на твой реальный домен:

**`public/robots.txt`:**
```
User-agent: *
Allow: /

Sitemap: https://твой-домен.com/sitemap.xml
```

**`public/sitemap.xml`:**
```xml
<url>
  <loc>https://твой-домен.com/</loc>
  ...
</url>
```

**`index.html`** — Open Graph теги (если нужно):
```html
<meta property="og:url" content="https://твой-домен.com/" />
```

### 2. Favicon

Замени `public/favicon.svg` на свою иконку. Формат SVG, размер рекомендуется 64x64 или 128x128.

### 3. Мета-теги (SEO)

В `index.html` настрой:
- `<title>` — заголовок страницы
- `<meta name="description">` — описание для поисковиков
- `<meta name="keywords">` — ключевые слова

### 4. Счётчики

Счётчики посещений и конвертаций хранятся в `localStorage` браузера пользователя. Для серверной статистики замени логику в `src/hooks/useStats.ts` на запросы к自己的 backend или аналитике (Yandex.Metrika, Google Analytics).

### 5. Реклама (Яндекс.РСЯ / Google AdSense)

Рекламные блоки расположены слева и справа от основного контента (отображаются на экранах шире 1280px). Используются **адаптивные** рекламные блоки — размер подбирается рекламной сетью автоматически.

**Настройка:**
1. Зарегистрируйся в [Яндекс.Рекламной сети](https://partner.yandex.ru/) или [Google AdSense](https://www.google.com/adsense/)
2. Создай **адаптивный** рекламный блок (без фиксированного размера)
3. Получи код блока
4. Вставь код в `src/components/AdBanner.tsx` в место с комментарием `Замените этот блок на рекламный код`

**Пример вставки (Яндекс.РСЯ):**
```tsx
<div id={`yandex-ad-${position}`}>
  <yandex-ad-unit
    data-block-id="ВАШ_ID_БЛОКА"
    data-adaptive="true"
  />
</div>
```

**Пример вставки (Google AdSense):**
```tsx
<div id={`yandex-ad-${position}`}>
  <ins className="adsbygoogle"
    data-ad-client="ВАШ_ID_КЛИЕНТА"
    data-ad-slot="ВАШ_ID_СЛОТА"
    data-ad-format="auto"
    data-full-width-responsive="true"
  />
</div>
```

После вставки рекламного кода вызови `adsbygoogle.push({})` для AdSense или инициализируй блок РСЯ согласно документации.

## Структура проекта

```
src/
├── components/       # React-компоненты
│   ├── AdBanner      # Рекламные блоки (левый/правый)
│   ├── AmountInput   # Ввод суммы
│   ├── CityInfoCard  # Карточка информации о городе
│   ├── ConversionResult  # Результат конвертации
│   ├── CurrencySelector  # Выбор валюты
│   ├── CurrencyTypeSwitcher  # Переключатель传统/крипто
│   ├── LanguageSwitcher  # Переключатель языка
│   └── SwapButton    # Кнопка обмена валют
├── hooks/            # Кастомные хуки
│   ├── useCurrencyConverter  # Основная логика конвертации
│   └── useCityInfo   # Информация о городе
├── services/         # API-запросы
│   ├── api.ts        # Курсы валют, погода, время
│   └── crypto.ts     # Курсы криптовалют (CoinGecko)
├── data/             # Данные
│   └── currencies.ts # Метаданные валют (столицы, флаги)
├── i18n/             # Интернационализация
│   ├── translations.ts
│   └── LanguageContext.tsx
├── types/            # TypeScript типы
├── utils/            # Утилиты
│   ├── cache.ts      # In-memory и persistent кэш
│   ├── flags.ts      # Флаги стран
│   └── weather.ts    # Описание погоды
├── App.tsx           # Главный компонент
└── main.tsx          # Точка входа
public/
├── favicon.svg       # Иконка
├── robots.txt        # Для поисковиков
└── sitemap.xml       # Карта сайта
```

## API

- **Курсы валют:** [open.er-api.com](https://open.er-api.com) — бесплатный, без ключа
- **Криптовалюты:** [CoinGecko](https://www.coingecko.com/) — бесплатный, без ключа
- **Погода:** [Open-Meteo](https://open-meteo.com) — бесплатный, без ключа

## Деплой

### Vercel / Netlify / Cloudflare Pages

1. Загрузи репозиторий
2. Build command: `npm run build`
3. Output directory: `dist`
4. Настрой домен в настройках проекта

### REG.ru (домен + хостинг)

**Шаг 1: Покупка домена**
1. Перейди на [reg.ru](https://www.reg.ru/)
2. Найди свободный домен
3. Купи домен

**Шаг 2: Аренда хостинга**
1. В панели reg.ru выбери «Хостинг»
2. Выбери тариф (для статического сайта подойдёт базовый)
3. Оплати

**Шаг 3: Загрузка файлов**
1. В панели хостинга перейди в «Файловый менеджер» или подключись по FTP
2. Удали стандартные файлы из папки `public_html`
3. Выполни сборку:
```bash
npm run build
```
4. Загрузи содержимое папки `dist/` в `public_html`

**Шаг 4: Настройка DNS**
1. В панели reg.ru перейди в управление доменом
2. Установи DNS-записи:
   - Тип: A, Имя: @, Значение: IP хостинга
   - Тип: A, Имя: www, Значение: IP хостинга
3. Подожди до 24 часов пока DNS обновится

**Шаг 5: SSL-сертификат**
1. В панели reg.ru включи бесплатный SSL (Let's Encrypt)
2. Подожди выдачи сертификата

**Шаг 6: Обнови домен в коде**
Замени `your-domain.com` в файлах:
- `public/robots.txt`
- `public/sitemap.xml`
- `index.html` (og:url)
- Пересобери: `npm run build`
- Загрузи обновлённые файлы

### Свой сервер

```bash
npm run build
# Скопируй папку dist/ на сервер
```

## Лицензия

MIT
