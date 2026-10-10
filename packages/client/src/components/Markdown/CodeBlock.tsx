import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-wrapper">
      <div className="code-block-header">
        <span className="code-lang-tag">{language}</span>
        <button
          onClick={handleCopy}
          className="code-copy-btn"
          title="Скопировать код"
          aria-label="Копировать код"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald" />
              <span>Скопировано!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Копировать</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
};
