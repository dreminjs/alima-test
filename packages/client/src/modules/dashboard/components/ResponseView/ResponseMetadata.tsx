import React from 'react';
import { Clock, Cpu, Database } from 'lucide-react';

interface ResponseMetadataProps {
  durationMs: number;
  model: string;
  redisStored: boolean;
}

export const ResponseMetadata: React.FC<ResponseMetadataProps> = ({
  durationMs,
  model,
  redisStored,
}) => {
  const formattedDuration = (durationMs / 1000).toFixed(2);

  return (
    <>
      <span className="meta-pill" title={`Время генерации: ${formattedDuration} секунд`}>
        <Clock size={12} />
        <span>{formattedDuration} с</span>
      </span>

      <span className="meta-pill" title="Использованная языковая модель">
        <Cpu size={12} />
        <span>{model}</span>
      </span>

      <span
        className={`meta-pill ${redisStored ? 'meta-redis-ok' : 'meta-redis-warn'}`}
        title={redisStored ? 'Запрос сохранён в Redis' : 'Сохранено локально'}
      >
        <Database size={12} />
        <span>{redisStored ? 'В кэше Redis' : 'Без кэша'}</span>
      </span>
    </>
  );
};
