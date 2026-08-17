# Currency Converter — Конвертер валют

Бесплатный онлайн конвертер валют с реальными курсами, погодой и часами в столицах мира.

## Быстрый старт

```bash
npm install
npm run dev
```

## Скрипты

| Команда          | Описание                |
| ---------------- | ----------------------- |
| `npm run dev`    | Запуск dev-сервера      |
| `npm run build`  | Сборка для продакшена   |
| `npm run preview`| Предпросмотр сборки     |
| `npm run lint`   | Проверка кода (oxlint)  |

## Возможности

- **150+ фиатных валют** — курсы с open.er-api.com
- **15 криптовалют** — BTC, ETH, USDT, BNB, XRP, SOL и другие (CoinGecko)
- **Погода и время** — в столицах стран через Open-Meteo API
- **Двуязычность** — русский и английский
- **История конвертаций** — последние 20 операций в localStorage
- **Избранное** — закреплённые пары валют
- **SEO-страницы** — 11 страниц под ключевые запросы
- **PWA** — установка на рабочий стол
- **Аналитика** — 7 целей в Яндекс.Метрике
- **Embed-виджет** — встраивание на другие сайты

## SEO-страницы

| Страница | URL        | Запрос                         |
| -------- | ---------- | ------------------------------ |
| USD/RUB  | `/usd-rub` | курс доллара к рублю           |
| EUR/RUB  | `/eur-rub` | курс евро к рублю              |
| EUR/USD  | `/eur-usd` | евро доллар                    |
| BTC/USD  | `/btc-usd` | биткоин в доллары              |
| RUB/BYN  | `/rub-byn` | рубль белорусский рубль        |
| RUB/KZT  | `/rub-kzt` | рубль тенге                    |
| RUB/TRY  | `/rub-try` | рубль турецкая лира            |
| RUB/EGP  | `/rub-egp` | рубль египетский фунт          |

Каждая страница содержит:

- Уникальный контент (500+ слов)
- FAQ (раскрывающиеся вопросы)
- JSON-LD микроразметку (FAQPage, Article, BreadcrumbList)
- Виджет конвертера
- Карточки погоды и времени

## Аналитика (Яндекс.Метrika)

### Цели

| ID                 | Название              | Когда срабатывает              |
| ------------------ | --------------------- | ------------------------------ |
| `conversion`       | Конвертация           | Пользователь получил результат |
| `swap`             | Обмен валют           | Нажал кнопку ⇄                 |
| `select_currency`  | Выбор валюты          | Выбрал валюту из списка        |
| `add_favorite`     | Добавление в избранное| Нажал "☆ В избранное"          |
| `remove_favorite`  | Удаление из избранного| Нажал "⭐ Из избранного"        |
| `language_change`  | Смена языка           | Переключение RU/EN             |
| `quick_pair`       | Быстрая пара          | Клик по USD/RUB, EUR/RUB и т.д.|

### Настройка целей

1. Зайди в [кабинет Metrika](https://metrika.yandex.ru/111108791/settings/goals)
2. Создай 7 целей с типом "Целевое событие • ex JS-событие"
3. Идентификаторы: `conversion`, `swap`, `select_currency`, `add_favorite`, `remove_favorite`, `language_change`, `quick_pair`

### Что смотреть

- **Конверсии → Цели** — статистика по целям
- **Поведение → Вебвизор** — запись сессий пользователей
- **Поведение → Обзор** — время на сайте, bounce rate
- **Привлечение → Источники** — откуда приходят

## PWA (Progressive Web App)

Сайт можно установить как приложение на рабочий стол.

### Как работает

1. Пользователь заходит на сайт
2. Браузер предлагает "Добавить на рабочий стол?"
3. Приложение открывается в полноэкранном режиме
4. Работает быстрее за счёт кэширования

### Файлы

- `public/manifest.json` — метаданные PWA
- `public/sw.js` — service worker для кэширования
- `public/icons/` — иконки для установки

## Embed-виджет

Другие сайты могут встроить конвертер через iframe:

```html
<iframe
  src="https://cconverter.ru/embed"
  width="400"
  height="450"
  frameborder="0"
  style="border: none; border-radius: 16px;"
></iframe>
```

Инструкции: `https://cconverter.ru/embed-info.html`

## Производительность

| Метрика                | Результат |
| ---------------------- | --------- |
| Lighthouse Performance | 96/100    |
| Accessibility          | 95/100    |
| SEO                    | 100/100   |

### Оптимизации

- **React.memo / useMemo / useCallback** — предотвращение лишних re-render
- **Code splitting** — React вынесен в отдельный чанк
- **Lazy loading** — изображения флагов загружаются по требованию
- **Async fonts** — Google Fonts не блокируют рендер
- **Content visibility** — браузер пропускает рендер невидимого контента
- **Persistent кэш** — курсы в localStorage (24 часа)
- **Debounce 300ms** — задержка конвертации
- **AbortController** — отмена устаревших запросов

## Структура проекта

```text
src/
├── components/       # React-компоненты
│   ├── AdBanner      # Рекламные блоки
│   ├── AmountInput   # Ввод суммы
│   ├── CityInfoCard  # Карточка города (погода + время)
│   ├── ConversionResult  # Результат конвертации
│   ├── CurrencySelector  # Выбор валюты
│   ├── CurrencyTypeSwitcher  # Переключатель Fiat/Crypto
│   ├── EmbedWidget   # Виджет для встраивания
│   ├── FavoritesCard # Избранные пары
│   ├── HistoryCard   # История конвертаций
│   ├── LanguageSwitcher  # Переключатель языка
│   ├── SeoPage       # Шаблон SEO-страницы
│   └── SwapButton    # Кнопка обмена валют
├── hooks/            # Кастомные хуки
│   ├── useCityInfo   # Информация о городе
│   ├── useCurrencyConverter  # Основная логика
│   ├── useFavorites  # Избранные пары
│   └── useHistory    # История конвертаций
├── services/         # API-запросы
│   ├── api.ts        # Курсы валют, погода, время
│   └── crypto.ts     # Курсы криптовалют (CoinGecko)
├── data/             # Данные
│   ├── currencies.ts # Метаданные валют
│   └── seoPages.ts   # Данные для SEO-страниц
├── i18n/             # Интернационализация
│   ├── translations.ts
│   └── LanguageContext.tsx
├── types/            # TypeScript типы
├── utils/            # Утилиты
│   ├── analytics.ts  # Отслеживание целей Metrika
│   ├── cache.ts      # In-memory и persistent кэш
│   ├── flags.ts      # Флаги стран
│   └── weather.ts    # Описание погоды
├── App.tsx           # Главный компонент с роутингом
├── embed.tsx         # Точка входа для виджета
└── main.tsx          # Точка входа
public/
├── embed-info.html   # Инструкция по встраиванию
├── icons/            # Иконки для PWA
├── manifest.json     # Метаданные PWA
├── sw.js             # Service worker
├── favicon.svg       # Иконка сайта
├── og-image.jpg      # Изображение для соцсетей
├── privacy.html      # Политика конфиденциальности
├── terms.html        # Пользовательское соглашение
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

### Свой сервер

```bash
npm run build
# Скопируй папку dist/ на сервер
```

## Лицензия

MIT
