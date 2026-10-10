import React from 'react';

interface MarkdownTableProps {
  rows: string[];
  renderText: (text: string) => React.ReactNode;
}

export const MarkdownTable: React.FC<MarkdownTableProps> = ({ rows, renderText }) => {
  if (rows.length < 2) return null;

  const parseRow = (rowStr: string) =>
    rowStr
      .split('|')
      .map((c) => c.trim())
      .filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);

  const headers = parseRow(rows[0]);
  const dataRows = rows.slice(2).map(parseRow);

  return (
    <div className="table-responsive">
      <table className="md-table">
        <thead>
          <tr>
            {headers.map((h, idx) => (
              <th key={idx}>{renderText(h)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rIdx) => (
            <tr key={rIdx}>
              {row.map((cell, cIdx) => (
                <td key={cIdx}>{renderText(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
