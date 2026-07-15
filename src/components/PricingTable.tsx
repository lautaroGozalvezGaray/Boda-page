import { useEffect, useState } from 'react';

import type { EntryType, PricingPeriod } from '@/config/wedding';
import { formatCurrency } from '@/utils/formatCurrency';
import { getCurrentPeriodIndex, getNextPeriodStart } from '@/utils/pricingPeriod';

interface PricingTableProps {
  periods: PricingPeriod[];
  entryType: EntryType;
  initialCurrentIndex: number;
}

export default function PricingTable({
  periods,
  entryType,
  initialCurrentIndex,
}: PricingTableProps) {
  const [currentIndex, setCurrentIndex] = useState(initialCurrentIndex);
  const amounts = periods.map((period) =>
    entryType === 'reduced' ? period.reducedAmount : period.generalAmount,
  );

  useEffect(() => {
    let timeoutId: number | undefined;

    function updateAndSchedule(): void {
      const now = new Date();
      setCurrentIndex(getCurrentPeriodIndex(periods, now));

      const nextPeriodStart = getNextPeriodStart(periods, now);
      if (!nextPeriodStart) return;

      const delay = Math.max(0, nextPeriodStart.getTime() - now.getTime()) + 50;
      timeoutId = window.setTimeout(updateAndSchedule, delay);
    }

    updateAndSchedule();

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [periods]);

  return (
    <div
      className="card-surface w-full overflow-hidden"
      role="group"
      aria-label="Valor de la tarjeta por período"
    >
      <table className="w-full border-collapse text-left">
        <thead className="bg-sand-100/70">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-medium uppercase tracking-[0.18em] text-ink-600 sm:px-6 sm:py-4"
            >
              Período
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium uppercase tracking-[0.18em] text-ink-600 sm:px-6 sm:py-4"
            >
              Valor
            </th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period, index) => {
            const isCurrent = index === currentIndex;

            return (
              <tr
                key={period.startDate}
                className={`border-b border-sand-100 last:border-b-0 ${
                  isCurrent
                    ? 'border-l-[5px] border-l-blush-700 bg-blush-100 shadow-[inset_0_1px_0_rgba(193,122,99,0.18)]'
                    : 'bg-white'
                }`}
              >
                <th scope="row" className="px-4 py-4 font-medium text-ink-800 sm:px-6 sm:py-5">
                  <div className="flex flex-col items-start gap-1.5">
                    <span className="font-serif text-lg sm:text-xl">{period.label}</span>
                    {isCurrent && (
                    <span className="rounded-full bg-blush-700 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white shadow-sm">
                        Vigente
                      </span>
                    )}
                  </div>
                </th>
                <td className="px-4 py-4 text-right sm:px-6 sm:py-5">
                  <span
                    className={`font-serif text-xl text-ink-800 sm:text-2xl ${
                      isCurrent ? 'font-semibold text-blush-800 sm:text-3xl' : ''
                    }`}
                  >
                    {formatCurrency(amounts[index])}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
