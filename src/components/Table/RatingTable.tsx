import React, { useMemo, useState, useEffect } from 'react';
import styles from './RatingTable.module.css';
import { ColumnDef } from '@/types';

interface RatingTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  pageSize?: number;
}

export const RatingTable = <T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
}: RatingTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  const tableString = useMemo(() => {
    const header = columns.map((c) => c.title);
    const rows = paginated.map((item) => columns.map((c) => String(item[c.dataIndex] ?? '')));
    const all = [header, ...rows];
    const colWidths = columns.map((_, i) => Math.max(...all.map((r) => r[i].length)));

    const hBorder = '+' + colWidths.map((w) => '-'.repeat(w + 2)).join('+') + '+\n';
    const formatRow = (cells: string[]) =>
      '|' +
      cells
        .map((cell, i) => {
          const w = colWidths[i];
          const pad = ' '.repeat(w - cell.length);
          let txt = cell + pad;
          if (columns[i].align === 'center')
            txt = cell.padStart(cell.length + Math.floor((w - cell.length) / 2)).padEnd(w);
          if (columns[i].align === 'right') txt = pad + cell;
          return ' ' + txt + ' ';
        })
        .join('|') +
      '|\n';

    let s = hBorder + formatRow(header) + hBorder;
    rows.forEach((r) => (s += formatRow(r)));
    s += hBorder;
    return s;
  }, [columns, paginated]);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    const speed = 10;
    const timer = setInterval(() => {
      i++;
      setDisplayed(tableString.slice(0, i));
      if (i >= tableString.length) {
        clearInterval(timer);
        setIsDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [tableString]);

  return (
    <div className={styles.tableWrapper}>
      <pre className={`${styles.tablePre} ${isDone ? styles.tableCursor : ''}`}>{displayed}</pre>

      <div className={styles.pagination}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          {'<'}
        </button>
        <span className={styles.paginationTetx}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
};
