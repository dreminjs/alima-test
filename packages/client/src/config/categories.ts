import type { AssistantCategory, CategoryMeta } from '../types/assistant';


export const CATEGORIES_CONFIG: Record<AssistantCategory, CategoryMeta> = {
  general: {
    id: 'general',
    label: 'Инженерный совет',
    shortLabel: 'Общее',
    icon: 'Sparkles',
    description: 'Архитектура, алгоритмы, выбор технологий и лучшие практики разработки',
    placeholder: 'Задайте технический вопрос или опишите инженерную задачу...',
    contextPlaceholder: 'Дополнительные условия, версии библиотек, ограничения архитектуры...',
    quickPrompts: [
      {
        title: 'Оптимизация БД-запросов',
        prompt: 'Как оптимизировать медленные SELECT-запросы с множественными JOIN в PostgreSQL? Приведи 4 ключевых шага и примеры индексов.',
      },
      {
        title: 'Кэширование в Redis',
        prompt: 'Предложи стратегию инвалидации кэша (Cache-Aside vs Write-Through) для высоконагруженного сервиса каталога товаров.',
      },
      {
        title: 'Graceful Shutdown',
        prompt: 'Как правильно реализовать Graceful Shutdown в Node.js / NestJS при работе с подключениями к Redis и PostgreSQL?',
      },
    ],
  },
  code_review: {
    id: 'code_review',
    label: 'Ревью кода',
    shortLabel: 'Code Review',
    icon: 'Code2',
    description: 'Анализ безопасности, чистоты кода, производительности и рефакторинг',
    placeholder: 'Опишите, что именно проверить в этом коде...',
    contextPlaceholder: 'Вставьте сюда исходный код функции, компонента или модуля для ревью...',
    quickPrompts: [
      {
        title: 'Ревью React useEffect хука',
        prompt: 'Проверь этот React-компонент на утечки памяти, лишние ререндеры и гонки условий (race conditions).',
        context: `function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users/' + userId)
      .then(r => r.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}`,
      },
      {
        title: 'Ревью асинхронного сервиса',
        prompt: 'Проанализируй обработку ошибок и транзакционность в этом сервисе сохранения заказа.',
        context: `async function createOrder(userId, items) {
  const user = await db.user.findById(userId);
  let total = 0;
  for (const item of items) {
    const product = await db.product.findById(item.id);
    product.stock -= item.qty;
    await product.save();
    total += product.price * item.qty;
  }
  const order = await db.order.create({ userId, total, items });
  await sendNotification(user.email, order.id);
  return order;
}`,
      },
    ],
  },
  decomposition: {
    id: 'decomposition',
    label: 'Декомпозиция задач',
    shortLabel: 'Декомпозиция',
    icon: 'Layers',
    description: 'Разбиение фичи или User Story на задачи для бэкенда, фронтенда, QA и оценку SP',
    placeholder: 'Опишите фичу или пользовательскую историю (User Story)...',
    contextPlaceholder: 'Существующий стек, схемы БД, требования к авторизации или аналитике...',
    quickPrompts: [
      {
        title: 'Фича: Двухфакторная аутентификация (2FA)',
        prompt: 'Декомпозируй задачу внедрения двухфакторной аутентификации (TOTP / Google Authenticator) для личного кабинета пользователя.',
      },
      {
        title: 'Фича: Экспорт отчётов в Excel/CSV',
        prompt: 'Декомпозируй фичу фоновой выгрузки больших отчетов (более 100k строк) в формате XLSX с отправкой ссылки на скачивание.',
      },
      {
        title: 'Фича: Полнотекстовый поиск по заказам',
        prompt: 'Декомпозируй внедрение быстрого автокомплита и полнотекстового поиска по истории заказов и каталогу.',
      },
    ],
  },
  release_notes: {
    id: 'release_notes',
    label: 'Релизные заметки',
    shortLabel: 'Release Notes',
    icon: 'Rocket',
    description: 'Генерация профессионального Changelog по списку коммитов или фичей',
    placeholder: 'Вставьте список выполненных задач, коммитов или пул-реквестов...',
    contextPlaceholder: 'Номер версии (например, v2.4.0), дата релиза, целевая аудитория (пользователи/разработчики)...',
    quickPrompts: [
      {
        title: 'Релиз v1.4.0: Спринт платежей',
        prompt: 'Составь привлекательные Release Notes для релиза платежного шлюза.',
        context: `- feat: Интеграция с СБП (Система быстрых платежей)
- feat: Сохранение привязанных банковских карт
- fix: Исправлен сбой таймаута вебхука при повторной попытке списания
- perf: Ускорено время ответа эндпоинта /api/checkout с 850мс до 120мс благодаря кэшированию
- chore: Обновлены зависимости NestJS до версии 11`,
      },
    ],
  },
  standup: {
    id: 'standup',
    label: 'Дейли стендап',
    shortLabel: 'Стендап',
    icon: 'MessageSquareText',
    description: 'Превращение черновых заметок инженера в структурированный статус для команды',
    placeholder: 'Напишите кратко, что делали и какие сложности возникли...',
    contextPlaceholder: 'Название проекта, номера задач в Jira/Linear, ссылки на PR...',
    quickPrompts: [
      {
        title: 'Стендап Backend-разработчика',
        prompt: 'Преврати эти заметки в аккуратный статус для утреннего командного синка.',
        context: `Вчера: допилил миграцию для таблицы транзакций, пофиксил race condition в редисе при списании бонусов, провел ревью 2 PR-ов от Игоря.
Сегодня: буду тестировать эндпоинты через Jest, подготовлю swagger документацию.
Блокеры: жду от девопсов доступ к тестовому стенду k8s.`,
      },
    ],
  },
};
