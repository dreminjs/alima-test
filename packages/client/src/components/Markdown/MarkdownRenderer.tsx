import React from 'react';
import { CodeBlock } from './CodeBlock';
import { MarkdownTable } from './MarkdownTable';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderFormattedText = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(remaining.substring(lastIndex, match.index));
      }
      const matchedStr = match[0];

      if (matchedStr.startsWith('**') && matchedStr.endsWith('**')) {
        parts.push(
          <strong key={key++} className="font-semibold text-white">
            {matchedStr.slice(2, -2)}
          </strong>
        );
      } else if (matchedStr.startsWith('*') && matchedStr.endsWith('*')) {
        parts.push(<em key={key++}>{matchedStr.slice(1, -1)}</em>);
      } else if (matchedStr.startsWith('`') && matchedStr.endsWith('`')) {
        parts.push(
          <code key={key++} className="md-inline-code">
            {matchedStr.slice(1, -1)}
          </code>
        );
      } else if (matchedStr.startsWith('[') && matchedStr.includes('](')) {
        const titleMatch = matchedStr.match(/\[([^\]]+)\]/);
        const urlMatch = matchedStr.match(/\(([^)]+)\)/);
        if (titleMatch && urlMatch) {
          parts.push(
            <a
              key={key++}
              href={urlMatch[1]}
              target="_blank"
              rel="noreferrer"
              className="md-link"
            >
              {titleMatch[1]}
            </a>
          );
        } else {
          parts.push(matchedStr);
        }
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced Code Block
    if (line.trim().startsWith('```')) {
      const langMatch = line.trim().match(/^```(\w+)?/);
      const language = langMatch && langMatch[1] ? langMatch[1] : 'text';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      const fullCode = codeLines.join('\n');
      elements.push(
        <CodeBlock key={`code-${i}`} language={language} code={fullCode} />
      );
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="md-h1">
          {renderFormattedText(line.substring(2))}
        </h1>
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="md-h2">
          {renderFormattedText(line.substring(3))}
        </h2>
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="md-h3">
          {renderFormattedText(line.substring(4))}
        </h3>
      );
      i++;
      continue;
    }
    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="md-h4">
          {renderFormattedText(line.substring(5))}
        </h4>
      );
      i++;
      continue;
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${i}`} className="md-hr" />);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [line.substring(2)];
      while (i + 1 < lines.length && lines[i + 1].startsWith('> ')) {
        i++;
        quoteLines.push(lines[i].substring(2));
      }
      elements.push(
        <blockquote key={`quote-${i}`} className="md-blockquote">
          {quoteLines.map((ql, qIdx) => (
            <p key={qIdx}>{renderFormattedText(ql)}</p>
          ))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Table
    if (line.includes('|') && lines[i + 1] && lines[i + 1].includes('|') && lines[i + 1].includes('-')) {
      const tableRows: string[] = [];
      while (i < lines.length && lines[i].includes('|')) {
        tableRows.push(lines[i]);
        i++;
      }
      elements.push(<MarkdownTable key={`table-${i}`} rows={tableRows} renderText={renderFormattedText} />);
      continue;
    }

    // List items
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const listItems: { indent: number; text: string; isOrdered: boolean; checked?: boolean }[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.+)$/);
        if (!m) break;
        let itemText = m[3];
        let checked: boolean | undefined = undefined;
        if (itemText.startsWith('[x] ') || itemText.startsWith('[X] ')) {
          checked = true;
          itemText = itemText.substring(4);
        } else if (itemText.startsWith('[ ] ')) {
          checked = false;
          itemText = itemText.substring(4);
        }
        listItems.push({
          indent: m[1].length,
          text: itemText,
          isOrdered: /^\d+\./.test(m[2]),
          checked,
        });
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="md-list">
          {listItems.map((item, idx) => (
            <li key={idx} className="md-list-item">
              {item.checked !== undefined ? (
                <span className={`md-checkbox ${item.checked ? 'checked' : ''}`}>
                  {item.checked ? '✓' : '○'}
                </span>
              ) : (
                <span className="md-bullet">•</span>
              )}
              <div className="md-list-content">{renderFormattedText(item.text)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    elements.push(
      <p key={`p-${i}`} className="md-paragraph">
        {renderFormattedText(line)}
      </p>
    );
    i++;
  }

  return <div className="markdown-body">{elements}</div>;
};
